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
let preload = `<link rel="preload" as="image" href="./images/diamond-ads/diamond-ad_16-9.jpg"></link>`;
for (let i = 0; i < diamondMembers.length; i++) {
	preload += `<link rel="preload" as="image" href="./images/diamond-logos/${diamondMembers[i].logo}"></link>`;
	for (let j = 0; j < diamondMembers[i].poster.length; j++) {
		if(diamondMembers[i].poster[j].includes('.mp4')) {

		} else {
			preload += `<link rel="preload" as="image" href="./images/diamond-ads/${diamondMembers[i].poster[j]}"></link>`;
		}
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

	imageAnimateFader(diamondMembers[0]);
	
	memberTimeout = setTimeout( ()=>{
		textAnimateBar('#diamond-member-2', diamondMembers[1]);
		textAnimateBar('#diamond-member-3', diamondMembers[2]);
		textAnimateBar('#diamond-member-4', diamondMembers[3]);
		textAnimateBar('#diamond-member-5', diamondMembers[4]);
	}, 1000)
	
}






/*******************
* BAR TEXT ANIMATION
********************/
function textAnimateBar(htmlBox, diamondMember) {
    document.querySelector(`${htmlBox} .txt2`).innerHTML = `<img src="./images/diamond-logos/${diamondMember.logo}" data-id="${diamondMember.id}" alt="">`;

	setTimeout( ()=>{
		let boxWidth = 0;
		if(document.querySelector(`${htmlBox} .txt img`)){
			boxWidth = document.querySelector(`${htmlBox} .txt img`).clientWidth;
		}
		let boxWidth2 = 0;
		if(document.querySelector(`${htmlBox} .txt2 img`)){
			boxWidth2 = document.querySelector(`${htmlBox} .txt2 img`).clientWidth;
		}
		if(boxWidth2 > boxWidth) {
			boxWidth = boxWidth2;
		}

		gsap.timeline({ delay: 0, repeat: 0, ease: Power1.easeInOut })
			.set(`${htmlBox} .txt`, { opacity: 1, x: 0, immediateRender: true })
			.set(`${htmlBox} .barFader`, { x: 0, width: 0, immediateRender: true })

			.to(`${htmlBox} .barFader`, { duration: 0.6, width: boxWidth, ease: Power4.easeInOut })

			.set(`${htmlBox} .txt`, { opacity: 1, innerHTML: `<img src="./images/diamond-logos/${diamondMember.logo}" data-poster="${diamondMember.poster}" alt="">` })
			
			.to(`${htmlBox} .barFader`, { duration: 0.4, x: boxWidth/2, width: 0, ease: Power4.easeInOut })
		
	}, 1)
    
}




/*******************
* FADE IMAGE ANIMATION
********************/
function imageAnimateFader(diamondMember) {
	diamond_member1_img2.src = `./images/diamond-logos/${diamondMember.logo}`;
	diamond_member1_img2.dataset.id = `${diamondMember.id}`;
    

    gsap.timeline({ delay: 0, repeat: 0, ease: Power1.easeInOut })
        .set(`#diamond-member-1_img1`, { opacity: 1, immediateRender: true })

        .to(`#diamond-member-1_img1`, { duration: 3, opacity: 0, ease: Power4.easeInOut })

	gsap.timeline({ delay: 0, repeat: 0, ease: Power1.easeInOut })
        .set(`#diamond-member-1_img2`, { opacity: 0, immediateRender: true })
        .to(`#diamond-member-1_img2`, { duration: 3, opacity: 1, ease: Power4.easeInOut })

	setTimeout( ()=> {
		diamond_member1_img1.src = `./images/diamond-logos/${diamondMember.logo}`;
		diamond_member1_img1.dataset.id = `${diamondMember.id}`;
		diamond_member1_img1.style.opacity = 1;
		diamond_member1_img2.style.opacity = 0;
	},3500)
    
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
		canvasPlay = false;

		let box_active = box;
		if(box.classList[0] == "txt2") {
			box_active = box.children[0];
		}
		let id = box_active.dataset.id;
		let currentDiamondMember = diamondMembers.find( member => member.id == id);

		// Set logo image
		overlayLogo.src = box_active.src;

		// set poster image
		if(currentDiamondMember && currentDiamondMember.poster == '' || currentDiamondMember.poster == null || currentDiamondMember.poster == undefined || currentDiamondMember.poster.length == 0 ) {
			overlayAd.src = `./images/diamond-ads/diamond-ad_16-9.jpg`;
			openOverlay(20000);
		} else {
			let randomPoster = Math.floor(Math.random() * currentDiamondMember.poster.length);

			// check if poster is a video
			if(currentDiamondMember.poster[randomPoster].includes('.mp4')) {
				// video embed
				overlayAdVideo.src = `./images/diamond-ads/${currentDiamondMember.poster[randomPoster]}`;
				overlayAdVideo.load();
				overlayAdVideo.style.position = 'relative';
				overlayAdVideo.style.top = '0';
				
				// open overlay after preload
				overlayAdVideo.onloadeddata = function() {
					overlayAdVideo.muted = true;
					overlayAdVideo.play();
					let videoDuration = overlayAdVideo.duration * 1000;
					openOverlay(videoDuration);
				}
				
			} else {
				// image embed
				overlayAd.src = `./images/diamond-ads/${currentDiamondMember.poster[randomPoster]}`;
				openOverlay(20000);
			}
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
		
		// Continue with the canvas animation
		setTimeout(()=>{
			canvasPlay = true;
			window.requestAnimationFrame(animateFrameLoop);
		}, 100);

		// Hide overlay
		setTimeout(()=>{
			overlayLogo.src = '';
			overlayAd.src = '';
			overlayAdVideo.pause();
			overlayAdVideo.src = '';
			overlayAdVideo.style.position = 'absolute';
			overlayAdVideo.style.top = '200vh';
			overlayAd.innerHTML = '';
			

			overlay.style.zIndex = -1000;
			
			if(progresstween) {
				progresstween.kill();
			}
			overlayProgress.style.width = '0%';
			overlayProgress.style.height = '0vh';

			currentPoster = 0;


			overlayReadyToOpen = true;
		}, 500);

		// Continue with the member shuffle/animation
		timeoutContinue = setTimeout( ()=> {
			newMembers();
			memberInterval = setInterval(newMembers, 12*1000);
		}, 5000)

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
let currentPoster;
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
		canvasPlay = false;

		// reset current poster & shuffle array
		currentPoster = 0;
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
	if(currentPoster >= 1) {
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
			
		overlayLogo.src = `./images/diamond-logos/${diamondMembersExpanded[currentPoster].logo}`;


		// check if poster is a video
		if(diamondMembersExpanded[currentPoster].poster.includes('.mp4')) {
			// video embed
			overlayAdVideo.src = `./images/diamond-ads/${diamondMembersExpanded[currentPoster].poster}`;
			overlayAdVideo.load();
			overlayAdVideo.style.position = 'relative';
			overlayAdVideo.style.top = '0';

			
			
			// open overlay after preload
			overlayAdVideo.onloadeddata = function() {
				overlayAdVideo.muted = true;
				overlayAdVideo.play();
				let videoDuration = overlayAdVideo.duration * 1000;
				openOverlay(videoDuration);
			}
			
		} else {
			// image embed
			overlayAd.src = `./images/diamond-ads/${diamondMembersExpanded[currentPoster].poster}`;
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
		
		currentPoster++;
	}
}






/*******************
* GOLD MEMBERS CANVAS
********************/
const canvas = document.getElementById("gold-members");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particlesArray;
let particlesHuesArray;
let particlesFontsizeArray;
let particlesStepsArray;
let options = {};

let startColor = 102;

let canvasPlay = true;


class Particle {
    constructor(x, y, moveX, moveY, name, pColor, pSize, tColor, tSize) {
        this.pointX = x;
        this.pointY = y;
        this.moveX = moveX;
        this.moveY = moveY;
        this.name = name;
        this.particleSize = pSize;
        this.particleColor = pColor;
        this.textSize = tSize;
        this.textColor = tColor;
        this.halfTextWidth = 0;
    }

    plot() {
        ctx.beginPath();
        if (this.particleSize > 0) {
            ctx.arc(this.pointX, this.pointY, this.particleSize, 0, Math.PI * 2);
            ctx.fillStyle = `rgb(${this.particleColor},${this.particleColor},${this.particleColor})`;
            ctx.fill();
        }
        ctx.font = `${this.textSize}px sans-serif`;
        ctx.fillStyle = `rgb(${this.textColor},${this.textColor},${this.textColor})`;
        this.halfTextWidth = ctx.measureText(this.name).width / 2;
        ctx.fillText(this.name, this.pointX, this.pointY);

    }

    update() {
        if (this.pointX > canvas.width - this.halfTextWidth || this.pointX < this.halfTextWidth) this.moveX = -this.moveX;
        if (this.pointY > canvas.height || this.pointY < this.textSize) this.moveY = -this.moveY;
        this.pointX += this.moveX;
        this.pointY += this.moveY;
        this.plot();
    }
}

function accelerate(opt) {
    options = opt;
    options.maxSpeed = opt.speed || 2; // number: positive speed
    options.minSpeed = -opt.speed || -2; // number: negative speed
    options.particleColor = opt.particleColor || 136; //number
    options.particleSize = opt.particleSize || 0, // number: particle size, default=0 (not shown)
    options.textColor = opt.textColor || 136; // number
    options.textList = opt.textList || ["Gold", "Platin", "Diamond"]; // string: list of strings separated with a comma and a space
    options.textSize = opt.textSize || 24; // number: positive
    reset(options);
    animateFrameLoop();
}

function reset(opt) {
    particlesArray = [];
	particlesHuesArray = [];
	particlesFontsizeArray = [];
	particlesStepsArray = [];
    ctx.textAlign = "center";
    let numberOfParticles = opt.textList.length;
    let innerMargin = 100;
    for (let i = 0; i < numberOfParticles; i++) {
        let x = Math.random() * (canvas.width - innerMargin * 2) + innerMargin;
        let y = Math.random() * (canvas.height - innerMargin * 2) + innerMargin;
        let moveX = Math.random() * (opt.maxSpeed - opt.minSpeed) + opt.minSpeed;
        let moveY = Math.random() * (opt.maxSpeed - opt.minSpeed) + opt.minSpeed;
        particlesArray.push(new Particle(x, y, moveX, moveY, opt.textList[i], opt.particleColor, opt.particleSize, opt.textColor, opt.textSize));
		particlesHuesArray.push(opt.textColor);
		particlesFontsizeArray.push(opt.textSize);
		particlesStepsArray.push(0);
	}
}

function animateFrameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let len = particlesArray.length;
    for (let i = 0; i < len; i++) {

		let rand = Math.floor(Math.random()*250);
		if(rand == 50 && particlesStepsArray[i] == 0) {
			particlesStepsArray[i] = 1;
		}

		let step = particlesStepsArray[i];
		// DO NOTHING
		if (step == 0) { }
		// INCREASE
		else if( step < 70 ) {
			particlesHuesArray[i]+=1;
			particlesFontsizeArray[i]+=.005;
			particlesStepsArray[i]+=1;

			particlesArray[i].textColor = particlesHuesArray[i];
			particlesArray[i].textSize = particlesFontsizeArray[i];
		}
		// DECREASE
		else if( step < 140) {
			particlesHuesArray[i]-=1;
			particlesFontsizeArray[i]-=.005;
			particlesStepsArray[i]+=1;

			particlesArray[i].textColor = particlesHuesArray[i];
			particlesArray[i].textSize = particlesFontsizeArray[i];
		}
		// FINISHED
		else {
			particlesStepsArray[i] = 0;
			particlesHuesArray[i] = startColor;
			particlesFontsizeArray[i] = 12;
		}

        particlesArray[i].update();
    }
    connect();
	// only execute if overlay is not open
	if(canvasPlay) {
		window.requestAnimationFrame(animateFrameLoop);
	}
    
}

function connect() {
    let opacity;
    let rgb = 68;
    let startOpacity = 1;
    let distanceOpacity = 20;
    let area = canvas.width * canvas.height;
    for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
            let distance = ((particlesArray[a].pointX - particlesArray[b].pointX) * (particlesArray[a].pointX - particlesArray[b].pointX)
                + (particlesArray[a].pointY - particlesArray[b].pointY) * (particlesArray[a].pointY - particlesArray[b].pointY));
            if (distance < area) {
                opacity = startOpacity - distance / (10000*distanceOpacity);
                ctx.strokeStyle = `rgba(${rgb},${rgb},${rgb}, ${opacity})`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particlesArray[a].pointX, particlesArray[a].pointY);
                ctx.lineTo(particlesArray[b].pointX, particlesArray[b].pointY);
                ctx.stroke();
            }
        }
    }
}

