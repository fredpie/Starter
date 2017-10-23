//_.defer(Revealizr.detectFeatures);
(function (window, document, $) {
	$(window).on('resize', _.throttle(function () {
		"use strict";

		Revealizr.detectFeatures();
	}, 200));

	$(document).ready(function () {

		Revealizr.detectFeatures();

		// Elements to inject
		var mySVGsToInject = document.querySelectorAll('img.inject-svg');
		// Do the injection
		SVGInjector(mySVGsToInject);

		// Main menu hide or show desktop / tablet
		var menuMain_onscroll = _.throttle(menu_display_hide, 200);
		menuMain_onscroll();
		$(window).on('scroll', menuMain_onscroll);

		// tabs Default
		$(' [data-feature="tabs-default"] ').tabs_default();

		// menu dropdown
		$(' [data-module="menu-dropdown"] ').menu_dropdown();

		// Link internal(scrollto)
		$(' [data-module="link-internal"] ').link_internal();

		// Images source
		$(' [data-module="image-source"] ').image_source();

		// Link internal(scrollto)
		$(' .js-form-type-select select').select_custom();

	});
})(window, document, jQuery);
