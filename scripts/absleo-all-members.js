/*******************
* DATA
********************/
const members = [
	{
		name: 'Fabasoft',
		img: 'diamond_fabasoft.svg'},
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
	},
	{ name: '3 Banken IT GmbH', img: '' },
	{ name: 'AGILOX Services GmbH', img: '' },
	{ name: 'Alpine Metal Tech GmbH', img: '' },
	{ name: 'Avocodo GmbH', img: '' },
	{ name: 'Barmherzige Brüder Krankenhaus Linz', img: '' },
	{ name: 'BMD Systemhaus', img: '' },
	{ name: 'Brain Force GmbH', img: '' },
	{ name: 'CBCX Technologies GmbH', img: '' },
	{ name: 'CGM Clinical Österreich GmbH', img: '' },
	{ name: 'clickandlearn GmbH', img: '' },
	{ name: 'Cloudflight Austria GmbH', img: '' },
	{ name: 'coilDNA', img: '' },
	{ name: 'COUNT IT GmbH', img: '' },
	{ name: 'EBM GmbH', img: '' },
	{ name: 'Ebner Media & Management GmbH', img: '' },
	{ name: 'EFINIO GmbH', img: '' },
	{ name: 'Eisenbeiss GmbH', img: '' },
	{ name: 'ELO Digital Office AT GmbH', img: '' },
	{ name: 'ENGEL AUSTRIA GmbH', img: '' },
	{ name: 'epunkt GmbH', img: '' },
	{ name: 'FAW Solutions GmbH', img: '' },
	{ name: 'FERCHAU Austria GmbH', img: '' },
	{ name: 'FH OÖ IT GmbH', img: '' },
	{ name: 'FH Hagenberg', img: '' },
	{ name: 'Herbsthofer GmbH', img: '' },
	{ name: 'HÖDLMAYR INTERNATIONAL AG', img: '' },
	{ name: 'IBM ix Austria GmbH', img: '' },
	{ name: 'IGS Systemmanagement GmbH & CO KG', img: '' },
	{ name: 'inline-service IT-solution GmbH', img: '' },
	{ name: 'KE KELIT GmbH', img: '' },
	{ name: 'KEBA Group AG', img: '' },
	{ name: 'KREISEL Electric GmbH', img: '' },
	{ name: 'Latschbacher GmbH - WinforstPro', img: '' },
	{ name: 'Miba AG', img: '' },
	{ name: 'MIC Datenverarbeitung GmbH', img: '' },
	{ name: 'mobile agreements GmbH', img: '' },
	{ name: 'Netural GmbH', img: '' },
	{ name: 'NTS Retail KG', img: '' },
	{ name: 'ÖGK IKT OÖ', img: '' },
	{ name: 'PROGRAMMIERFABRIK GmbH', img: '' },
	{ name: 'Raiffeisen Software GmbH', img: '' },
	{ name: 'Raiffeisenlandesbank OÖ Aktiengesellschaft', img: '' },
	{ name: 'RAITEC GmbH', img: '' },
	{ name: 'RZL Software GmbH', img: '' },
	{ name: 'SecureGUARD GmbH', img: '' },
	{ name: 'SKE Engineering Gmbh', img: '' },
	{ name: 'Softpoint IT-Solutions GmbH & Co KG', img: '' },
	{ name: 'solvistas GmbH', img: '' },
	{ name: 'Sprecher Automation GmbH', img: '' },
	{ name: 'STIWA Holding GmbH', img: '' },
	{ name: 'TeamViewer Austria GmbH', img: '' },
	{ name: 'TGW Logistics Group', img: '' },
	{ name: 'TRAUNER Verlag + Buchservice GmbH', img: '' },
	{ name: 'TRUMPF Maschinen Austria GmbH + Co. KG', img: '' },
	{ name: 'umdasch Store Makers Management GmbH', img: '' },
	{ name: 'Uni Software Plus GmbH', img: '' },
	{ name: 'VSTech Service & Engineering GmbH', img: '' },
	{ name: 'Wacker Neuson Linz GmbH', img: '' },
	{ name: 'Wirtschaftskammer Oberösterreich', img: '' }
]
  



/*******************
* MEMBERS COLUMN
********************/
let columnMembers = document.getElementById('column-members');
let diamondMembers;
let goldMembers;
generateMembers();
function generateMembers() {
	let html = "";
	for (let i = 0; i < members.length; i++) {
		if(members[i].img != ''){
			html += `<div onclick="showDetails(this, ${i})" class="diamond-member"><img src="./images/${members[i].img}"></div>`
		} else {
			html += `<div onclick="showDetails(this, ${i})" class="gold-member"><h2>${members[i].name}</h2></div>`
		}
	}
	columnMembers.innerHTML = html
}




/*******************
* DETAILS
********************/
let columnDetails = document.getElementById('column-details');
let detailsHeader = document.getElementById('details-header');
let lastMember = undefined;
function showDetails(element, i) {

	gsap.timeline({ delay: 0, repeat: 0, ease: Power1.easeInOut })
		.set(columnDetails, { opacity: 1, immediateRender: true })
		.to(columnDetails, { opacity: 0, duration: 0.3 })
		.set(columnDetails, { innerHTML: `<img src="./images/diamond-ad2.jpg" alt="">` })
		.to(columnDetails, { duration: 0.3, delay: 0.3, opacity: 1 })

	gsap.timeline({ delay: 0, repeat: 0, ease: Power1.easeInOut })
		.to(element, { backgroundColor: '#333', immediateRender: true })

	gsap.timeline({ delay: 0, repeat: 0, ease: Power1.easeInOut })
		.to(lastMember, { backgroundColor: '#000', immediateRender: true })
	
	lastMember = element;
}

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




/*******************
* INIT
********************/
requestAnimationFrame( ()=>{
	diamondMembers = document.getElementsByClassName('diamond-member');
	goldMembers = document.getElementsByClassName('gold-member');

	lastMember = diamondMembers[0];
	newDiamondMember();
})




/*******************
* DIAMOND MEMBER FOCUS
********************/
let lastActivityTime = Date.now();
document.addEventListener('mousemove', updateLastActivityTime);
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
