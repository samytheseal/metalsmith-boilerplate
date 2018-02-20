(function frontendDev() {
	// path variables
	const pathvars = require('./pathvars.js')

	// tasks function
	module.exports = function(gulp, $) {
		// ---------------------------------------------------------------------
		// | scripts                                                           |
		// ---------------------------------------------------------------------

		// js lint
		gulp.task('f-js:lint', () => {
			return gulp
				.src(pathvars.paths.scripts.srcFolder + 'client/**/*.js')
				.pipe($.eslint())
				.pipe($.eslint.format())
				.pipe($.eslint.failAfterError())
				.on(
					'error',
					$.notify.onError(
						'JS Error: <%= error.message %>.\nCheck your console.'
					)
				)
		})

		// js
		gulp.task('f-js:build', () => {
			return gulp
				.src([
					pathvars.paths.scripts.srcFolder + '**/*.{js,json}',
					'!' +
						pathvars.paths.scripts.srcFolder +
						'scriptsBundle.config.js'
				])
				.pipe($.cached('js'))
				.pipe($.sourcemaps.init())
				.pipe($.sourcemaps.write('./'))
				.pipe(gulp.dest(pathvars.paths.scripts.dist))
		})

		// js bundles
		gulp.task('f-js:bundles', () => {
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
				.pipe(gulp.dest(pathvars.paths.scripts.dist))
		})

		// all js tasks
		gulp.task('f-scripts', callback => {
			$.runSequence('f-js:lint', 'f-js:build', 'f-js:bundles', callback)
		})

		// ---------------------------------------------------------------------
		// | styles                                                            |
		// ---------------------------------------------------------------------

		// scss lint
		gulp.task('f-scss:lint', () => {
			return gulp
				.src([
					pathvars.paths.styles.srcFolder + '**/_*.scss',
					'!' + pathvars.paths.styles.srcFolder + 'vendor/**/*'
				])
				.pipe(
					$.stylelint({
						configFile: '.stylelintrc',
						failAfterError: false,
						reporters: [
							{
								formatter: 'string',
								console: true
							}
						]
					}).on(
						'error',
						$.notify.onError(
							'SCSS Error: <%= error.message %>.\nCheck your console.'
						)
					)
				)
		})

		// scss
		gulp.task('f-scss:build', () => {
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
						outputStyle: 'expanded'
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
		gulp.task('f-styles', callback => {
			$.runSequence(
				'f-scss:lint',
				'f-scss:build',
				// 'f-build:scss-inline',
				callback
			)
		})

		// ---------------------------------------------------------------------
		// | tools                                                             |
		// ---------------------------------------------------------------------

		// ascii
		gulp.task('f-ascii', () => {
			return gulp.src('./gulp/frontend.ascii.txt').pipe($.cat())
		})

		// clear caches
		gulp.task('f-cache', () => {
			$.cached.caches = {}
		})

		// menu
		gulp.task('f', done => {
			$.inquirer
				.prompt([
					{
						type: 'list',
						message: 'Pick a frontend task!',
						name: 'start',
						choices: [
							'Build frontend for deployment.',
							'Frontend Dev work.'
						]
					}
				])
				.then(answers => {
					if (answers.start === 'Build frontend for deployment.') {
						$.runSequence('f-build')
					}
					if (answers.start === 'Frontend Dev work.') {
						$.runSequence(
							'f-cache',
							'f-build',
							'f-serve',
							'f-ascii'
						)
					}
					done()
				})
		})

		// serve
		gulp.task('f-serve', () => {
			// browsersync
			$.browserSync.init({
				reloadDebounce: 2000,
				reloadDelay: 1000,
				reloadOnRestart: false,
				server: 'dist/website',
				startPath: '/app.html'
			})
			// watch
			gulp
				.watch(pathvars.paths.scripts.src, ['f-scripts'])
				.on('change', $.browserSync.reload)
			gulp
				.watch(pathvars.paths.styles.src, ['f-styles'])
				.on('change', $.browserSync.reload)
			gulp
				.watch( pathvars.paths.viewsStatic.srcFolder + '**/*', ['f-views-static'])
				.on('change', $.browserSync.reload)
		})

		// ---------------------------------------------------------------------
		// | views                                                             |
		// ---------------------------------------------------------------------

		// all cshtml views tasks
		gulp.task('f-views-cshtml', callback => {
			$.runSequence('f-cshtml', callback)
		})

		// static html & handlebars
		gulp.task('f-handlebars', () => {
			$.decache('../' + pathvars.paths.viewsStatic.srcFolder + 'data/components.config.js');
			$.decache('../' + pathvars.paths.viewsStatic.srcFolder + 'data/data.config.js');
			$.decache('../' + pathvars.paths.viewsStatic.srcFolder + 'data/route.config.js');
			return gulp
				.src(pathvars.paths.viewsStatic.src)
				.pipe($.dataJson())
				.pipe($.hb()
						.data(require('../' + pathvars.paths.viewsStatic.srcFolder + 'data/components.config.js'))
						.data(require('../' + pathvars.paths.viewsStatic.srcFolder + 'data/data.config.js'))
						.data(require('../' + pathvars.paths.viewsStatic.srcFolder + 'data/route.config.js'))
						.helpers(require('handlebars-helpers'))
						.helpers(require('handlebars-layouts'))
						.helpers({ partial: partial => {
								return partial
							}, repeat: (n, block) => {
								var accum = ''
								for (var i = 0; i < n; ++i) {
									block.data.index = i
									block.data.first = i === 0
									block.data.last = i === n - 1
									accum += block.fn(this)
								}
								return accum
							} })
						.partials(pathvars.paths.viewsStatic.srcFolder + 'partials/**/*.hbs'))
				.pipe($.cached('handlebars'))
				.pipe(gulp.dest(pathvars.paths.viewsStatic.dist)
					.on('end', () => {
					$.del(
						pathvars.paths.viewsStatic.dist +
							'partials/'
					)
				}))
		})

		// all static views tasks
		gulp.task('f-views-static', callback => {
			$.runSequence('f-handlebars', callback)
		})
	}
})()
