jQuery(document).ready(function($) {
	
	// test init
	var test1Init = function() {
		console.log('component test1 js loaded');
	}
	
	// test check
	if ($('.jsTest1').length) {
		lazyLoadScript('https://code.jquery.com/ui/1.12.1/jquery-ui.min.js', 'test').then(function() {
			test1Init();
		})
	}

});
