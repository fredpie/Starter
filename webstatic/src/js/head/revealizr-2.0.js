
/*!
 * Revealizr - Detect features v2.0.0
 *
 * Plugin équipe Tink, combinant la librairie Modernizr et l'extension Detectizr,
 * en plus de manipulations personnalisée pour récupérer les détails du navigateur
 *
 * Navigateurs supportés : IE 10+, Tous les autres
 *
 * Création: Fred Pie (2016)
 * Original (v1.0.0): JMN (2014)
 *
 * Licensed MIT
 */
var Revealizr = Revealizr || {};
(function(window, document, $) {
    "use strict";

    window.Revealizr = function() {
        var app = this;

        /*
         Ajout de class possible dans le HTML:
         - desktop-size
         - tablet-size
         - mobile-size
         - server-dev
         - server-int
         - server-qa
         - server-tac
         - egc
         - egc-content
         */

        // Déclaration des variables

        // first load
        app.isDetectFeatureFirstLoad = true;

        // device and breakpoints
        app.isTabletDevice = false;
        app.isTabletSize = false;
        app.isMobileDevice = false;
        app.isMobileSize = false;
        app.isDesktopDevice = false;
        app.isDesktopSize = false;
        app.isBrowserAndroid = false;
        app.isBrowserMac = false;
        app.isBrowserBlackberryMobile = false;
        app.deviceType = 'no-touch';
        //app.isTouchEventsSupported = false;

        // events
        app.resizeORorientation = '';
        app.clickORtouchend = '';
        app.swiping = false;

        // EGC CMS TINK
        app.isCmsEgc = false;
        app.isCmsEgcContent = false;

        // serrvers
        app.server = '';

        app.currentViewportSize = '';
        app.lastViewportSize = '';
        app.windowOrientation = '';

        app.breakpointMobileMaxWidth = '767';
        app.breakpointTabletMaxWidth = '1023';
        app.breakpointDesktopMinWidth = '1024';

        app.nativeAndroidMinimumChromeVersion = 40; // Version minimum du Chrome qu'utilise le navigateur natif d'Android

        // Sélecteurs
        app.$html = document.querySelector('html');
        app.$href = document.location.href;
        app.$objAgent = navigator.userAgent;
        app.$objFullVersion = ''+parseFloat(navigator.appVersion);

        // Valeurs
        app.htmlClasses = app.$html.getAttribute('class');

        // Fonctions
        app.hasClass = function(selector, classToCheck) {
            return selector.classList.contains(classToCheck);
        };

        app.detectFeatures = function() {
            "use strict";

            // Tableau d'ajout et de supression de classes dans la balise HTML
            app.arrayHtmlAdd = [];
            app.arrayHtmlRemove = [];

            /*
             * Lectures et vérifications
             */

            // Vérification du device
            if( app.hasClass(app.$html, 'desktop') ) {
                app.isDesktopDevice = true;
                app.isTabletDevice = false;
                app.isMobileDevice = false;
            }
            else if( app.hasClass(app.$html, 'tablet') ) {
                app.isDesktopDevice = false;
                app.isTabletDevice = true;
                app.isMobileDevice = false;
            }
            else if( app.hasClass(app.$html, 'mobile') ) {
                app.isDesktopDevice = false;
                app.isTabletDevice = false;
                app.isMobileDevice = true;
            }

            // Vérification du breakpoint
            if( Modernizr.mq('only all and (max-width: ' + app.breakpointMobileMaxWidth + 'px)') ) {
                app.isMobileSize = true;
                app.isTabletSize = false;
                app.isDesktopSize = false;
                app.arrayHtmlAdd.push('mobile-size');
                app.arrayHtmlRemove.push('tablet-size');
                app.arrayHtmlRemove.push('desktop-size');
            }
            else if( Modernizr.mq('only all and (max-width: ' + app.breakpointTabletMaxWidth + 'px)') ) {
                app.isMobileSize = false;
                app.isTabletSize = true;
                app.isDesktopSize = false;
                app.arrayHtmlRemove.push('mobile-size');
                app.arrayHtmlAdd.push('tablet-size');
                app.arrayHtmlRemove.push('desktop-size');
            }
            else if( Modernizr.mq('only all and (min-width: ' + app.breakpointDesktopMinWidth + 'px)') ){
                app.isMobileSize = false;
                app.isTabletSize = false;
                app.isDesktopSize = true;
                app.arrayHtmlRemove.push('mobile-size');
                app.arrayHtmlRemove.push('tablet-size');
                app.arrayHtmlAdd.push('desktop-size');
            }

            // Si l'on n'est pas au premier chargement de la fonction detectFeatures(),
            // récupération du dernier -viewport size-
            if( app.isDetectFeatureFirstLoad === false ) {
                app.lastViewportSize = app.currentViewportSize;
            }

            // Ensuite, vérification du -viewport size- en cours
            if( app.isMobileSize ) {
                app.currentViewportSize = 'mobile-size';
            }
            else if( app.isTabletSize ) {
                app.currentViewportSize = 'tablet-size';
            }
            else if( app.isDesktopSize ) {
                app.currentViewportSize = 'desktop-size';
            }

            // Vérification de l'orientation du device
            if( app.hasClass(app.$html, 'portrait') ){
                app.windowOrientation = 'portrait';
            }
            if( app.hasClass(app.$html, 'landscape') ){
                app.windowOrientation = 'landscape';
            }

            // Vérification si l'on est sur Blackberry Mobile
            //
            if( ( app.hasClass(app.$html, 'blackberry') || app.hasClass(app.$html, 'blackberry10') ) && app.hasClass(app.$html, 'smallscreen') ) {
                app.isBrowserBlackberryMobile = 'true';
                app.arrayHtmlAdd.push('mobile');
                app.arrayHtmlRemove.push('tablet');
            }

            // Vérification si l'on est sur Android
            if ( app.hasClass(app.$html, 'android') ){
                app.isBrowserAndroid = true;
            }

            // Vérification si l'on est sur Apple Mac
            if ( app.hasClass(app.$html, 'mac') ){
                app.isBrowserMac = true;
            }

            // Vérification si l'on est sur l'EGC (CMS)
            if ( app.$href.indexOf('/site-web/') > -1 ) {
                app.isCmsEgc = true;
                app.arrayHtmlAdd.push('egc');
            }
            if ( app.$href.indexOf('mode=content') > -1 ) {
                app.isCmsEgcContent = true;
                app.arrayHtmlAdd.push('egc-content');
            }

            // Vérification si nous sommes en DEV
            if ( app.$href.indexOf('local.') > -1 || app.$href.indexOf('localhost') > -1 || app.$href.indexOf('.s2i.com') > -1 ) {
                app.server = 'dev';
                app.arrayHtmlAdd.push('server-dev');
            }

            // Vérification si nous sommes en INT
            if ( app.$href.indexOf('.tinkint') > -1 ) {
                app.server = 'int';
                app.arrayHtmlAdd.push('server-int');
            }

            // Vérification si nous sommes en QA
            if ( app.$href.indexOf('.tinkqa') > -1 ) {
                app.server = 'qa';
                app.arrayHtmlAdd.push('server-qa');
            }

            // Vérification si nous sommes en TAC
            if ( app.$href.indexOf('.tinktac') > -1 ) {
                app.server = 'tac';
                app.arrayHtmlAdd.push('server-tac');
            }

            // Vérification si le device/navigateur supporte les -Touch Events-
            /*if ( app.hasClass(app.$html, 'touchevents') ) {
                app.isTouchEventsSupported = true;
            }*/

            // (typeof el.ongesturestart == "function")
            if( ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0) ) {
                app.deviceType = 'touch';
            }

            // Détection à savoir si on utilise -touchend- ou -click- et -resize- ou -orientationchange-
            if( ( app.isMobileDevice || app.isTabletDevice ) && !app.isTouchEventsSupported ) {
                app.resizeORorientation = 'orientationchange';
                app.clickORtouchend = 'touchend';
            }
            else {
                app.resizeORorientation = 'resize';
                app.clickORtouchend = 'click';
            }


            /*
             * Vérification si l'on est sur le navigateur natif d'Android
             * Comme le navigateur natif d'Android est basé sur une version antérieur de Chrome ou Safari,
             * il faut le détecter pour permettre une facilité de déboguage du navigateur
             */

            // Si le navigateur natif d'Android utilise "Chrome"
            if( (app.objOffsetVersion = app.$objAgent.indexOf("Chrome") ) !== -1 && app.isBrowserAndroid ) {

                app.objFullVersion = app.$objAgent.substring(app.objOffsetVersion+7, app.objOffsetVersion+9);

                if( app.objFullVersion < app.nativeAndroidMinimumChromeVersion ) {
                    app.oldAndroid = true;
                    app.arrayHtmlAdd.push('old-android');
                }
            }
            // Si le navigateur natif d'Android utilise "Safari"
            else if( (app.objOffsetVersion = app.$objAgent.indexOf("Safari") ) !== -1 && app.isBrowserAndroid ) {
                app.oldAndroid = true;
                app.arrayHtmlAdd.push('old-android');
            }




            /*
             * Écritures dans le DOM
             * Ajout et suppression de classes dans la balise HTML
             */
            app.arrayHtmlAdd.forEach(function (entry) {
                app.$html.classList.add(entry);
            });
            app.arrayHtmlRemove.forEach(function (entry) {
                app.$html.classList.remove(entry);
            });




            /*
             * Mettre la valeur -false- à la variable de vérification du premier chargement de la fonction
             */
            app.isDetectFeatureFirstLoad = false;
        }

		$(window).on('touchmove', function(){
	        app.swiping = true;
	    }).on('touchstart', function(){
	        app.swiping = false;
	    });
    };

    Revealizr = new Revealizr();
})(window, document, jQuery);

// À mettre en-haut complètement dans le script principal du site, celui qui s'occupe de charger le reste de vos scripts
// À utiliser avec UnderscoreJS pour mieux contrôler l'appel sur le -resize-
/*
// Appel de la fonction detectFeatures() de Revealizr
_.defer(Revealizr.detectFeatures);
$(window).on('resize', _.throttle(function () {
    "use strict";

    Revealizr.detectFeatures();
}, 200));
*/
