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
	if(diamondMembers[i].poster == '' || diamondMembers[i].poster.length == 0 ) {
		if(diamondMembers[i].logo != '') {
			html_code_main += `<li class="splide__slide"><div><img src="./members/default/default-ad_16-9.jpg" alt="poster" class="main-poster"><img src="./members/diamond/logos/${diamondMembers[i].logo}" class="main-poster-logo" alt="logo"></div></li>`;
		} else {
			html_code_main += `<li class="splide__slide"><div><img src="./members/default/default-ad_16-9.jpg" alt="poster" class="main-poster"></div></li>`;
		}
	} else {
		let rand = Math.floor(Math.random()*diamondMembers[i].poster.length);
		html_code_main += `<li class="splide__slide"><div><img src="./members/diamond/poster/${diamondMembers[i].poster[rand]}" alt="poster" class="main-poster"></div></li>`;
	}
}
for (let i = 0; i < goldMembers.length; i++) {
	if(goldMembers[i].poster == '' || goldMembers[i].poster.length == 0 ) {
		if(goldMembers[i].logo != '') {
			html_code_main += `<li class="splide__slide"><div><img src="./members/default/default-ad_16-9.jpg" alt="poster" class="main-poster"><img src="./members/gold/logos/${goldMembers[i].logo}" class="main-poster-logo" alt="logo"></div></li>`;
		} else {
			html_code_main += `<li class="splide__slide"><div><img src="./members/default/default-ad_16-9.jpg" alt="poster" class="main-poster"></div></li>`;
		}
	} else {
		html_code_main += `<li class="splide__slide"><div><img src="./members/gold/poster/${goldMembers[i].poster}" alt="poster" class="main-poster"></div></li>`;
	}
}
main_slider.innerHTML = html_code_main;


let slideDuration = 8000; // MEMBERS WITH ACTIVE POSTERS *2 => 16000
let html_code_thumb = '';
for (let i = 0; i < diamondMembers.length; i++) {
	if(diamondMembers[i].logo == '' ) {
		html_code_thumb += `<li class="splide__slide" data-splide-interval="${slideDuration}" style="min-width:20vw"><p>${diamondMembers[i].name}</li></p>`;
	} else {
		html_code_thumb += `<li class="splide__slide" data-splide-interval="${slideDuration*2}" style="min-width:20vw"><p><img src="./members/diamond/logos/${diamondMembers[i].logo}" alt="logo"></p></li>`;
	}
}
for (let i = 0; i < goldMembers.length; i++) {
	if(goldMembers[i].logo == '' ) {
		html_code_thumb += `<li class="splide__slide" data-splide-interval="${slideDuration}" style="min-width:20vw"><p>${goldMembers[i].name}</p></li>`;
	} else {
		html_code_thumb += `<li class="splide__slide" data-splide-interval="${slideDuration*2}" style="min-width:20vw"><p><img src="./members/gold/logos/${goldMembers[i].logo}" alt="logo"></p></li>`;
	}
}
thumbnail_slider.innerHTML = html_code_thumb;




/*******************
* SPLIDE SLIDER
********************/
let main;
let thumbnails;
let restartAutoplayTimeout;
let hue = 0;

setTimeout( ()=>{
	main = new Splide('#main-slider', {
		type: 'fade',
		speed: 1000,
		pagination: false,
		arrows: false,
		cover: true,
		pauseOnHover: false,
		pauseOnFocus: false,
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
		height: '7vh',
		width: '90vw',
		focus: 'center',
		drag: true,
		swipe: true,
		snap: true,
		autoplay: true,
		pauseOnHover: false,
		pauseOnFocus: false,
		interval: slideDuration,
		speed: 250
	});

	main.mount();
	thumbnails.mount( );
	main.sync(thumbnails);


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

	});


	/* TOUCH EVENT */
	document.addEventListener('click', function() {
		thumbnails.Components.Autoplay.pause();
		clearTimeout(restartAutoplayTimeout);
		restartAutoplayTimeout = setTimeout(()=>{
			thumbnails.Components.Autoplay.play();
		},slideDuration*2 + 2000);

	}, false);
	document.addEventListener('touchstart', function() {
		thumbnails.Components.Autoplay.pause();
		clearTimeout(restartAutoplayTimeout);
		restartAutoplayTimeout = setTimeout(()=>{
			thumbnails.Components.Autoplay.play();
		},slideDuration*2 + 2000);

	}, false);

},100);





