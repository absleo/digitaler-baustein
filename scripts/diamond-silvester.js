/*******************
 * DIAMOND MEMBERS
 ******************/
/// <reference path="./members/diamondMembers.js" />



/*******************
 * GOLD MEMBERS
 ******************/
/// <reference path="./members/goldMembers.js" />



/*******************
 * REFERENCES
 ******************/
let diamond_member1_img1 = document.querySelector(`#diamond-member-1_img1`);
let diamond_member1_img2 = document.querySelector(`#diamond-member-1_img2`);



/*******************
* PRELOAD
********************/
let preload = `<link rel="preload" as="image" href="./members/default/default-ad_16-9.jpg"></link>`;
for (let i = 0; i < diamondMembers.length; i++) {
	preload += `<link rel=\"preload\" as=\"image\" href=\"./members/diamond/logos/${diamondMembers[i].logo}\"></link>`;
	for (let j = 0; j < diamondMembers[i].poster.length; j++) {
		preload += `<link rel=\"preload\" as=\"image\" href=\"./members/diamond/poster/${diamondMembers[i].poster[j]}\"></link>`;
	}
}
document.querySelector('head').innerHTML += preload;




/*******************
* INIT
********************/
let memberTimeout;
let autoPosterTimeout;
let autoOverlayInterval = setInterval(openAutoOverlay, 5*60*1000);
let memberInterval = setInterval(newMembers, 12*1000);
newMembers();

function newMembers(){
	shuffleArray(diamondMembers);

	mainmemberAnimateFader(diamondMembers[0]);
	
	memberTimeout = setTimeout( ()=>{
		sidememberAnimateFader('#diamond-member-2', diamondMembers[1]);
		sidememberAnimateFader('#diamond-member-3', diamondMembers[2]);
		sidememberAnimateFader('#diamond-member-4', diamondMembers[3]);
		sidememberAnimateFader('#diamond-member-5', diamondMembers[4]);
		sidememberAnimateFader('#diamond-member-6', diamondMembers[5]);
		sidememberAnimateFader('#diamond-member-7', diamondMembers[6]);
	}, 500)
	
}





/*******************
* FADE TEXT ANIMATION
********************/
function sidememberAnimateFader(htmlBox, diamondMember) {
    document.querySelector(`${htmlBox} .txt2`).innerHTML = `<img src=\"./members/diamond/logos/${diamondMember.logo}\" data-id=\"${diamondMember.id}\" alt=\"\">`;

	gsap.timeline({ delay: 0, repeat: 0 })
		.set(`${htmlBox} .txt`, { opacity: 1, scale: 1, xPercent: -50, yPercent: 0, immediateRender: true })
		.to(`${htmlBox} .txt`, { duration: 1.2, opacity: 0, scale: 0.9, xPercent: -50, yPercent: 0, ease: Power4.easeInOut })

	gsap.timeline({ delay: 0, repeat: 0 })
		.set(`${htmlBox} .txt2`, { opacity: 0, scale: 1.15, xPercent: -50, yPercent: 0, immediateRender: true })
		.to(`${htmlBox} .txt2`, { duration: 1.2, opacity: 1, scale: 1, xPercent: -50, yPercent: 0, ease: Power4.easeInOut })

	setTimeout(() => {
		document.querySelector(`${htmlBox} .txt`).innerHTML = `<img src=\"./members/diamond/logos/${diamondMember.logo}\" data-id=\"${diamondMember.id}\" alt=\"\">`;
		document.querySelector(`${htmlBox} .txt`).style.opacity = 1;
		gsap.set(`${htmlBox} .txt`, { xPercent: -50, yPercent: 0, scale: 1 });
		document.querySelector(`${htmlBox} .txt2`).style.opacity = 0;
		gsap.set(`${htmlBox} .txt2`, { xPercent: -50, yPercent: 0, scale: 1 });
	}, 1300)
}





