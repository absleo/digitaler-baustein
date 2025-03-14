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
 * CONTENT
 ******************/
let html_code_main = '';
for (let i = 0; i < diamondMembers.length; i++) {
	if(diamondMembers[i].poster == '' || diamondMembers[i].poster == null || diamondMembers[i].poster == undefined || diamondMembers[i].poster.length == 0 ) {
		html_code_main += `<li class="splide__slide"><img src="./members/default/default-ad_16-9.jpg" alt="poster"></li>`;
	} else {
		html_code_main += `<li class="splide__slide"><img src="./members/diamond/poster/${diamondMembers[i].poster[0]}" alt="poster"></li>`;
	}
}
for (let i = 0; i < goldMembers.length; i++) {
	if(goldMembers[i].poster == '' || goldMembers[i].poster == null || goldMembers[i].poster == undefined || goldMembers[i].poster.length == 0 ) {
		html_code_main += `<li class="splide__slide"><img src="./members/default/default-ad_16-9.jpg" alt="poster"></li>`;
	} else {
		html_code_main += `<li class="splide__slide"><img src="./members/gold/poster/${goldMembers[i].poster}" alt="poster"></li>`;
	}
}
main_slider.innerHTML = html_code_main;


let html_code_thumb = '';
for (let i = 0; i < diamondMembers.length; i++) {
	if(diamondMembers[i].logo == '' || diamondMembers[i].logo == null || diamondMembers[i].poster == undefined ) {
		html_code_thumb += `<li class="splide__slide"><p>${diamondMembers[i].name}</li></p>`;
	} else {
		html_code_thumb += `<li class="splide__slide"><p><img src="./members/diamond/logos/${diamondMembers[i].logo}" alt="logo"></p></li>`;
	}
}
for (let i = 0; i < goldMembers.length; i++) {
	if(goldMembers[i].logo == '' || goldMembers[i].logo == null || goldMembers[i].poster == undefined ) {
		html_code_thumb += `<li class="splide__slide"><p>${goldMembers[i].name}</p></li>`;
	} else {
		html_code_thumb += `<li class="splide__slide"><p><img src="./members/gold/logos/${goldMembers[i].logo}" alt="logo"></p></li>`;
	}
}
thumbnail_slider.innerHTML = html_code_thumb;




/*******************
* SPLIDE SLIDER
********************/
let main;
let thumbnails;
let slideDuration = 3000;
let restartAutoplayTimeout;
let hue = 0;

setTimeout( ()=>{
	main = new Splide('#main-slider', {
		type: 'fade',
		speed: 1000,
		heightRatio: 0.3,
		pagination: false,
		arrows: false,
		cover: true,
		pauseOnHover: false,
		width: '80vw',
		height: '45vw'
	});
	
	thumbnails = new Splide('#thumbnail-slider', {
		type: 'loop',
		perPage: 4,
		isNavigation: true,
		gap: 20,
		pagination: false,
		cover: true,
		autoWidth: true,
		height: '8vh',
		width: '90vw',
		focus: 'center',
		drag: true,
		swipe: true,
		snap: true,
		autoplay: true,
		pauseOnHover: false,
		interval: slideDuration,
		speed: 250
	});


	main.on('active', () => {
		// generate next hue color
		hue = (hue + 10) % 360;
		let hueColor = `hsl(${hue}, 50%, 50%)`; // color:
		let hueRotate = `hue-rotate(${hue}deg)`; // filter:

		root.style.setProperty('--hueColor', hueColor);

		// change hue rotate for default poster
		let currentSlide = main.Components.Elements.slides[main.index];
		let currentSlideImg = currentSlide.querySelector('img');
		if(currentSlideImg.src.includes('/default/')) {
			root.style.setProperty('--hueRotate', hueRotate);
		} else {
			root.style.setProperty('--hueRotate', `hue-rotate(0deg)`);
		}


		// restart autoplay after click
		clearTimeout(restartAutoplayTimeout);
		restartAutoplayTimeout = setTimeout(()=>{
			thumbnails.Components.Autoplay.play();
		},(slideDuration+3000))
	});


	main.mount();
	thumbnails.mount( );
	main.sync(thumbnails);

},100);




