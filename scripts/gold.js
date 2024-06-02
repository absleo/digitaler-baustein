/*******************
 * DIAMOND MEMBERS
 *******************/
/// <reference path="diamondMembers.js" />


/*******************
 * GOLD MEMBERS
 ******************/
/// <reference path="goldMembers.js" />

  

/*******************
 * REFERENCES
 ******************/
let columnMembers = document.getElementById('column-members');
let columnDetails = document.getElementById('column-details');
let detailsHeader = document.getElementById('details-header');
let diamondMembersBoxes;
let goldMembersBoxes;



/*******************
* MEMBERS COLUMN
********************/
generateMembers();
function generateMembers() {
	let html = "";
	
	// generate diamond members
	for (let i = 0; i < diamondMembers.length; i++) {
		html += `<div onclick="showDetails(this, 'diamond', ${i})" class="diamond-member"><img src="./images/diamond-logos/${diamondMembers[i].img}"></div>`
	}

	// generate gold members
	for (let i = 0; i < goldMembers.length; i++) {
		html += `<div onclick="showDetails(this, 'gold', ${i})" class="gold-member"><h2>${goldMembers[i].name}</h2></div>`
	}

	columnMembers.innerHTML = html
}






/*******************
* DIAMOND MEMBER FOCUS
********************/

// INIT
requestAnimationFrame( ()=>{
	diamondMembersBoxes = document.getElementsByClassName('diamond-member');
	goldMembersBoxes = document.getElementsByClassName('gold-member');

	lastMember = diamondMembers[0];
	newDiamondMember();
})

// NEW DIAMOND MEMBER
function newDiamondMember(){
	let index;
	do {
		index = Math.floor(Math.random()*diamondMembers.length);
	}
	while(lastMember == diamondMembers[index])
	
	showDetails(diamondMembers[index], index);
	if( columnMembers.scrollTop > 5) {
		diamondMembers[0].scrollIntoView({ behavior: 'smooth' });
	}
	
}

// INACTIVE TIME CHECK
let lastActivityTime = Date.now();
document.addEventListener('mousemove', updateLastActivityTime);
document.addEventListener('touchmove', updateLastActivityTime);
document.addEventListener('click', updateLastActivityTime);
function updateLastActivityTime() {
	lastActivityTime = Date.now();
}
let lastSwitchTime = Date.now();
function checkInactiveTime() {
	let currentTime = Date.now();
	let inactiveTime = currentTime - lastActivityTime;
	let switchTime = currentTime - lastSwitchTime;

	if( inactiveTime > 30000 && switchTime > 10000 ){
		lastSwitchTime = currentTime; 
		newDiamondMember();
	}
}

let checkInactiveTimeInterval = setInterval(checkInactiveTime, 1000);





/*******************
* DETAILS
********************/
let lastMember = undefined;
function showDetails(element, member, i) {

	if(member == 'diamond' && diamondMembers[i].poster != ''){
		gsap.timeline({ delay: 0, repeat: 0, ease: Power1.easeInOut })
		.set(columnDetails, { opacity: 1, immediateRender: true })
		.to(columnDetails, { opacity: 0, duration: 0.3 })
		.set(columnDetails, { innerHTML: `<img src="./images/diamond-ads/${diamondMembers[i].poster}" alt="">`, delay: 0.3 })
		.to(columnDetails, { duration: 0.3, delay: 0.3, opacity: 1 })

		gsap.timeline({ delay: 0, repeat: 0, ease: Power1.easeInOut })
			.to(element, { backgroundColor: '#333', immediateRender: true })

		gsap.timeline({ delay: 0, repeat: 0, ease: Power1.easeInOut })
			.to(lastMember, { backgroundColor: '#000', immediateRender: true })
	}

	else if(member == 'gold'){
		// TBA
	}
	
	else {
		gsap.timeline({ delay: 0, repeat: 0, ease: Power1.easeInOut })
		.set(columnDetails, { opacity: 1, immediateRender: true })
		.to(columnDetails, { opacity: 0, duration: 0.3 })
		.set(columnDetails, { innerHTML: `<img src="./images/diamond-ads/diamond-ad_16-9.jpg" alt="">`, delay: 0.3 })
		.to(columnDetails, { duration: 0.3, delay: 0.3, opacity: 1 })

		gsap.timeline({ delay: 0, repeat: 0, ease: Power1.easeInOut })
			.to(element, { backgroundColor: '#333', immediateRender: true })

		gsap.timeline({ delay: 0, repeat: 0, ease: Power1.easeInOut })
			.to(lastMember, { backgroundColor: '#000', immediateRender: true })
	}
	
	lastMember = element;
}





