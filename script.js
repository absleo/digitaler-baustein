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
		console.log(boxWidth, boxWidth2)
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
let overlayReadyToOpen = true;
function showOverlay(box, topOffset, leftOffset, bottomOffset, rightOffset){

	if(overlayReadyToOpen) {
		clearInterval(memberTimeout);

		clearTimeout(timeoutContinue);
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

		overlayAd.src = `./images/diamond-ad.jpg`;

		setTimeout(()=>{
			overlayReadyToClose = true;
		}, 500);
		
	}
	

}
let overlayReadyToClose = true;
function hideOverlay(box){



	if(overlayReadyToClose) {
		console.log(box.id);

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
	console.log("prevented")
}