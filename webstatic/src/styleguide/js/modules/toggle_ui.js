// toggle ui
// Created: 01/2017
// Updated: -
// Created for: Styleguide

(function($) {

    'use strict';
	$.fn.toggle_ui = function() {

        return this.each(function(index) {

            var app = $(this),
				url = window.location.href,
				url_param = ( url.split('?')[1] !== undefined && url.split('?')[1].split('styleguide-param=') !== undefined )? url.split('?')[1].split('styleguide-param=')[1] : '';

				if( url_param !== undefined && url_param.split('&')[1] !== undefined ){
					url_param = url_param.split('&')[0]
				}

			function toggle_ui_classes(){

				app.toggleClass('sg__button--toggle-ui--active');
                $('.styleguide').toggleClass( 'styleguide-ui--hidden' );
			}

			function toggle_ui(){
				url = window.location.href,
				url_param = ( url.split('?')[1] !== undefined && url.split('?')[1].split('styleguide-param=') !== undefined )? url.split('?')[1].split('styleguide-param=')[1] : '';

				if( url_param !== '' ){
					window.location = url.split('?')[0];
				}else {
					window.location = url + '?styleguide-param=no-ui'
				}

				toggle_ui_classes();
			}

			if( url_param === 'no-ui' ){
				toggle_ui_classes();
			}

            app.on('click', toggle_ui);

        });
    }

})(jQuery);