/*******************
* FADE IMAGE ANIMATION
********************/
function mainmemberAnimateFader(diamondMember) {
	// Create or get text overlay element
	let textOverlay = document.getElementById('happy-new-year-text');
	if(!textOverlay) {
		textOverlay = document.createElement('div');
		textOverlay.id = 'happy-new-year-text';
		textOverlay.style.cssText = `
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			z-index: 150;
			font-size: 9vh;
			font-weight: bold;
			color: #fff;
			text-align: center;
			text-shadow: 0 0 2vh rgba(255,215,0,0.8), 0 0 4vh rgba(255,107,107,0.6);
			letter-spacing: 0.3vh;
			opacity: 0;
			pointer-events: none;
		`;
		textOverlay.innerHTML = 'HAPPY<br>NEW YEAR';
		document.getElementById('diamond-member-1').appendChild(textOverlay);
	}

	// Fade out current logo
	gsap.timeline({ delay: 0, repeat: 0 })
		.set(`#diamond-member-1_img1`, { opacity: 1, scale: 1, immediateRender: true })
		.to(`#diamond-member-1_img1`, { duration: 1, opacity: 0, scale: 0.9, ease: Power4.easeInOut })

	// Show HAPPY NEW YEAR text
	gsap.timeline({ delay: 0.5, repeat: 0 })
		.to(textOverlay, { duration: 0.8, opacity: 1, scale: 1.1, ease: Power2.easeOut })
		.to(textOverlay, { duration: 0.8, opacity: 0, scale: 0.95, ease: Power2.easeIn, delay: 1.2 })

	// Prepare new logo
	setTimeout(() => {
		diamond_member1_img2.src = `./members/diamond/logos/${diamondMember.logo}`;
		diamond_member1_img2.dataset.id = `${diamondMember.id}`;
	}, 1000);

	// Fade in new logo after text disappears
	gsap.timeline({ delay: 2.8, repeat: 0 })
		.set(`#diamond-member-1_img2`, { opacity: 0, scale: 1.15, immediateRender: true })
		.to(`#diamond-member-1_img2`, { duration: 1.5, opacity: 1, scale: 1, ease: Power4.easeInOut })

	setTimeout( ()=> {
		diamond_member1_img1.src = `./members/diamond/logos/${diamondMember.logo}`;
		diamond_member1_img1.dataset.id = `${diamondMember.id}`;
		diamond_member1_img1.style.opacity = 1;
		diamond_member1_img1.style.transform = 'scale(1)';
		diamond_member1_img2.style.opacity = 0;
	}, 5400)
}





