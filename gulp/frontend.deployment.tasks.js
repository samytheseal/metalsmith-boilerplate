(function frontendDeployment() {
	// path variables
	const pathvars = require('./pathvars.js')

	// tasks function
	module.exports = function(gulp, $) {
		// ---------------------------------------------------------------------
		// | assets & general                                                  |
		// ---------------------------------------------------------------------

		// copy static assets to _build
		gulp.task('f-build:assets-copy', () => {
			return gulp
				.src(pathvars.basePaths.dist + 'assets/**/*')
				.pipe(gulp.dest(pathvars.paths.viewsStatic.dist + 'assets/'))
		})

		// fonts
		gulp.task('f-build:assets-fonts', () => {
			return gulp
				.src(pathvars.paths.fonts.src)
				.pipe(gulp.dest(pathvars.paths.fonts.dist))
		})

		// images
		gulp.task('f-build:assets-images', () => {
			return (
				gulp
					.src(pathvars.paths.images.src)
					// .pipe($.imagemin(
					// 	[
					// 		$.imagemin.gifsicle({ interlaced: true }),
					// 		$.imagemin.jpegtran({ progressive: true }),
					// 		$.imagemin.optipng({ optimizationLevel: '3' }),
					// 		$.imagemin.svgo()
					// 	],
					// 	{ verbose: true }
					// ))
					.pipe(gulp.dest(pathvars.paths.images.dist))
			)
		})

		// progressive web app stuff
		gulp.task('f-build:assets-webapp', () => {
			return gulp
				.src(pathvars.basePaths.src + '_build/*.{js,json}')
				.pipe(gulp.dest(pathvars.basePaths.dist))
				.pipe(gulp.dest(pathvars.paths.viewsStatic.dist))
		})

		// all assets tasks
		gulp.task('f-build:assets', callback => {
			$.runSequence(
				'f-build:assets-fonts',
				'f-build:assets-images',
				'f-build:assets-webapp',
				'f-build:assets-copy',
				callback
			)
		})

		// ---------------------------------------------------------------------
		// | scripts                                                           |
		// ---------------------------------------------------------------------

		// js
		gulp.task('f-build:js', () => {
			return gulp
				.src([
					pathvars.paths.scripts.srcFolder + '**/*.{js,json}',
					'!' +
						pathvars.paths.scripts.srcFolder +
						'scriptsBundle.config.js'
				])
				.pipe($.sourcemaps.init())
				.pipe($.sourcemaps.write('./'))
				.pipe(gulp.dest(pathvars.paths.scripts.dist))
		})

		// js bundles
		gulp.task('f-build:js-bundles', () => {
			return gulp
				.src(
					pathvars.paths.scripts.srcFolder + 'scriptsBundle.config.js'
				)
				.pipe($.bundleAssets())
				.pipe(
					$.bundleAssets.results({
						dest: pathvars.paths.scripts.dist,
						fileName: 'scriptsBundle.result',
						pathPrefix: '/assets/scripts/'
					})
				)
				.pipe(
					gulp.dest(pathvars.paths.scripts.dist).on('end', () => {
						// $.del(pathvars.paths.scripts.dist + 'client/')
						// $.del(pathvars.paths.scripts.dist + 'vendor/')
					})
				)
		})

		// all js tasks
		gulp.task('f-build:scripts', callback => {
			$.runSequence('f-build:js', 'f-build:js-bundles', callback)
		})

		// ---------------------------------------------------------------------
		// | styles                                                            |
		// ---------------------------------------------------------------------

		// scss
		gulp.task('f-build:scss', () => {
			var processors = [
				$.autoprefixer({
					cascade: false
				})
			]
			return gulp
				.src(pathvars.paths.styles.src)
				.pipe($.sourcemaps.init())
				.pipe(
					$.sass({
						outputStyle: 'compressed'
					})
				)
				.pipe($.postcss(processors))
				.pipe($.sourcemaps.write('./'))
				.pipe(gulp.dest(pathvars.paths.styles.dist))
		})

		// inline critical static css
		gulp.task('f-build:scss-inline', () => {
			return gulp
				.src(pathvars.paths.viewsStatic.dist + '*.html')
				.pipe($.inlineSource())
				.pipe(gulp.dest(pathvars.paths.viewsStatic.dist))
		})

		// all styles tasks
		gulp.task('f-build:styles', callback => {
			$.runSequence(
				'f-build:scss',
				// 'f-build:scss-inline',
			callback)
		})

		// ---------------------------------------------------------------------
		// | tools                                                             |
		// ---------------------------------------------------------------------

		// clean delete
		gulp.task('f-build:clean', () => {
			return Promise.all([
				$.del(pathvars.basePaths.dist + 'assets/**/*'),
				$.del(pathvars.paths.viewsStatic.dist + '**/*'),
				$.del(pathvars.basePaths.dist + '*.{js,json}')
			]).then(() => {
				console.log('Files and folders deleted.')
			})
		})

		// ---------------------------------------------------------------------
		// | views                                                             |
		// ---------------------------------------------------------------------

		// static html & handlebars
		gulp.task('f-build:views-static', () => {
			var timestamp = new Date().toISOString()
			timestamp = timestamp.replace(/:|\./g, '-')
			return gulp
				.src(pathvars.paths.viewsStatic.src)
				.pipe($.dataJson())
				.pipe($.hb({bustCache: true})
					.data(require('../' + pathvars.paths.viewsStatic.srcFolder + 'data/components.config.js'))
					.data(require('../' + pathvars.paths.viewsStatic.srcFolder + 'data/data.config.js'))
					.data(require('../' + pathvars.paths.viewsStatic.srcFolder + 'data/route.config.js'))
					.helpers(require('handlebars-helpers'))
					.helpers(require('handlebars-layouts'))
					.helpers({
						partial: partial => {
							return partial
						},
						repeat: (n, block) => {
							var accum = ''
							for (var i = 0; i < n; ++i) {
								block.data.index = i
								block.data.first = i === 0
								block.data.last = i === n - 1
								accum += block.fn(this)
							}
							return accum
						}
					})
					.partials(pathvars.paths.viewsStatic.srcFolder + 'partials/**/*.hbs')
				)
				.pipe($.replace('!TIMESTAMP!', timestamp))
				.pipe(
					gulp.dest(pathvars.paths.viewsStatic.dist).on('end', () => {
						$.del(pathvars.paths.viewsStatic.dist + 'partials/')
					})
				)
		})

		// all views tasks
		gulp.task('f-build:views', callback => {
			$.runSequence('f-build:views-static', callback)
		})

	}

})()
