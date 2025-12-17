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
	preload += `<link rel="preload" as="image" href="./members/diamond/logos/${diamondMembers[i].logo}"></link>`;
	for (let j = 0; j < diamondMembers[i].poster.length; j++) {
		preload += `<link rel="preload" as="image" href="./members/diamond/poster/${diamondMembers[i].poster[j]}"></link>`;
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
    // Set new image in txt2
    document.querySelector(`${htmlBox} .txt2`).innerHTML = `<img src="./members/diamond/logos/${diamondMember.logo}" data-id="${diamondMember.id}" alt="">`;

    // Fade out txt (current image) with slight scale down
    gsap.timeline({ delay: 0, repeat: 0 })
        .set(`${htmlBox} .txt`, { opacity: 1, scale: 1, immediateRender: true })
        .to(`${htmlBox} .txt`, { duration: 1.2, opacity: 0, scale: 0.9, ease: Power4.easeInOut })

    // Fade in txt2 (new image) with scale up from larger
    gsap.timeline({ delay: 0, repeat: 0 })
        .set(`${htmlBox} .txt2`, { opacity: 0, scale: 1.15, immediateRender: true })
        .to(`${htmlBox} .txt2`, { duration: 1.2, opacity: 1, scale: 1, ease: Power4.easeInOut })

    // After animation completes, swap images and reset
    setTimeout(() => {
        document.querySelector(`${htmlBox} .txt`).innerHTML = `<img src="./members/diamond/logos/${diamondMember.logo}" data-id="${diamondMember.id}" alt="">`;
        document.querySelector(`${htmlBox} .txt`).style.opacity = 1;
        document.querySelector(`${htmlBox} .txt`).style.transform = 'scale(1)';
        document.querySelector(`${htmlBox} .txt2`).style.opacity = 0;
    }, 1300)
}