/*******************
* OVERLAY
********************/
let overlay = document.querySelector('#member-overlay');
let overlayLogo = document.querySelector('#member-overlay #member-logo');
let overlayAd = document.querySelector('#member-overlay #member-ad');
let overlayAdVideo = document.querySelector('#member-overlay #member-ad-video');
let overlayProgress = document.querySelector('#member-overlay #member-progress');
let timeoutContinue;
let timeoutCloseOverlay;
let overlayReadyToOpen = true;
let progresstween;
function showOverlay(box){
	function openOverlay(duration) {
		overlay.style.zIndex = 1000;
		overlay.style.opacity = 1;
		overlayProgress.style.width = '0%';
		overlayProgress.style.height = '0.5vh';
		progresstween = gsap.timeline({ delay: 0, repeat: 0, ease: 'none' })
			.to(overlayProgress, { duration: duration/1000, width: '100%', ease: 'none'})
		setTimeout(()=>{ overlayReadyToClose = true; }, 600);
		timeoutCloseOverlay = setTimeout(()=>{ hideOverlay(); }, duration);
	}

	if(overlayReadyToOpen) {
		clearInterval(memberTimeout);
		clearInterval(autoOverlayInterval);
		clearTimeout(timeoutContinue);
		clearTimeout(timeoutCloseOverlay);
		clearInterval(memberInterval);
		overlayReadyToOpen = false;
		
		// Stop background animation while overlay open
		document.body.style.animation = 'none';
		document.body.offsetHeight;

		let box_active = box;
		if(box.classList[0] == "txt2") { box_active = box.children[0]; }
		let id = box_active.dataset.id;
		let currentDiamondMember = diamondMembers.find( member => member.id == id);
		overlayLogo.src = box_active.src;

		if(currentDiamondMember.poster.length > 0 || currentDiamondMember.video.length >= 5) {
			let numberOfAds = currentDiamondMember.poster.length;
			if(currentDiamondMember.video.length >= 5) { numberOfAds++; }
			let randomPoster = Math.floor(Math.random() * numberOfAds);

			if( randomPoster == currentDiamondMember.poster.length ) {
				overlayAdVideo.src = `./members/diamond/videos/${currentDiamondMember.video}`;
				overlayAdVideo.load();
				overlayAdVideo.style.position = 'relative';
				overlayAdVideo.style.top = '0';
				overlayAdVideo.onloadeddata = function() {
					overlayAdVideo.muted = true;
					let videoDuration = overlayAdVideo.duration * 1000;
					if(videoDuration) {
						openOverlay(videoDuration);
						setTimeout(()=>{ overlayAdVideo.play(); }, 250);
					}
				}
			} else {
				overlayAd.src = `./members/diamond/poster/${currentDiamondMember.poster[randomPoster]}`;
				openOverlay(20000);
			}
		} else {
			overlayAd.src = `./members/default/default-ad_16-9.jpg`;
			openOverlay(20000);
		}
	}
}
let overlayReadyToClose = false;
function hideOverlay(){
	if(overlayReadyToClose) {
		clearTimeout(timeoutCloseOverlay);
		clearInterval(autoPosterTimeout);
		overlayReadyToClose = false;
		overlay.style.opacity = 0;

		setTimeout(()=>{
			overlayLogo.src = '';
			overlayAd.src = '';
			overlayAdVideo.onloadeddata = null;
			overlayAdVideo.pause();
			overlayAdVideo.src = '';
			overlayAdVideo.style.position = 'absolute';
			overlayAdVideo.style.top = '200vh';
			overlay.style.zIndex = -1000;
			if(progresstween) { progresstween.kill(); }
			overlayProgress.style.width = '0%';
			overlayProgress.style.height = '0vh';
			currentAdIndex = 0;
			overlayReadyToOpen = true;
		}, 500);

		// Resume
		timeoutContinue = setTimeout( ()=> {
			newMembers();
			memberInterval = setInterval(newMembers, 12*1000);
			document.body.style.animation = 'gradientShift 24s ease-in-out 0.5s infinite';
		}, 6000)
		autoOverlayInterval = setInterval(openAutoOverlay, 5*60*1000);
	}
}
function hideOverlayPrevent(event){ event.stopPropagation(); }



/*******************
* AUTO OVERLAY
********************/
let currentAdIndex;
let diamondMembersExpanded = [];

createDiamondMembersExpanded();
function createDiamondMembersExpanded() {
	diamondMembersExpanded = [];
	for (let i = 0; i < diamondMembers.length; i++) {
		if(diamondMembers[i].poster && diamondMembers[i].poster.length > 0 ) {
			for (let j = 0; j < diamondMembers[i].poster.length; j++) {
				diamondMembersExpanded.push({ id: diamondMembers[i].id, name: diamondMembers[i].name, logo: diamondMembers[i].logo, poster: diamondMembers[i].poster[j] })
			}
		}
		if(diamondMembers[i].video && diamondMembers[i].video.length >= 5 ) {
			diamondMembersExpanded.push({ id: diamondMembers[i].id, name: diamondMembers[i].name, logo: diamondMembers[i].logo, video: diamondMembers[i].video })
		}
	}
}
function openAutoOverlay(){
	if(overlayReadyToOpen) {
		clearInterval(memberTimeout);
		clearInterval(autoOverlayInterval);
		clearTimeout(timeoutContinue);
		clearTimeout(timeoutCloseOverlay);
		clearInterval(memberInterval);
		overlayReadyToOpen = false;
		currentAdIndex = 0;
		shuffleArray(diamondMembersExpanded);
		nextAutoPoster();
		overlay.style.zIndex = 1000;
		overlay.style.opacity = 1;
		setTimeout(()=>{ overlayReadyToClose = true; }, 600);
	}
}
function nextAutoPoster(){
	if(currentAdIndex >= 1) { hideOverlay(); }
	else {
		overlayAd.src = '';
		overlayAdVideo.pause();
		overlayAdVideo.src = '';
		overlayAdVideo.style.position = 'absolute';
		overlayAdVideo.style.top = '200vh';
		if(progresstween) { progresstween.kill(); }
		overlayLogo.src = `./members/diamond/logos/${diamondMembersExpanded[currentAdIndex].logo}`;

		if(diamondMembersExpanded[currentAdIndex].video) {
			overlayAdVideo.src = `./members/diamond/videos/${diamondMembersExpanded[currentAdIndex].video}`;
			overlayAdVideo.load();
			overlayAdVideo.style.position = 'relative';
			overlayAdVideo.style.top = '0';
			overlayAdVideo.onloadeddata = function() {
				overlayAdVideo.muted = true;
				let videoDuration = overlayAdVideo.duration * 1000;
				if(videoDuration) {
					openOverlay(videoDuration);
					setTimeout(()=>{ overlayAdVideo.play(); }, 250);
				}
			}
		} else {
			overlayAd.src = `./members/diamond/poster/${diamondMembersExpanded[currentAdIndex].poster}`;
			openOverlay(10000);
		}
	}
	function openOverlay(duration) {
		overlayProgress.style.width = '0%';
		overlayProgress.style.height = '0.5vh';
		progresstween = gsap.timeline({ delay: 0, repeat: 0, ease: 'none' })
			.to(overlayProgress, { duration: duration/1000, width: '100%', ease: 'none'})
		autoPosterTimeout = setTimeout(()=>{ nextAutoPoster(); }, duration);
		currentAdIndex++;
	}
}




