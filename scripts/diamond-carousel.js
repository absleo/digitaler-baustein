/*******************
 * CAROUSEL VERSION
 ******************/

let carouselItems = [];
let currentRotation = 0;

// Preload
let preload = `<link rel="preload" as="image" href="./members/default/default-ad_16-9.jpg"></link>`;
for (let i = 0; i < diamondMembers.length; i++) {
	preload += `<link rel="preload" as="image" href="./members/diamond/logos/${diamondMembers[i].logo}"></link>`;
	for (let j = 0; j < diamondMembers[i].poster.length; j++) {
		preload += `<link rel="preload" as="image" href="./members/diamond/poster/${diamondMembers[i].poster[j]}"></link>`;
	}	
}
document.querySelector('head').innerHTML += preload;

// Init
initCarousel();

function initCarousel() {
	const stage = document.getElementById('carousel-stage');
	stage.innerHTML = '';
	
	// Erstelle 8 Carousel Items (alle Members sichtbar)
	diamondMembers.forEach((member, index) => {
		const item = document.createElement('div');
		item.className = 'carousel-item';
		item.dataset.position = index;
		item.dataset.memberId = member.id;
		
		const img = document.createElement('img');
		img.src = `./members/diamond/logos/${member.logo}`;
		img.alt = member.name;
		img.dataset.id = member.id;
		img.onclick = function() { showOverlay(this); };
		
		item.appendChild(img);
		stage.appendChild(item);
		carouselItems.push(item);
	});
}

function rotateCarousel() {
	// Rotiere Positionen
	carouselItems.forEach((item) => {
		let currentPos = parseInt(item.dataset.position);
		let newPos = (currentPos + 1) % diamondMembers.length;
		item.dataset.position = newPos;
	});
}

let memberInterval = setInterval(rotateCarousel, 8000);
let autoOverlayInterval = setInterval(openAutoOverlay, 5*60*1000);




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

		setTimeout(()=>{
			overlayReadyToClose = true;
		}, 600);

		timeoutCloseOverlay = setTimeout(()=>{
			hideOverlay();
		}, duration);
	}

	if(overlayReadyToOpen) {
		clearInterval(memberInterval);
		clearInterval(autoOverlayInterval);
		clearTimeout(timeoutContinue);
		clearTimeout(timeoutCloseOverlay);
		overlayReadyToOpen = false;
		
		document.body.style.animation = 'none';
		document.body.offsetHeight;

		let id = box.dataset.id;
		let currentDiamondMember = diamondMembers.find( member => member.id == id);

		overlayLogo.src = box.src;

		if(currentDiamondMember.poster.length > 0 || currentDiamondMember.video.length >= 5) {
			let numberOfAds = currentDiamondMember.poster.length;
			if(currentDiamondMember.video.length >= 5) {
				numberOfAds++;
			}
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
						setTimeout(()=>{
							overlayAdVideo.play();
						}, 250);
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
			
			if(progresstween) {
				progresstween.kill();
			}
			overlayProgress.style.width = '0%';
			overlayProgress.style.height = '0vh';
			currentAdIndex = 0;
			overlayReadyToOpen = true;
		}, 500);

		setTimeout( ()=> {
			memberInterval = setInterval(rotateCarousel, 8000);
			document.body.style.animation = 'gradientShift 24s ease-in-out 0.5s infinite';
		}, 1000)

		autoOverlayInterval = setInterval(openAutoOverlay, 5*60*1000);
	}
}

function hideOverlayPrevent(event){
	event.stopPropagation();
}




/*******************
* AUTO OVERLAY
********************/
let currentAdIndex;
let diamondMembersExpanded = [];
let autoPosterTimeout;

createDiamondMembersExpanded();
function createDiamondMembersExpanded() {
	diamondMembersExpanded = [];
	for (let i = 0; i < diamondMembers.length; i++) {
		if(diamondMembers[i].poster && diamondMembers[i].poster.length > 0 ) {
			for (let j = 0; j < diamondMembers[i].poster.length; j++) {
				diamondMembersExpanded.push({
					id: diamondMembers[i].id,
					name: diamondMembers[i].name,
					logo: diamondMembers[i].logo,
					poster: diamondMembers[i].poster[j]
				})
			}
		}
		if(diamondMembers[i].video && diamondMembers[i].video.length >= 5 ) {
			diamondMembersExpanded.push({
				id: diamondMembers[i].id,
				name: diamondMembers[i].name,
				logo: diamondMembers[i].logo,
				video: diamondMembers[i].video
			})
		}
	}
}

function openAutoOverlay(){
	if(overlayReadyToOpen) {
		clearInterval(memberInterval);
		clearInterval(autoOverlayInterval);
		clearTimeout(timeoutContinue);
		clearTimeout(timeoutCloseOverlay);
		overlayReadyToOpen = false;

		currentAdIndex = 0;
		shuffleArray(diamondMembersExpanded);
		nextAutoPoster();
		overlay.style.zIndex = 1000;
		overlay.style.opacity = 1;

		setTimeout(()=>{
			overlayReadyToClose = true;
		}, 600);
	}
}

function nextAutoPoster(){
	if(currentAdIndex >= 1) {
		hideOverlay();
	} else {
		overlayAd.src = '';
		overlayAdVideo.pause();
		overlayAdVideo.src = '';
		overlayAdVideo.style.position = 'absolute';
		overlayAdVideo.style.top = '200vh';

		if(progresstween) {
			progresstween.kill();
		}
			
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
					setTimeout(()=>{
						overlayAdVideo.play();
					}, 250);
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

		autoPosterTimeout = setTimeout(()=>{
			nextAutoPoster();
		}, duration);
		
		currentAdIndex++;
	}
}




/*******************
* GOLD MEMBERS
********************/
startGoldMembers();
function startGoldMembers() {
	let goldMembersNames = [];
	for (let i = 0; i < goldMembers.length; i++) {
		goldMembersNames.push(goldMembers[i].name);
	}
	setupDatastreamLanes(goldMembersNames);
}

function setupDatastreamLanes(names) {
	const lanePositions = ['4vh', '24vh', '30vh', '66vh', '72vh', '92vh'];
	const numberOfLanes = 6;
	
	for (let laneIndex = 0; laneIndex < numberOfLanes; laneIndex++) {
		const lane = document.getElementById(`lane-${laneIndex}`);
		if (!lane) continue;
		
		lane.style.top = lanePositions[laneIndex];
		const direction = (laneIndex % 2 === 0) ? 'direction-right' : 'direction-left';
		lane.classList.add(direction);
		
		let laneContent = '';
		for (let i = laneIndex; i < names.length; i += numberOfLanes) {
			const randomPadding = Math.floor(Math.random() * 80) + 80;
			laneContent += `<span style="padding: 0 ${randomPadding}px">${names[i]}</span>`;
		}
		
		lane.innerHTML = laneContent;
		const minWidth = Math.ceil(window.innerWidth * 2.2);
		while (lane.scrollWidth < minWidth) {
			lane.innerHTML += laneContent;
		}
	}
}




/*******************
* HELPER FUNCTIONS
********************/
function shuffleArray(array) {
	if(array.length <= 1) {
		return;
	} else {
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
    if(arr1[0] === arr2[0]){
		return true;
	}
	if (arr1.length !== arr2.length) {
        return false;
    }
    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) {
            return false;
        }
    }
    return true;
}
