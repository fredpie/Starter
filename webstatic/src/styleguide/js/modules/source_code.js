// Source code
// Created: 01/2017
// Updated: -
// Created for: Styleguide

(function($) {

    'use strict';
	$.fn.styleguide_source_code = function() {

        return this.each(function(index) {

            var app = $(this),
                source_code = app.html();

            app.append(''+
                '<div class="source-code">'+
                '<button class="sc__btn" type="button">S</button>'+
                '<textarea class="sc__textarea"></textarea>'+
                '</div>'
            );

			app.find( '.sc__textarea' ).text(source_code);

            var btn_source = app.find('.sc__btn'),
                textarea_source = app.find('.sc__textarea');

            btn_source.on('click', function(){
                app.toggleClass('source-code--opened');
                textarea_source.select();
                document.execCommand("copy")
            });


        });
    }

})(jQuery);