/*******************
* GOLD MEMBERS - CSS DATENSTROM
********************/
startGoldMembers();
function startGoldMembers() {
	let goldMembersNames = [];
	for (let i = 0; i < goldMembers.length; i++) { goldMembersNames.push(goldMembers[i].name); }
	setupDatastreamLanes(goldMembersNames);
}

function setupDatastreamLanes(names) {
	const lanePositions = ['4vh','24vh','30vh','66vh','72vh','92vh'];
	const numberOfLanes = 6;
	for (let laneIndex = 0; laneIndex < numberOfLanes; laneIndex++) {
		const lane = document.getElementById(`lane-${laneIndex}`);
		if (!lane) continue;
		lane.style.top = lanePositions[laneIndex];
		const direction = (laneIndex % 2 === 0) ? 'direction-right' : 'direction-left';
		lane.classList.add(direction);
		lane.classList.add('silvester');
		let laneContent = '';
		for (let i = laneIndex; i < names.length; i += numberOfLanes) {
			const randomPadding = Math.floor(Math.random() * 80) + 80;
			laneContent += `<span style=\"padding: 0 ${randomPadding}px\">${names[i]}</span>`;
		}
		lane.innerHTML = laneContent;
		const minWidth = Math.ceil(window.innerWidth * 2.2);
		while (lane.scrollWidth < minWidth) { lane.innerHTML += laneContent; }
	}
}



/*******************
* HELPER FUNCTIONS
********************/
function shuffleArray(array) {
	if(array.length <= 1) { return; } else {
		let  oldArray = [...array];
		let equal = true;
		while(equal){
			for (let i = array.length - 1; i > 0; i--) {
				const j = Math.floor(Math.random() * (i + 1));
				[array[i], array[j]] = [array[j], array[i]];
			}
			equal = arraysAreEqualOrFirstIsEqual(oldArray, array)
		}
	}
}
function arraysAreEqualOrFirstIsEqual(arr1, arr2) {
	if(arr1[0] === arr2[0]){ return true; }
	if (arr1.length !== arr2.length) { return false; }
	for (let i = 0; i < arr1.length; i++) { if (arr1[i] !== arr2[i]) { return false; } }
	return true;
}



