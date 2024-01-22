/*******************
* DATA
********************/
const diamondMembers = [
	{
		name: 'Fabasoft',
		img: 'diamond_fabasoft.svg'
	},
	{
		name: 'ITPRO',
		img: 'diamond_it-pro.svg'
	},
	{
		name: 'Linz AG',
		img: 'diamond_linz-ag.svg'
	},
	{
		name: 'Nimbuscloud',
		img: 'diamond_nimbuscloud.svg'
	},
    {
		name: 'Primetals',
		img: 'diamond_primetals.svg'
	},
	{
		name: 'Sparkasse OÖ',
		img: 'diamond_sparkasse-ooe.svg'
	}
]


/*******************
* HELPER FUNCTIONS
********************/
function shuffleArray(array) {

	let  oldArray = [...diamondMembers];

	let equal = true;
	while(equal){
		for (let i = array.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[array[i], array[j]] = [array[j], array[i]];
		}

		equal = arraysAreEqualOrFirstIsEqual(oldArray, diamondMembers)
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




/*******************
* BAR TEXT ANIMATION
********************/
function textAnimateBar(htmlBox, img) {
    document.querySelector(`${htmlBox} .txt2`).innerHTML = `<img src="./images/${img}" alt="">`;

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

			.to(`${htmlBox} .barFader`, { duration: 0.01 })
			.to(`${htmlBox} .barFader`, { duration: 0.8, width: boxWidth, ease: Power4.easeInOut })

			.set(`${htmlBox} .txt`, { innerHTML: `<img src="./images/${img}" alt="">` })
			
			.to(`${htmlBox} .txt`, { duration: 0.01, opacity: 1 })
			.to(`${htmlBox} .barFader`, { duration: 0.48, x: boxWidth/2, width: 0, ease: Power4.easeInOut })
		
	}, 1)
    
}




/*******************
* 3D TEXT ANIMATION
********************/
let diamond_member1_img1 = document.querySelector(`#diamond-member-1_img1`);
let diamond_member1_img2 = document.querySelector(`#diamond-member-1_img2`);
function imageAnimate(src) {
	diamond_member1_img2.src = `./images/${src}`;
    

    gsap.timeline({ delay: 0, repeat: 0, ease: Power1.easeInOut })
        .set(`#diamond-member-1_img1`, { opacity: 1, immediateRender: true })

        .to(`#diamond-member-1_img1`, { duration: 3, opacity: 0, ease: Power4.easeInOut })

	gsap.timeline({ delay: 0, repeat: 0, ease: Power1.easeInOut })
        .set(`#diamond-member-1_img2`, { opacity: 0, immediateRender: true })
        .to(`#diamond-member-1_img2`, { duration: 3, opacity: 1, ease: Power4.easeInOut })

	setTimeout( ()=> {
		diamond_member1_img1.src = `./images/${src}`;
		diamond_member1_img1.style.opacity = 1;
		diamond_member1_img2.style.opacity = 0;
	},3500)
	
        
}




/*******************
* INIT
********************/
let memberTimeout;
newMembers();
let memberInterval = setInterval(newMembers, 12000);

function newMembers(){
	shuffleArray(diamondMembers);

	imageAnimate(diamondMembers[0].img);
	
	memberTimeout = setTimeout( ()=>{
		textAnimateBar('#diamond-member-2', diamondMembers[1].img);
		textAnimateBar('#diamond-member-3', diamondMembers[2].img);
		textAnimateBar('#diamond-member-4', diamondMembers[3].img);
		textAnimateBar('#diamond-member-5', diamondMembers[4].img);
		textAnimateBar('#diamond-member-6', diamondMembers[5].img);
	}, 1000)
	
}




