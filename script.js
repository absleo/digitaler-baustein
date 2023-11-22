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
		console.log(equal);
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
		let boxWidth = document.querySelector(`${htmlBox} .txt`).clientWidth;
		let boxWidth2 = document.querySelector(`${htmlBox} .txt2`).clientWidth;
		if(boxWidth2 > boxWidth) {
			boxWidth = boxWidth2;
		}

		let color1 = '#000';
		let color2 = '#fff';

		gsap.timeline({ delay: 0, repeat: 0, ease: Power1.easeInOut })
			.set(`${htmlBox} .txt`, { opacity: 1, x: 0, immediateRender: true })
			.set(`${htmlBox} .barFader`, { left: 0, x: 0, backgroundColor: color1, immediateRender: true })

			.to(`${htmlBox} .barFader`, { duration: 0.01, backgroundColor: color2 })
			.to(`${htmlBox} .barFader`, { duration: 0.8, width: boxWidth, ease: Power4.easeInOut })

			.set(`${htmlBox} .txt`, { innerHTML: `<img src="./images/${img}" alt="">` })
			
			.to(`${htmlBox} .txt`, { duration: 0.01, opacity: 1 })
			.to(`${htmlBox} .barFader`, { duration: 0.48, x: boxWidth, width: 0, ease: Power4.easeInOut })
		
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
newMembers();
setInterval(newMembers, 12000);

function newMembers(){
	shuffleArray(diamondMembers);

	imageAnimate(diamondMembers[0].img);
	
	setTimeout( ()=>{
		textAnimateBar('#diamond-member-2', diamondMembers[1].img);
		textAnimateBar('#diamond-member-3', diamondMembers[2].img);
		textAnimateBar('#diamond-member-4', diamondMembers[3].img);
		textAnimateBar('#diamond-member-5', diamondMembers[4].img);
		textAnimateBar('#diamond-member-6', diamondMembers[5].img);
	}, 1000)
	
}