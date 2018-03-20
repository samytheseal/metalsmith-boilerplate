// ---------------------------------------------------------------------
// || master.js
// ---------------------------------------------------------------------


jQuery(document).ready(function($) {


	// add user-agent to html element as data attribute
	(function userAgent() {
		var uA = navigator.userAgent;
		document.documentElement.setAttribute('data-useragent', uA);
		if (uA.indexOf('Edge') >= 0) {
			document.documentElement.className += ' ms-edge';
		}
		if (uA.indexOf('MSIE') >= 0 || uA.indexOf('rv:11') >= 0) {
			document.documentElement.className += ' ms-explorer';
		}
	}());

	// service worker
	(function serviceWorker() {
		if ('serviceWorker' in navigator) {
			navigator.serviceWorker.register('/service-worker.js').then(function(registration) {
				// registration successful
				console.log('ServiceWorker registration successful with scope: ', registration.scope);
			}).catch(function(err) {
				// registration failed :(
				console.log('ServiceWorker registration failed: ', err);
			});
		}
	}());

	// load fonts
	// 
	(function fontObserver() {
		var robotoFont = new FontFaceObserver('Roboto');
		robotoFont.load().then(function() {
			document.body.className += ' fonts-loaded';
		}, function() {
			console.log('font is not available');
		});
	}());


	console.log('master.js loaded');
	$('body').addClass('js-loaded');


});
