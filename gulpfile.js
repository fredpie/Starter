var gulp = require('gulp'),
	plumber = require('gulp-plumber'),
	rename = require('gulp-rename'),
	notify = require('gulp-notify'),
	postcss = require('gulp-postcss'),
	autoprefixer = require('autoprefixer'),
	cache = require('gulp-cache'),
	sass = require('gulp-sass'),
	uglify = require('gulp-uglify'),
	browserSync = require('browser-sync'),
	browserslist = require('browserslist'),
	extender = require('gulp-html-extend'),
	concat = require('gulp-concat'),
	sourcemaps = require('gulp-sourcemaps'),
	svgmin = require('gulp-svgmin'),
	image = require('gulp-image'),
	reload = browserSync.reload;

var reload_stream = browserSync.reload({ stream: false });

// paths
var path_root = './',
	path_dist = path_root + '/webstatic/dist/',
	path_dist_fonts = path_dist + 'fonts',
	path_dist_js = path_dist + 'js',
	path_dist_css = path_root + 'dynamic/src/',
	path_dist_html = path_dist + 'html',
	path_dist_img = path_root + 'dynamic/src/images',
	path_dist_svg = path_root + 'dynamic/src/svg',
	path_webstatic = path_root + 'webstatic/src/',
	path_webstatic_fonts = path_webstatic + 'fonts/',
	path_webstatic_js = path_webstatic + 'js/',
	path_webstatic_scss = path_webstatic + 'scss/',
	path_webstatic_img = path_webstatic + 'images/',
	path_webstatic_svg = path_webstatic + 'svg/',
	path_webstatic_html = path_webstatic + 'html-static/';


// environment variable
var env_type = 'dev';

// when called, set the environment variable to PROD
gulp.task('env--prod', function () {
	env_type = 'prod';
	reload_stream = '';
});

//
// Static server
//

gulp.task('browser-sync', function () {
	browserSync.init([path_dist + 'css/**/*.css', path_dist + 'js/**/*.js', path_dist + 'html-static/**/*.html'], {
		port: 8080,
		reloadDelay: 500,
		open: false,
		server: {
			baseDir: "./",
			directory: true
		}
	});
});

//
// fonts build task
//

gulp.task('fonts', function () {
	gulp.src(path_webstatic_fonts + '/**/*.*')
		.pipe(gulp.dest(path_dist_fonts));
});

function css_compression() {
	if (env_type === 'prod') {
		var css_compression = { outputStyle: 'compressed' };
	} else {
		var css_compression = { outputStyle: 'expanded' };
	}
}

//
// SCSS build task
//

gulp.task('styles', function () {

	// If PROD, compress the CSS
	css_compression();

	var processors = [
		autoprefixer({ browsers: ['not ie < 11', 'iOS >= 9', 'Android >= 47', 'FIREFOX ESR'] })
	];

	gulp.src([path_webstatic_scss + '**/*.scss'])
		.pipe(sourcemaps.init())
		.pipe(plumber({
			errorHandler: function (error) {
				console.log(error.message);
			}
		}))
		.pipe(sass(css_compression))
		.pipe(postcss(processors))
		.pipe(rename({
			suffix: '.min'
		}))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest( path_dist_css ))


	browserSync.reload({ stream: true });
});

// js compression options
function js_compression() {
	if (env_type === 'prod') {
		var css_compression = { outputStyle: 'compressed' };
	} else {
		var css_compression = { outputStyle: 'expanded' };
	}
}

//
// JavaScript build tasks
//

// js only for the static server
gulp.task('js-static', function () {

	return gulp.src([
		path_webstatic_js + 'static-only/jquery-2.2.3.js',
		path_webstatic_js + 'static-only/underscore-1.8.3.js',
	])
		.pipe(sourcemaps.init())
		.pipe(plumber({
			errorHandler: function (error) {
				console.log(error.message);
				this.emit('end');
			}
		}))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest(path_dist_js));
});