/*******************
* FIREWORKS
********************/
(function fireworks(){
	const canvas = document.getElementById('fireworks-canvas');
	if(!canvas) return;
	const ctx = canvas.getContext('2d');
	let w, h, dpr;
	let particles = [];
	let rockets = [];
	const COLORS = ['#ffd54a', '#ff4ecd', '#9b5cff', '#4ecbff', '#2bff88', '#ff6b6b'];

	function resize(){
		dpr = Math.min(window.devicePixelRatio || 1, 2);
		w = canvas.width = Math.floor(window.innerWidth * dpr);
		h = canvas.height = Math.floor(window.innerHeight * dpr);
		canvas.style.width = window.innerWidth + 'px';
		canvas.style.height = window.innerHeight + 'px';
		ctx.setTransform(1,0,0,1,0,0);
		ctx.scale(dpr, dpr);
	}
	window.addEventListener('resize', resize);
	resize();

	function launch(){
		const x = Math.random() * window.innerWidth * 0.8 + window.innerWidth*0.1;
		const y = window.innerHeight + 10;
		const targetY = Math.random()*window.innerHeight*0.35 + window.innerHeight*0.15;
		const vx = (Math.random()-0.5) * 0.8;
		const vy = - (6 + Math.random()*2);
		rockets.push({ x, y, vx, vy, targetY, color: COLORS[(Math.random()*COLORS.length)|0] });
	}

	function explode(x,y,color){
		const count = 90 + (Math.random()*50)|0;
		for(let i=0;i<count;i++){
			const angle = Math.random()*Math.PI*2;
			const speed = Math.random()*3.5 + 1.8;
			particles.push({
				x, y,
				vx: Math.cos(angle)*speed,
				vy: Math.sin(angle)*speed,
				life: 1,
				decay: 0.009 + Math.random()*0.015,
				gravity: 0.03 + Math.random()*0.03,
				color,
				spark: Math.random() < 0.35
			});
		}
	}

	let lastLaunch = 0;
	function tick(ts){
		ctx.clearRect(0,0,window.innerWidth, window.innerHeight);

		// Launch rockets periodically
		if(!lastLaunch || ts - lastLaunch > 800 + Math.random()*700){
			launch();
			if(Math.random()<0.4) launch();
			lastLaunch = ts;
		}

		// Update rockets
		for(let i=rockets.length-1;i>=0;i--){
			const r = rockets[i];
			r.x += r.vx;
			r.y += r.vy;
			r.vy += 0.06; // gravity
			// trail glow
			ctx.save();
			ctx.beginPath();
			ctx.shadowBlur = 16;
			ctx.shadowColor = r.color;
			ctx.arc(r.x, r.y, 2.4, 0, Math.PI*2);
			ctx.fillStyle = r.color;
			ctx.globalAlpha = 0.95;
			ctx.fill();
			ctx.restore();
			ctx.globalAlpha = 1;
			// occasional spark trail particle
			if(Math.random()<0.4){
				particles.push({ x:r.x, y:r.y, vx:(Math.random()-0.5)*0.6, vy:(Math.random()-1.2)*0.6, life:0.8, decay:0.06, gravity:0.02, color:r.color, spark:true });
			}
			if(r.vy >= 0 || r.y <= r.targetY){
				explode(r.x, r.y, r.color);
				rockets.splice(i,1);
			}
		}

		// Update particles
		for(let i=particles.length-1;i>=0;i--){
			const p = particles[i];
			p.x += p.vx;
			p.y += p.vy;
			p.vy += p.gravity;
			p.life -= p.decay;
			if(p.life <= 0){ particles.splice(i,1); continue; }
			ctx.save();
			ctx.beginPath();
			ctx.shadowBlur = p.spark ? 18 : 10;
			ctx.shadowColor = p.color;
			ctx.arc(p.x, p.y, 2.1 + (p.spark?Math.random()*1.6:0.6), 0, Math.PI*2);
			ctx.fillStyle = p.color;
			ctx.globalAlpha = Math.max(p.life, 0);
			ctx.fill();
			ctx.restore();
			ctx.globalAlpha = 1;
		}

		requestAnimationFrame(tick);
	}
	requestAnimationFrame(tick);

	// Click/tap bursts
	window.addEventListener('pointerdown', (e)=>{
		const color = COLORS[(Math.random()*COLORS.length)|0];
		explode(e.clientX, e.clientY, color);
		// extra sparkle around click
		for(let i=0;i<3;i++){ launch(); }
	});
})();
