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
		html_code_main += `<li class="splide__slide"><img src="./members/default/diamond-ad_16-9.jpg" alt="poster"></li>`;
	} else {
		html_code_main += `<li class="splide__slide"><img src="./members/diamond/poster/${diamondMembers[i].poster[0]}" alt="poster"></li>`;
	}
}
for (let i = 0; i < goldMembers.length; i++) {
	if(goldMembers[i].poster == '' || goldMembers[i].poster == null || goldMembers[i].poster == undefined || goldMembers[i].poster.length == 0 ) {
		html_code_main += `<li class="splide__slide"><img src="./members/default/diamond-ad_16-9.jpg" alt="poster"></li>`;
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
		perPage: 4,
		isNavigation: true,
		gap: 20,
		pagination: false,
		cover: true,
		autoWidth: true,
		height: '8vh',
		width: '90vw',
		focus: 'center',
		drag: 'free',
		snap: true,
		autoplay: true,
		interval: 5000
	});


	thumbnails.on('visible', () => {
		let randomColor = getNextRainbowColor();
		root.style.setProperty('--highlight', randomColor);
		console.log(1);
	});
	main.on('active', () => {
		let randomColor = getNextRainbowColor();
		root.style.setProperty('--highlight', randomColor);
		console.log(2);
	});


	main.mount();
	thumbnails.mount( );
	main.sync(thumbnails);

	// Check if Splide instances are mounted
	console.log('Main slider mounted:', main.Components);
	console.log('Thumbnail slider mounted:', thumbnails.Components);

	


	

},100);

// const { Autoplay } = splide.Components;
// Autoplay.pause();