window.addEventListener('resize',() => {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	reset(options);
});


startGoldMembers();
function startGoldMembers() {
// "3 Banken IT GmbH, AGILOX Services GmbH, Alpine Metal Tech GmbH, Avocodo GmbH, Barmherzige Brüder Krankenhaus Linz, BMD Systemhaus, CBCX Technologies GmbH, CGM Clinical Österreich GmbH, clickandlearn GmbH, Cloudflight Austria GmbH, coilDNA, COUNT IT GmbH, EBM GmbH, Ebner Media & Management GmbH, EFINIO GmbH, Eisenbeiss GmbH, ELO Digital Office AT GmbH, ENGEL AUSTRIA GmbH, epunkt GmbH, Fabasoft International Services GmbH, FAW Solutions GmbH, FERCHAU Austria GmbH, FH OÖ IT GmbH, FH OÖ Hagenberg Hardware-Software-Design, Herbsthofer GmbH, HÖDLMAYR INTERNATIONAL AG, IBM ix Austria GmbH, IGS Systemmanagement GmbH & CO KG, ITPRO Consulting & Software GmbH, KE KELIT GmbH, KEBA Group AG, KREISEL Electric GmbH, Latschbacher GmbH - WinforstPro, Linz AG, Miba AG, MIC Datenverarbeitung GmbH, mobile agreements GmbH, Netural GmbH, Nimbuscloud Gmbh, NTS Retail KG, ÖGK IKT OÖ, Primetals Technologies Austria GmbH, PROGRAMMIERFABRIK GmbH, Raiffeisen Software GmbH, Raiffeisenlandesbank Oberösterreich Aktiengesellschaft, RAITEC GmbH, SecureGUARD GmbH, SKE Engineering Gmbh, Softpoint IT-Solutions GmbH & Co KG, solvistas GmbH, Sprecher Automation GmbH, STIWA Holding GmbH, TeamViewer Austria GmbH, TGW Logistics Group, TRAUNER Verlag + Buchservice GmbH, TRUMPF Maschinen Austria GmbH + Co. KG, umdasch Store Makers Management GmbH, Uni Software Plus GmbH, VSTech Service & Engineering GmbH, Wacker Neuson Linz GmbH, Wirtschaftskammer Oberösterreich"
	let goldMembersNames = [];
	for (let i = 0; i < goldMembers.length; i++) {
		goldMembersNames.push(goldMembers[i].name);
	}
	accelerate({
		textSize: 14,
		particleSize: 2,
		particleColor: 51,
		textColor: startColor,
		speed: 0.3,
		textList: goldMembersNames
	});
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