/*******************
* OVERLAY
********************/
let overlay = document.querySelector('#member-overlay');
let overlayImage = document.querySelector('#member-overlay #member-img-wrap img');
let overlayAd = document.querySelector('#member-overlay #member-ad-wrap img');
let timeoutContinue;
let timeoutCloseOverlay;
let overlayReadyToOpen = true;
function showOverlay(box, topOffset, leftOffset, bottomOffset, rightOffset){

	if(overlayReadyToOpen) {
		clearInterval(memberTimeout);

		clearTimeout(timeoutContinue);
		clearTimeout(timeoutCloseOverlay);
		clearInterval(memberInterval);

		overlayReadyToOpen = false;

		overlay.style.zIndex = 1000;
		overlay.style.opacity = 1;
		overlay.style.width = '100%';
		overlay.style.height = '100%';
		overlay.style.top = topOffset;
		overlay.style.left = leftOffset;
		overlay.style.bottom = bottomOffset;
		overlay.style.right = rightOffset;

		if(box.classList[0] == "txt2") {
			overlayImage.src = box.children[0].src;
		} else {
			overlayImage.src = box.src;
		}

		overlayAd.src = `./images/ad-diamond_16-9.jpg`;

		setTimeout(()=>{
			overlayReadyToClose = true;
		}, 500);

		timeoutCloseOverlay = setTimeout(()=>{
			hideOverlay();
		}, 20000);
		
	}
	

}
let overlayReadyToClose = true;
function hideOverlay(){

	if(overlayReadyToClose) {

		clearTimeout(timeoutCloseOverlay);

		overlayReadyToClose = false;

		overlay.style.width = '0%';
		overlay.style.height = '0%';

		setTimeout(()=>{
			overlayImage.src = '';
			overlayAd.innerHTML = '';

			overlay.style.zIndex = -1000;
			overlay.style.opacity = 0;

			overlayReadyToOpen = true;
		}, 500);

		timeoutContinue = setTimeout( ()=> {
			newMembers();
			memberInterval = setInterval(newMembers, 12000);
		}, 5000)
		
	}

}
function hideOverlayPrevent(event){
	event.stopPropagation();
}






/*******************
* CANVAS PARTICLES
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

let framerate = 0;
let frame = document.getElementById('frame');
/*
setInterval( ()=>{
    frame.innerHTML = framerate;
    framerate = 0;
}, 1000)
*/

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
    options.textList = (opt.textList || "Hello, World").split(', '); // string: list of strings separated with a comma and a space
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
			particlesFontsizeArray[i] = 14;
		}

        particlesArray[i].update();
    }
    connect();
    //framerate++;
    window.requestAnimationFrame(animateFrameLoop);
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

window.addEventListener('resize',
    () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        reset(options);
    }
);


accelerate({
    textSize: 14,
    particleSize: 2,
    particleColor: 51,
    textColor: startColor,
    speed: 0.3,
	textList: "3 Banken IT GmbH, AGILOX Services GmbH, Alpine Metal Tech GmbH, Avocodo GmbH, Barmherzige Brüder Krankenhaus Linz, BMD Systemhaus, CBCX Technologies GmbH, CGM Clinical Österreich GmbH, clickandlearn GmbH, Cloudflight Austria GmbH, coilDNA, COUNT IT GmbH, EBM GmbH, Ebner Media & Management GmbH, EFINIO GmbH, Eisenbeiss GmbH, ELO Digital Office AT GmbH, ENGEL AUSTRIA GmbH, epunkt GmbH, Fabasoft International Services GmbH, FAW Solutions GmbH, FERCHAU Austria GmbH, FH OÖ IT GmbH, FH OÖ Hagenberg Hardware-Software-Design, Herbsthofer GmbH, HÖDLMAYR INTERNATIONAL AG, IBM ix Austria GmbH, IGS Systemmanagement GmbH & CO KG, ITPRO Consulting & Software GmbH, KE KELIT GmbH, KEBA Group AG, KREISEL Electric GmbH, Latschbacher GmbH - WinforstPro, Linz AG, Miba AG, MIC Datenverarbeitung GmbH, mobile agreements GmbH, Netural GmbH, Nimbuscloud Gmbh, NTS Retail KG, ÖGK IKT OÖ, Primetals Technologies Austria GmbH, PROGRAMMIERFABRIK GmbH, Raiffeisen Software GmbH, Raiffeisenlandesbank Oberösterreich Aktiengesellschaft, RAITEC GmbH, SecureGUARD GmbH, SKE Engineering Gmbh, Softpoint IT-Solutions GmbH & Co KG, solvistas GmbH, Sprecher Automation GmbH, STIWA Holding GmbH, TeamViewer Austria GmbH, TGW Logistics Group, TRAUNER Verlag + Buchservice GmbH, TRUMPF Maschinen Austria GmbH + Co. KG, umdasch Store Makers Management GmbH, Uni Software Plus GmbH, VSTech Service & Engineering GmbH, Wacker Neuson Linz GmbH, Wirtschaftskammer Oberösterreich"
});
