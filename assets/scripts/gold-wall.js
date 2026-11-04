/**
 * Gold-Screen – 2x2 Poster-Wall mit diagonaler Rotation (siehe AGENT-GOLD.md)
 * Datenquellen (unverändert): members/diamondMembers.js, members/goldMembers.js
 */
(() => {
	'use strict';

	const CFG = {
		intervalMs: [8000, 15000],
		fadeMs: 1800,
		loadTimeoutMs: 20000,
		weight: { diamond: 3, gold: 1 },
		fallbackFactor: 0.25,
		// Mindestabstand (in vergebenen Kacheln), bevor ein Unternehmen erneut gezogen werden darf
		cooldown: { diamond: 8, gold: 30 },
		coverRatio: [0.75, 1.35],
		reloadAfterMs: 12 * 60 * 60 * 1000,
		reloadHours: [3, 4, 5],
		paths: {
			diamondLogo: '../members/diamond/logos/',
			diamondPoster: '../members/diamond/poster/',
			goldLogo: '../members/gold/logos/',
			goldPoster: '../members/gold/poster/'
		}
	};

	// Kachel-Indizes: 0 = [0][0], 1 = [0][1], 2 = [1][0], 3 = [1][1]
	const DIAGONALS = [[0, 3], [1, 2]];

	const $ = (sel) => document.querySelector(sel);
	const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
	const rand = (min, max) => min + Math.random() * (max - min);
	const startedAt = Date.now();

	function shuffle(arr) {
		for (let i = arr.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[arr[i], arr[j]] = [arr[j], arr[i]];
		}
		return arr;
	}

	// Jedes Element einmal pro Runde, keine direkte Wiederholung über Rundengrenzen
	function createBag(items) {
		let bag = [];
		let last = null;
		return () => {
			if (bag.length === 0) {
				bag = shuffle(items.slice());
				if (bag.length > 1 && bag[bag.length - 1] === last) {
					[bag[0], bag[bag.length - 1]] = [bag[bag.length - 1], bag[0]];
				}
			}
			last = bag.pop();
			return last;
		};
	}

	/* ---------- Unternehmen ---------- */

	function buildCompanies() {
		const list = [];
		diamondMembers.forEach((m) => {
			const posters = (m.poster || []).filter(Boolean).map((f) => CFG.paths.diamondPoster + f);
			list.push(makeCompany('diamond', m, CFG.paths.diamondLogo, posters));
		});
		goldMembers.forEach((m) => {
			const posters = m.poster ? [CFG.paths.goldPoster + m.poster] : [];
			list.push(makeCompany('gold', m, CFG.paths.goldLogo, posters));
		});
		return list;
	}

	function makeCompany(tier, member, logoPath, posters) {
		return {
			id: tier + ':' + (member.id ?? member.name) + ':' + member.logo,
			nameKey: String(member.name).trim().toLowerCase(),
			tier,
			name: member.name,
			logo: logoPath + member.logo,
			posters,
			brokenPosters: new Set(),
			nextPoster: null,
			lastPick: -Infinity
		};
	}

	function availablePosters(company) {
		return company.posters.filter((p) => !company.brokenPosters.has(p));
	}

	function pickPoster(company) {
		const posters = availablePosters(company);
		if (posters.length === 0) return null;
		if (!company.nextPoster) company.nextPoster = createBag(posters);
		return company.nextPoster();
	}

	/* ---------- Auswahl (Priorisierung, keine Doppelungen) ---------- */

	function createPicker(companies) {
		let counter = 0;

		function weightOf(c) {
			const base = CFG.weight[c.tier];
			return availablePosters(c).length ? base : base * CFG.fallbackFactor;
		}

		return function pick(visible) {
			const blockedNames = new Set([...visible].map((c) => c.nameKey));
			const free = companies.filter((c) => !visible.has(c) && !blockedNames.has(c.nameKey));
			let pool = free.filter((c) => counter - c.lastPick >= CFG.cooldown[c.tier]);
			if (pool.length === 0) {
				// alle noch im Cooldown: das am längsten nicht gezeigte Unternehmen nehmen
				const oldest = Math.min(...free.map((c) => c.lastPick));
				pool = free.filter((c) => c.lastPick === oldest);
			}
			const total = pool.reduce((sum, c) => sum + weightOf(c), 0);
			let r = Math.random() * total;
			let chosen = pool[pool.length - 1];
			for (const c of pool) {
				r -= weightOf(c);
				if (r <= 0) {
					chosen = c;
					break;
				}
			}
			chosen.lastPick = ++counter;
			return chosen;
		};
	}

	/* ---------- Medien laden ---------- */

	function loadImage(src) {
		return new Promise((resolve, reject) => {
			const img = new Image();
			const timer = setTimeout(() => {
				img.onload = img.onerror = null;
				reject(new Error('image timeout: ' + src));
			}, CFG.loadTimeoutMs);
			img.onload = () => {
				clearTimeout(timer);
				resolve(img);
			};
			img.onerror = () => {
				clearTimeout(timer);
				reject(new Error('image error: ' + src));
			};
			img.decoding = 'async';
			img.src = src;
		});
	}

	// Sehr dunkle Logos ohne eigenen Hintergrund werden aufgehellt, damit sie auf der dunklen Karte lesbar bleiben
	const toneCanvas = document.createElement('canvas');
	toneCanvas.width = toneCanvas.height = 32;
	const toneCtx = toneCanvas.getContext('2d', { willReadFrequently: true });

	function applyTone(holder, img) {
		try {
			toneCtx.clearRect(0, 0, 32, 32);
			toneCtx.drawImage(img, 0, 0, 32, 32);
			const data = toneCtx.getImageData(0, 0, 32, 32).data;
			let weight = 0;
			let lum = 0;
			let opaque = 0;
			for (let i = 0; i < data.length; i += 4) {
				const a = data[i + 3] / 255;
				if (a > 0.95) opaque++;
				weight += a;
				lum += a * (0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2]);
			}
			if (weight < 1) return;
			const hasOwnBackground = opaque / (data.length / 4) > 0.9;
			if (!hasOwnBackground && lum / weight / 255 < 0.3) holder.dataset.tone = 'invert';
		} catch (e) {
			// Canvas nicht lesbar: Logo bleibt unverändert
		}
	}

	/* ---------- Layer ---------- */

	function lifeVars(el) {
		const maxLife = (CFG.intervalMs[1] * 2 + CFG.fadeMs * 2) / 1000;
		el.style.setProperty('--life', `${Math.round(maxLife + 4)}s`);
		el.style.setProperty('--zoom', (1.04 + Math.random() * 0.03).toFixed(3));
		el.style.setProperty('--tx', `${(rand(-1, 1)).toFixed(2)}%`);
		el.style.setProperty('--ty', `${(rand(-1, 1)).toFixed(2)}%`);
		el.style.setProperty('--ox', `${Math.round(rand(30, 70))}%`);
		el.style.setProperty('--oy', `${Math.round(rand(30, 70))}%`);
	}

	function buildPosterLayer(img, tileEl) {
		const el = document.createElement('div');
		el.className = 'layer';
		lifeVars(el);
		const rect = tileEl.getBoundingClientRect();
		const tileAspect = rect.width / rect.height;
		const ratio = img.naturalWidth / img.naturalHeight / tileAspect;
		// nahe am Kachelformat: füllen; sonst vollständig zeigen (kein starkes Beschneiden/Verzerren)
		const useCover = ratio >= CFG.coverRatio[0] && ratio <= CFG.coverRatio[1];

		const fg = img;
		fg.className = 'poster-img' + (useCover ? ' cover' : '');
		fg.alt = '';
		if (!useCover) {
			const bg = new Image();
			bg.className = 'poster-bg';
			bg.alt = '';
			bg.src = img.src;
			el.appendChild(bg);
		}
		el.appendChild(fg);
		return el;
	}

	async function buildBrandLayer(company) {
		const el = document.createElement('div');
		el.className = 'layer brand ' + company.tier;
		lifeVars(el);
		const card = document.createElement('div');
		card.className = 'brand-card';
		const logo = new Image();
		logo.alt = company.name;
		logo.decoding = 'async';
		logo.onload = () => applyTone(card, logo);
		logo.onerror = () => {
			const span = document.createElement('span');
			span.className = 'fallback-name';
			span.textContent = company.name;
			logo.replaceWith(span);
		};
		logo.src = company.logo;
		card.appendChild(logo);
		const tag = document.createElement('div');
		tag.className = 'brand-tag';
		tag.textContent = company.tier === 'diamond' ? 'Diamond Partner' : 'Gold Partner';
		el.append(card, tag);
		return el;
	}

	// Poster, falls ladbar; sonst (oder ohne Poster) Branding-Kachel – nie eine leere Kachel
	async function buildLayerFor(company, tileEl) {
		for (let attempt = 0; attempt < 3; attempt++) {
			const src = pickPoster(company);
			if (!src) break;
			try {
				const img = await loadImage(src);
				return buildPosterLayer(img, tileEl);
			} catch (err) {
				console.warn('Poster nicht ladbar', src, err);
				company.brokenPosters.add(src);
				company.nextPoster = null;
			}
		}
		return buildBrandLayer(company);
	}

	/* ---------- Wall ---------- */

	const tiles = [];

	function disposeLayer(layer) {
		layer.querySelectorAll('img').forEach((img) => {
			img.removeAttribute('src');
		});
		layer.remove();
	}

	function show(tile, layer, company) {
		const previous = tile.layer;
		tile.layer = layer;
		tile.company = company;
		tile.el.appendChild(layer);
		requestAnimationFrame(() => requestAnimationFrame(() => layer.classList.add('in')));
		if (previous) {
			previous.classList.remove('in');
			setTimeout(() => disposeLayer(previous), CFG.fadeMs + 300);
		}
	}

	async function swap(indices, pick) {
		const visible = new Set(tiles.map((t) => t.company).filter(Boolean));
		// die zu ersetzenden Kacheln zählen nicht mehr als sichtbar-blockierend für andere Unternehmen,
		// die neuen müssen aber von den verbleibenden Kacheln verschieden sein
		indices.forEach((i) => tiles[i].company && visible.delete(tiles[i].company));
		const chosen = [];
		for (const i of indices) {
			const company = pick(new Set([...visible, ...chosen]));
			chosen.push(company);
		}
		const layers = await Promise.all(indices.map((i, k) => buildLayerFor(chosen[k], tiles[i].el)));
		indices.forEach((i, k) => show(tiles[i], layers[k], chosen[k]));
	}

	async function maybeReload() {
		if (Date.now() - startedAt < CFG.reloadAfterMs) return;
		if (!CFG.reloadHours.includes(new Date().getHours())) return;
		try {
			const res = await fetch(location.href, { cache: 'no-store' });
			if (res.ok) location.reload();
		} catch (e) {
			// offline: weiterlaufen
		}
	}

	async function run() {
		const pick = createPicker(buildCompanies());
		await swap([0, 1, 2, 3], pick).catch((err) => console.warn('Start-Fehler', err));

		let step = 0;
		for (;;) {
			await sleep(rand(...CFG.intervalMs));
			await maybeReload();
			try {
				await swap(DIAGONALS[step % 2], pick);
			} catch (err) {
				console.warn('Wechsel-Fehler', err);
			}
			step++;
		}
	}

	function init() {
		document.addEventListener('contextmenu', (e) => e.preventDefault());
		document.documentElement.style.setProperty('--fade', `${CFG.fadeMs}ms`);
		const wall = $('#wall');
		wall.querySelectorAll('.tile').forEach((el) => tiles.push({ el, layer: null, company: null }));
		run();
	}

	if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
	else init();
})();
