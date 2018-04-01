jQuery(document).ready(function($) {

    // test init
    var testInit = function() {
        console.log('component test js loaded');
    }

    // test check
    if ($('.jsTest').length) {
        lazyLoadScript('https://code.jquery.com/ui/1.12.1/jquery-ui.min.js', 'test').then(function() {
            testInit();
        })
    }

});
