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
let main_slider = document.querySelector('#main-slider .splide__list');
let thumbnail_slider = document.querySelector('#thumbnail-slider .splide__list');
let root = document.querySelector(':root');



/*******************
* PRELOAD
********************/
// let preload = `<link rel="preload" as="image" href="./images/diamond-ads/diamond-ad_16-9.jpg"></link>`;
// for (let i = 0; i < diamondMembers.length; i++) {
// 	preload += `<link rel="preload" as="image" href="./images/diamond-logos/${diamondMembers[i].logo}"></link>`;
// 	for (let j = 0; j < diamondMembers[i].poster.length; j++) {
// 		if(diamondMembers[i].poster[j].includes('.mp4')) {

// 		} else {
// 			preload += `<link rel="preload" as="image" href="./images/diamond-ads/${diamondMembers[i].poster[j]}"></link>`;
// 		}
// 	}	
// }
// document.querySelector('head').innerHTML += preload;



/*******************
 * CONTENT
 ******************/
let html_code_main = '';
for (let i = 0; i < diamondMembers.length; i++) {
	if(diamondMembers[i].poster == '' || diamondMembers[i].poster == null || diamondMembers[i].poster == undefined || diamondMembers[i].poster.length == 0 ) {
		html_code_main += `<li class="splide__slide"><img src="./images/diamond-ads/diamond-ad_16-9.jpg" alt="poster"></li>`;
	} else {
		html_code_main += `<li class="splide__slide"><img src="./images/diamond-ads/${diamondMembers[i].poster[0]}" alt="poster"></li>`;
	}
}
for (let i = 0; i < goldMembers.length; i++) {
	if(goldMembers[i].poster == '' || goldMembers[i].poster == null || goldMembers[i].poster == undefined || goldMembers[i].poster.length == 0 ) {
		html_code_main += `<li class="splide__slide"><img src="./images/diamond-ads/diamond-ad_16-9.jpg" alt="poster"></li>`;
	} else {
		html_code_main += `<li class="splide__slide"><img src="./images/diamond-ads/${goldMembers[i].poster}" alt="poster"></li>`;
	}
}
main_slider.innerHTML = html_code_main;


let html_code_thumb = '';
for (let i = 0; i < diamondMembers.length; i++) {
	if(diamondMembers[i].logo == '' || diamondMembers[i].logo == null || diamondMembers[i].poster == undefined ) {
		html_code_thumb += `<li class="splide__slide"><p>${diamondMembers[i].name}</li></p>`;
	} else {
		html_code_thumb += `<li class="splide__slide"><p><img src="./images/diamond-logos/${diamondMembers[i].logo}" alt="poster"></p></li>`;
	}
}
for (let i = 0; i < goldMembers.length; i++) {
	if(goldMembers[i].logo == '' || goldMembers[i].logo == null || goldMembers[i].poster == undefined ) {
		html_code_thumb += `<li class="splide__slide"><p>${goldMembers[i].name}</p></li>`;
	} else {
		html_code_thumb += `<li class="splide__slide"><p><img src="./images/diamond-logos/${goldMembers[i].logo}" alt="poster"></p></li>`;
	}
}
thumbnail_slider.innerHTML = html_code_thumb;




/*******************
* SPLIDE SLIDER
********************/
let main;
let thumbnails;

// rainbow colors for highlight
let hue = 0;
function getNextRainbowColor() {
	hue = (hue + 10) % 360;
	return `hsl(${hue}, 50%, 50%)`;
}

setTimeout( ()=>{
	main = new Splide('#main-slider', {
		type: 'fade',
		heightRatio: 0.3,
		pagination: false,
		arrows: false,
		cover: true,
		width: '80vw',
		height: '45vw'
	});
	
	thumbnails = new Splide('#thumbnail-slider', {
		type: 'loop',
		snap: true,
		perPage: 4,
		isNavigation: true,
		gap: 20,
		pagination: false,
		cover: true,
		autoWidth: true,
		height: '8vh',
		width: '90vw',
		focus: 'center'
	});
	main.sync(thumbnails);
	main.on('move', () => {
		let randomColor = getNextRainbowColor();
		console.log(randomColor);
		root.style.setProperty('--highlight', randomColor);
	});
	main.mount();
	thumbnails.mount();
},100);