/*******************
* FADE IMAGE ANIMATION
********************/
function mainmemberAnimateFader(diamondMember) {
	diamond_member1_img2.src = `./members/diamond/logos/${diamondMember.logo}`;
	diamond_member1_img2.dataset.id = `${diamondMember.id}`;
    

    gsap.timeline({ delay: 0, repeat: 0 })
        .set(`#diamond-member-1_img1`, { opacity: 1, scale: 1, immediateRender: true })
        .to(`#diamond-member-1_img1`, { duration: 2.5, opacity: 0, scale: 0.9, ease: Power4.easeInOut })

	gsap.timeline({ delay: 0, repeat: 0 })
        .set(`#diamond-member-1_img2`, { opacity: 0, scale: 1.15, immediateRender: true })
        .to(`#diamond-member-1_img2`, { duration: 2.5, opacity: 1, scale: 1, ease: Power4.easeInOut })

	setTimeout( ()=> {
		diamond_member1_img1.src = `./members/diamond/logos/${diamondMember.logo}`;
		diamond_member1_img1.dataset.id = `${diamondMember.id}`;
		diamond_member1_img1.style.opacity = 1;
		diamond_member1_img1.style.transform = 'scale(1)';
		diamond_member1_img2.style.opacity = 0;
	}, 2600)
    
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

		setTimeout(()=>{
			overlayReadyToClose = true;
		}, 600);

		timeoutCloseOverlay = setTimeout(()=>{
			hideOverlay();
		}, duration);
	}

	if(overlayReadyToOpen) {
		clearInterval(memberTimeout);
		clearInterval(autoOverlayInterval);

		clearTimeout(timeoutContinue);
		clearTimeout(timeoutCloseOverlay);
		clearInterval(memberInterval);

		overlayReadyToOpen = false;
		
		// Stop animation
		document.body.style.animation = 'none';
		document.body.offsetHeight;


		let box_active = box;
		if(box.classList[0] == "txt2") {
			box_active = box.children[0];
		}
		let id = box_active.dataset.id;
		let currentDiamondMember = diamondMembers.find( member => member.id == id);

		// Set logo image
		overlayLogo.src = box_active.src;

		// set poster image
		if(currentDiamondMember.poster.length > 0 || currentDiamondMember.video.length >= 5) {
			let numberOfAds = currentDiamondMember.poster.length;
			if(currentDiamondMember.video.length >= 5) {
				numberOfAds++;
			}
			let randomPoster = Math.floor(Math.random() * numberOfAds);

			// random number chose video (highest random number, out of bound)
			if( randomPoster == currentDiamondMember.poster.length ) {
				// video embed
				overlayAdVideo.src = `./members/diamond/videos/${currentDiamondMember.video}`;
				overlayAdVideo.load();
				overlayAdVideo.style.position = 'relative';
				overlayAdVideo.style.top = '0';
				
				// open overlay after preload
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
				// image embed
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


		// Hide overlay
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

		// Continue with the member shuffle/animation
		timeoutContinue = setTimeout( ()=> {
			newMembers();
			memberInterval = setInterval(newMembers, 12*1000);
			
			// Reset CSS gradient animation to sync with member interval
			document.body.style.animation = 'gradientShift 24s ease-in-out 0.5s infinite';
			
		}, 6000)

		// Continue with the auto overlay
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


createDiamondMembersExpanded();
function createDiamondMembersExpanded() {
	// create a array with all diamondMembers and posters (excluding members with empty poster array)
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

		clearInterval(memberTimeout);
		clearInterval(autoOverlayInterval);

		clearTimeout(timeoutContinue);
		clearTimeout(timeoutCloseOverlay);
		clearInterval(memberInterval);
		
		overlayReadyToOpen = false;

		// reset current poster & shuffle array
		currentAdIndex = 0;
		shuffleArray(diamondMembersExpanded);


		// Init Interval for auto posters
		nextAutoPoster();

		overlay.style.zIndex = 1000;
		overlay.style.opacity = 1;
		

		setTimeout(()=>{
			overlayReadyToClose = true;
		}, 600);
		
	}
}
function nextAutoPoster(){
	// close overlay if all posters are shown
	// if(currentPoster >= diamondMembersExpanded.length) {
	// 	hideOverlay();
	// }

	// close overlay after 1st poster
	if(currentAdIndex >= 1) {
		hideOverlay();
	}
	// else show next poster
	else {

		overlayAd.src = '';
		overlayAdVideo.pause();
		overlayAdVideo.src = '';
		overlayAdVideo.style.position = 'absolute';
		overlayAdVideo.style.top = '200vh';

		if(progresstween) {
			progresstween.kill();
		}
			
		overlayLogo.src = `./members/diamond/logos/${diamondMembersExpanded[currentAdIndex].logo}`;


		// check if poster is a video
		if(diamondMembersExpanded[currentAdIndex].video) {
			// video embed
			overlayAdVideo.src = `./members/diamond/videos/${diamondMembersExpanded[currentAdIndex].video}`;
			overlayAdVideo.load();
			overlayAdVideo.style.position = 'relative';
			overlayAdVideo.style.top = '0';

			
			
			// open overlay after preload
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
			// image embed
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
* GOLD MEMBERS - CSS DATENSTROM
********************/
startGoldMembers();
function startGoldMembers() {
	let goldMembersNames = [];
	for (let i = 0; i < goldMembers.length; i++) {
		goldMembersNames.push(goldMembers[i].name);
	}
	
	// CSS-based Datenstrom
	setupDatastreamLanes(goldMembersNames);
}

function setupDatastreamLanes(names) {
	const lanePositions = [
		'4vh',   // Lane 0: Ganz oben
		'24vh',  // Lane 1: Zwischen row1 und Hauptbild
		'30vh',  // Lane 2: Zwischen row1 und Hauptbild
		'66vh',  // Lane 3: Zwischen Hauptbild und row2 (weiter unten)
		'72vh',  // Lane 4: Zwischen Hauptbild und row2 (weiter unten)
		'92vh',  // Lane 5: Ganz unten
	];
	
	const numberOfLanes = 6;
	
	// Distribute names across lanes
	for (let laneIndex = 0; laneIndex < numberOfLanes; laneIndex++) {
		const lane = document.getElementById(`lane-${laneIndex}`);
		if (!lane) continue;
		
		// Set position
		lane.style.top = lanePositions[laneIndex];
		
		// Set direction
		const direction = (laneIndex % 2 === 0) ? 'direction-right' : 'direction-left';
		lane.classList.add(direction);
		
		// Add names to this lane
		let laneContent = '';
		for (let i = laneIndex; i < names.length; i += numberOfLanes) {
			// Random padding for variation (80-160px)
			const randomPadding = Math.floor(Math.random() * 80) + 80;
			laneContent += `<span style="padding: 0 ${randomPadding}px">${names[i]}</span>`;
		}
		
		// Duplicate content for seamless loop
		lane.innerHTML = laneContent;
		// Ensure the lane is wide enough (>= ~2.2x viewport) to avoid any gap
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

