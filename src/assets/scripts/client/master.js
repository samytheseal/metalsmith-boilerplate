jQuery(document).ready(function($) {


	// ---------------------------------------------------------------------
	// | critical                                                          |
	// ---------------------------------------------------------------------

	// add user-agent to html element as data attribute
	(function userAgent() {
		var doc = document.documentElement;
		doc.setAttribute('data-useragent', navigator.userAgent);
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


	// ---------------------------------------------------------------------
	// | sitewide                                                          |
	// ---------------------------------------------------------------------

	console.log('master.js');

});