// Every JS that need to be inserted in the head
// Compiles to head.min.js
gulp.task('js-head', function () {

	// if PROD, magnle and compress the JS
	js_compression();

	return gulp.src([
		path_webstatic_js + 'head/modernizr-3.3.1.js',
		path_webstatic_js + 'head/detectizr.js',
		path_webstatic_js + 'head/revealizr-2.0.js'
	])
		.pipe(sourcemaps.init())
		.pipe(concat('head.min.js'))
		.pipe(plumber({
			errorHandler: function (error) {
				console.log(error.message);
				this.emit('end');
			}
		}))
		.pipe(uglify(js_compression))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest(path_dist_js));
});

// Compiles all the external plugins in one file
gulp.task('js-plugins', function () {

	// if PROD, magnle and compress the JS
	js_compression();

	return gulp.src(path_webstatic_js + 'plugins/**/*.js')
		.pipe(sourcemaps.init())
		.pipe(concat('plugins.min.js'))
		.pipe(plumber({
			errorHandler: function (error) {
				console.log(error.message);
				this.emit('end');
			}
		}))
		.pipe(uglify(js_compression))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest(path_dist_js));
});

// Compiles all the custom codes from Tink
gulp.task('js-dev', function () {

	// if PROD, mangle and compress the JS
	js_compression();

	return gulp.src([path_webstatic_js + 'modules/**/*.js', path_webstatic_js + 'main.js'])
		.pipe(sourcemaps.init())
		.pipe(concat('main.min.js'))
		.pipe(plumber({
			errorHandler: function (error) {
				console.log(error.message);
				this.emit('end');
			}
		}))
		.pipe(uglify(js_compression))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest(path_dist_js));
});

// Compiles all the JS unique to one section
gulp.task('js-templates', function () {

	// if PROD, mangle and compress the JS
	js_compression();

	gulp.src(path_webstatic_js + 'dev/templates/**/*.*')
		.pipe(sourcemaps.init())
		.pipe(rename({
			suffix: '.min'
		}))
		.pipe(plumber({
			errorHandler: function (error) {
				console.log(error.message);
				this.emit('end');
			}
		}))
		.pipe(uglify(js_compression))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest(path_dist_js));
});

// Run all the JS tasks
gulp.task('js', [
	'js-static',
	'js-head',
	'js-plugins',
	'js-dev',
	'js-templates'
]);

//
// HTML build task
//

gulp.task('html', function () {
	return gulp.src([path_webstatic_html + '/pages/**/*.html'])
		.pipe(extender({
			annotations: true,
			verbose: false,
			root: './'
		}
		))
		.pipe(plumber({
			errorHandler: function (error) {
				console.log(error.message);
			}
		}))
		.pipe(gulp.dest(path_dist_html))
		.pipe(browserSync.stream());
});

//
// SVG build task
//

gulp.task('svg', function () {
	return gulp.src(path_webstatic_svg + '**/*.svg')
		.pipe(svgmin())
		.pipe(gulp.dest(path_dist_svg));
});

//
// Images build task
//

gulp.task('images', function () {
	return gulp.src(path_webstatic_img + '**/*.*')
		//.pipe(image({jpegoptim: false})) // problème sous linux
		.pipe(gulp.dest(path_dist_img));
});

//
// Styleguide
//

// Styleguide paths
var path_webstatic_styleguide = path_webstatic + 'styleguide/',
	path_webstatic_styleguide_images = path_webstatic + 'styleguide/images/',
	path_webstatic_styleguide_scss = path_webstatic + 'styleguide/scss/',
	path_webstatic_styleguide_js = path_webstatic + 'styleguide/js/',
	path_webstatic_styleguide_html = path_webstatic + 'styleguide/html/';

// Styleguide HTML task
gulp.task('styleguide-html', function () {
	return gulp.src([path_webstatic_styleguide_html + '**/*.html'])
		.pipe(extender({
			annotations: true,
			verbose: false,
			root: './'
		}
		))
		.pipe(plumber({
			errorHandler: function (error) {
				console.log(error.message);
			}
		}))
		.pipe(gulp.dest(path_dist_html + '/styleguide/'))
		.pipe(browserSync.stream());
});

