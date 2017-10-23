// Filters by tag
// Created: 01/2017
// Updated: -
// Created for: Styleguide

(function($) {

    'use strict';
	$.fn.styleguide_filters_tag = function() {

        return this.each(function(index) {

            function init() {


                $target.each( function() {

                    var $this = $(this),
                        class_list = $this.attr('class').split(' ');

                    for (var i=class_list.length-1; i>=0; i--) {
                        if (class_list[i].indexOf('module-tag--') === -1 ) {
                            class_list.splice(i, 1);
                        }
                    }

                    var $wrapper = $('<div class="module-tag-wrapper"><span class="module-tag-title">Tags: </span></div>');

					if( $this.hasClass('module-wrapper') ){
						$this.find(' .module-title ').first().after( $wrapper );
					}else {
						$this.before( $wrapper );
					}

                    $.each( class_list , function(i, c) {
                        $wrapper.append('<span class="module-tag">' + c.split('module-tag--')[1] + '</span>');
                    });
                });
            }

            function filter_modules() {
                var $this = $(this),
                    filter = $this.val();

                if( filter !== 'all' ){

                    $target.removeClass( 'hide-element' );
                    $( target + ':not(.' + select_path + filter + ')' ).addClass( 'hide-element' );

                    $target_wrapper.each(function(){
                        $(this).attr( 'data-nb-modules', $(this).find('.module:not(.hide-element)').length );
                    });

                }else {
                    $target.removeClass( 'hide-element' );

                    $target_wrapper.each(function(){
                        $(this).attr( 'data-nb-modules', $(this).find('.module:not(.hide-element)').length );
                    });
                }


            }

            var app = $(this),
                target = app.data('target'),
                $target = $(target),
                $target_wrapper = $('.modules-wrapper'),
                $select = app.find('select'),
                select_path = 'module-tag--';

            init();

            $select.on('change', filter_modules );

        });
    }

})(jQuery);
