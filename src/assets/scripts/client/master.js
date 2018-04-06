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
    // https://github.com/bramstein/fontfaceobserver
    (function fontObserver() {
        var appFont = new FontFaceObserver('Roboto');
        appFont.load(null, 5000).then(function() {
            document.body.className += ' fonts-loaded';
        }, function() {
            console.log('font is not available');
        });
    }());

    // replace SVG images with inline SVG xml
    // https://gist.github.com/Bloggerschmidt/61beeca2cce94a70c9df
    (function svgImages() {
        $('.jsSvg').each(function() {
            var $img = $(this);
            var imgURL = $img.attr('src');
            var $attributes = $img.prop('attributes');
            $.get(imgURL, function(data) {
                var $svg = $(data).find('svg');
                $.each($attributes, function() {
                    $svg = $svg.attr(this.name, this.value);
                });
                $svg = $svg.removeAttr('xmlns:a').removeAttr('width').removeAttr('height');
                $svg = $svg.addClass('jsSvgReplaced');
                $img.replaceWith($svg);
                $img = $svg.find('title, desc').text($svg.attr('alt'));
                $img = $svg.removeAttr('alt');
                $img = $svg.attr('aria-labelledby', 'title desc').attr('role', 'img');
            }, 'xml');
        });
    }());

    // add rel noopener to external _blank links
    // https://gist.github.com/JamoCA/80f65eb07f054b1326221bd4f15868d6
    (function sanitiseExternalLinks() {
        $('a[target="_blank"]').each(function() {
            var a = $(this);
            if (location.hostname !== this.hostname) {
                var originalRel = (this.rel === undefined) ? '' : this.rel.toLowerCase();
                var newRel = originalRel.split(' ');
                if (originalRel.indexOf('noopener') === -1) {
                    newRel.push('noopener');
                }
                if (originalRel.indexOf('noreferrer') === -1) {
                    newRel.push('noreferrer');
                }
                if (originalRel.indexOf('nofollow') === -1) {
                    newRel.push('nofollow');
                }
                a.attr('rel', newRel.join(' ').trim());
            }
        });
    })();


    console.log('master.js loaded');
    $('body').addClass('js-loaded');


});