// Styleguide CSS task
gulp.task('styleguide-scss', function () {

	// If PROD, compress the CSS
	if (env_type === 'prod') {
		var css_compression = { outputStyle: 'compressed' };
	} else {
		var css_compression = { outputStyle: 'expanded' };
	}

	var processors = [
		autoprefixer({ browsers: ['not ie < 11', 'iOS >= 9', 'Android >= 47'] })
	];

	gulp.src([path_webstatic_styleguide_scss + '**/*.scss'])
		.pipe(sourcemaps.init())
		.pipe(plumber({
			errorHandler: function (error) {
				console.log(error.message);
			}
		}))
		.pipe(sass())
		.pipe(postcss(processors))
		.pipe(rename({
			suffix: '.min'
		}))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest(path_dist + 'css/'))
		.pipe(browserSync.reload({ stream: true }))
});

// Styleguide JS task
gulp.task('styleguide-js', function () {
	if (env_type === 'prod') {
		var js_compression = { mangle: true, output: { beautify: false } };
	} else {
		var js_compression = { mangle: false, output: { beautify: true } };
	}
	return gulp.src([
		path_webstatic_styleguide_js + 'modules/**/*.js',
		path_webstatic_styleguide_js + 'main.js'
	])
		.pipe(sourcemaps.init())
		.pipe(concat('styleguide.js'))
		.pipe(plumber({
			errorHandler: function (error) {
				console.log(error.message);
				this.emit('end');
			}
		}))
		.pipe(uglify(js_compression))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest(path_dist_js));
});

// Styleguide image task
gulp.task('styleguide-img', function () {
	gulp.src(path_webstatic_styleguide_images + '**/*.*')
		//.pipe(image())
		.pipe(gulp.dest(path_dist_img + '/styleguide'));
});

// Styleguide build tasks
gulp.task('styleguide', [
	'styleguide-html',
	'styleguide-js',
	'styleguide-scss',
	'styleguide-img'
]);

// Styleguide watch tasks
gulp.task('styleguide-watch', ['browser-sync'], function () {
	gulp.watch(path_webstatic_styleguide_html + '**/*.*', ['styleguide-html']);
	gulp.watch(path_webstatic_styleguide_js + '**/*.*', ['styleguide-js']);
	gulp.watch(path_webstatic_styleguide_scss + '**/*.*', ['styleguide-scss']);
	gulp.watch(path_webstatic_styleguide_images + '**/*.*', ['styleguide-img']);
});

//
// watch build tasks
//

gulp.task('watch', ['browser-sync'], function () {
	gulp.watch(path_webstatic_scss + '**/*.scss', ['styles']);
	gulp.watch(path_webstatic_js + 'head/*.*', ['js-head']);
	gulp.watch(path_webstatic_js + 'plugins/*.*', ['js-plugins']);
	gulp.watch(path_webstatic_js + 'modules/**/*.*', ['js-dev']);
	gulp.watch(path_webstatic_js + 'main.js', ['js-dev']);
	gulp.watch(path_webstatic_js + 'templates/**/*.*', ['js-templates']);
	gulp.watch(path_webstatic_html + '**/*.*', ['html', 'styleguide']);
});

// Front-End default task
gulp.task('default', ['browser-sync', 'fonts', 'styles', 'js', 'html', 'svg', 'images', 'styleguide', 'styleguide-watch', 'watch']);

// Back-End default task
gulp.task('build--dev', ['fonts', 'styles', 'html', 'svg', 'images', 'styleguide']);

// watch without rebuilding
gulp.task('watch--dev', ['styleguide-watch', 'watch']);

// PROD default task
gulp.task('build--prod', ['env--prod', 'fonts', 'styles', 'html', 'svg', 'images', 'styleguide']);
