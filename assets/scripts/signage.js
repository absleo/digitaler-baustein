/**
 * Digital Signage – vollautomatische Anzeige (siehe AGENT.md)
 * Datenquellen (unverändert): members/diamondMembers.js, members/goldMembers.js
 */
(() => {
	'use strict';

	const CFG = {
		stageW: 1920,
		stageH: 1080,
		logoDwellMs: [10000, 14000],
		posterDwellMs: [10000, 20000],
		loadTimeoutMs: 20000,
		videoStallChecks: 4,
		videoStallIntervalMs: 5000,
		fadeMs: 1400,
		goldSpeedPxPerSec: 40,
		driftIntervalMs: 60000,
		driftX: 10,
		driftY: 8,
		reloadAfterMs: 12 * 60 * 60 * 1000,
		reloadHours: [3, 4, 5],
		paths: {
			diamondLogo: '../members/diamond/logos/',
			diamondPoster: '../members/diamond/poster/',
			diamondVideo: '../members/diamond/videos/',
			goldLogo: '../members/gold/logos/'
		}
	};

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

	// Zufällig, aber gleichmäßig verteilt (jedes Element einmal pro Runde), ohne direkte Wiederholung
	function createBag(items) {
		let bag = [];
		let last = null;
		return {
			next() {
				if (bag.length === 0) {
					bag = shuffle(items.slice());
					if (bag.length > 1 && bag[bag.length - 1] === last) {
						[bag[0], bag[bag.length - 1]] = [bag[bag.length - 1], bag[0]];
					}
				}
				last = bag.pop();
				return last;
			}
		};
	}

	function fitStage() {
		const scale = Math.min(window.innerWidth / CFG.stageW, window.innerHeight / CFG.stageH);
		$('#stage').style.transform = `translate(-50%, -50%) scale(${scale})`;
	}

	/* ---------- Logos ---------- */

	// Gold-Boxen sind dunkel: sehr dunkle Logos mit transparentem Hintergrund werden aufgehellt, damit sie lesbar bleiben
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
			// Canvas nicht lesbar (z. B. file://): Logo bleibt unverändert
		}
	}

	function logoImage(src, name, holder) {
		const img = new Image();
		img.alt = name;
		img.decoding = 'async';
		img.onerror = () => {
			const span = document.createElement('span');
			span.className = 'fallback-name';
			span.textContent = name;
			img.replaceWith(span);
		};
		if (holder) img.onload = () => applyTone(holder, img);
		img.src = src;
		return img;
	}

	function loadImage(src) {
		return new Promise((resolve, reject) => {
			const img = new Image();
			const timer = setTimeout(() => reject(new Error('image timeout: ' + src)), CFG.loadTimeoutMs);
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

	/* ---------- Diamond-Leiste ---------- */

	const tiles = new Map();

	function renderDiamondGrid() {
		const grid = $('#diamond-grid');
		diamondMembers.forEach((member) => {
			const tile = document.createElement('div');
			tile.className = 'tile';
			tile.appendChild(logoImage(CFG.paths.diamondLogo + member.logo, member.name));
			grid.appendChild(tile);
			tiles.set(member.id, tile);
		});
	}

	function setActiveTile(member) {
		tiles.forEach((tile, id) => tile.classList.toggle('active', id === member.id));
	}

	/* ---------- Gold-Wall ---------- */

	function renderGoldWall() {
		const track = $('#gold-track');
		const fragment = document.createDocumentFragment();
		// zweimal, damit die Endlosschleife nahtlos (-50 %) läuft
		for (let copy = 0; copy < 2; copy++) {
			goldMembers.forEach((member) => {
				const item = document.createElement('div');
				item.className = 'gold-item';
				item.appendChild(logoImage(CFG.paths.goldLogo + member.logo, member.name, item));
				fragment.appendChild(item);
			});
		}
		track.appendChild(fragment);

		const half = track.scrollWidth / 2;
		track.style.animationDuration = `${Math.round(half / CFG.goldSpeedPxPerSec)}s`;
	}

	/* ---------- Spotlight ---------- */

	const spotlight = $('#spotlight');
	let currentLayer = null;

	function disposeLayer(layer) {
		if (!layer) return;
		const video = layer.el.querySelector('video');
		if (video) {
			video.pause();
			video.removeAttribute('src');
			video.load();
		}
		layer.el.remove();
	}

	function buildCaption(member) {
		const caption = document.createElement('div');
		caption.className = 'caption';
		const chip = document.createElement('div');
		chip.className = 'chip';
		chip.appendChild(logoImage(CFG.paths.diamondLogo + member.logo, member.name));
		const text = document.createElement('div');
		const tag = document.createElement('div');
		tag.className = 'tag';
		tag.textContent = 'Diamond Partner';
		text.append(tag);
		caption.append(chip, text);
		return caption;
	}

	async function buildLogoLayer(member) {
		const dwell = rand(...CFG.logoDwellMs);
		const el = document.createElement('div');
		el.className = 'layer layer-logo';
		el.style.setProperty('--dwell', `${dwell}ms`);
		const card = document.createElement('div');
		card.className = 'logo-card';
		card.appendChild(logoImage(CFG.paths.diamondLogo + member.logo, member.name));
		const tag = document.createElement('div');
		tag.className = 'logo-tag';
		tag.textContent = 'Diamond Partner';
		el.append(card, tag);
		return { el, run: () => sleep(dwell) };
	}

	async function buildPosterLayer(member, file) {
		const src = CFG.paths.diamondPoster + file;
		await loadImage(src);
		const dwell = rand(...CFG.posterDwellMs);
		const el = document.createElement('div');
		el.className = 'layer layer-poster';
		el.style.setProperty('--dwell', `${dwell + CFG.fadeMs}ms`);
		const bg = new Image();
		bg.className = 'bg';
		bg.src = src;
		const fg = new Image();
		fg.className = 'fg';
		fg.src = src;
		el.append(bg, fg, buildCaption(member));
		return { el, run: () => sleep(dwell) };
	}

	function waitForVideo(video) {
		return new Promise((resolve, reject) => {
			const timer = setTimeout(() => cleanup(new Error('video timeout')), CFG.loadTimeoutMs);
			const onReady = () => cleanup();
			const onError = () => cleanup(new Error('video error'));
			function cleanup(err) {
				clearTimeout(timer);
				video.removeEventListener('loadeddata', onReady);
				video.removeEventListener('error', onError);
				err ? reject(err) : resolve();
			}
			video.addEventListener('loadeddata', onReady);
			video.addEventListener('error', onError);
		});
	}

	// Video immer vollständig abspielen; nur bei echtem Stillstand/Fehler wird abgebrochen
	function playToEnd(video) {
		return new Promise((resolve) => {
			let lastTime = -1;
			let stale = 0;
			const finish = () => {
				clearInterval(watchdog);
				video.removeEventListener('ended', finish);
				video.removeEventListener('error', finish);
				resolve();
			};
			video.addEventListener('ended', finish);
			video.addEventListener('error', finish);
			const watchdog = setInterval(() => {
				if (video.ended) return finish();
				if (video.currentTime === lastTime) {
					if (++stale >= CFG.videoStallChecks) return finish();
					if (video.paused) video.play().catch(() => {});
				} else {
					stale = 0;
					lastTime = video.currentTime;
				}
			}, CFG.videoStallIntervalMs);
			video.play().catch(() => {});
		});
	}

	async function buildVideoLayer(member, file) {
		const el = document.createElement('div');
		el.className = 'layer layer-video';
		const video = document.createElement('video');
		video.muted = true;
		video.defaultMuted = true;
		video.playsInline = true;
		video.preload = 'auto';
		video.disablePictureInPicture = true;
		video.src = CFG.paths.diamondVideo + file;
		el.append(video, buildCaption(member));
		try {
			await waitForVideo(video);
		} catch (err) {
			video.removeAttribute('src');
			video.load();
			throw err;
		}
		return { el, run: () => playToEnd(video) };
	}

	function buildLayer(member, item) {
		if (item.type === 'poster') return buildPosterLayer(member, item.file);
		if (item.type === 'video') return buildVideoLayer(member, item.file);
		return buildLogoLayer(member);
	}

	async function present(member, item) {
		const layer = await buildLayer(member, item);
		const previous = currentLayer;
		currentLayer = layer;
		spotlight.appendChild(layer.el);
		setActiveTile(member);
		requestAnimationFrame(() => requestAnimationFrame(() => layer.el.classList.add('in')));
		if (previous) {
			previous.el.classList.remove('in');
			setTimeout(() => disposeLayer(previous), CFG.fadeMs + 200);
		}
		await layer.run();
	}

	// Poster/Video haben Vorrang; das Logo wird nur gezeigt, wenn kein Medium vorhanden ist
	function mediaFor(member) {
		const items = [];
		(member.poster || []).forEach((file) => items.push({ type: 'poster', file }));
		if (member.video && member.video.length >= 5) items.push({ type: 'video', file: member.video });
		return items.length ? items : [{ type: 'logo' }];
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

	async function runSpotlight() {
		const memberBag = createBag(diamondMembers);
		const mediaBags = new Map(diamondMembers.map((m) => [m, createBag(mediaFor(m))]));

		for (;;) {
			await maybeReload();
			const member = memberBag.next();
			const item = mediaBags.get(member).next();
			try {
				await present(member, item);
			} catch (err) {
				console.warn('Spotlight-Fehler, Logo-Fallback', member.name, item, err);
				try {
					await present(member, { type: 'logo' });
				} catch (err2) {
					await sleep(2000);
				}
			}
		}
	}

	/* ---------- Burn-in-Schutz ---------- */

	function startDrift() {
		const drift = $('#drift');
		let t = 0;
		const step = () => {
			t++;
			const x = Math.round(CFG.driftX * Math.sin(t * 0.9));
			const y = Math.round(CFG.driftY * Math.cos(t * 1.3));
			drift.style.transform = `translate(${x}px, ${y}px)`;
		};
		step();
		setInterval(step, CFG.driftIntervalMs);
	}

	/* ---------- Start ---------- */

	function init() {
		document.addEventListener('contextmenu', (e) => e.preventDefault());
		document.documentElement.style.setProperty('--fade', `${CFG.fadeMs}ms`);
		fitStage();
		window.addEventListener('resize', fitStage);
		renderDiamondGrid();
		renderGoldWall();
		startDrift();
		runSpotlight();
	}

	if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
	else init();
})();
