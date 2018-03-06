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

		// all styles tasks
		gulp.task('f-styles', callback => {
			$.runSequence(
				'f-scss:lint',
				'f-scss:build',
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
						process.env.NODE_ENV = 'production';
						$.runSequence('f-build')
					}
					if (answers.start === 'Frontend Dev work.') {
						process.env.NODE_ENV = 'development';
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
				server: 'dist',
				startPath: '/index.html'
			})
			// watch
			gulp
				.watch(pathvars.paths.scripts.src, ['f-scripts'])
				.on('change', $.browserSync.reload)
			gulp
				.watch(pathvars.paths.styles.src, ['f-styles'])
				.on('change', $.browserSync.reload)
			gulp
				.watch(pathvars.paths.viewsStatic.srcFolder + '**/*', ['f-views-static'])
				.on('change', $.browserSync.reload)
		})


		// ---------------------------------------------------------------------
		// | views                                                             |
		// ---------------------------------------------------------------------

		// handlebars helpers
		$.handlebars.registerHelper($.handlebarsHelpers($.handlebars));
		$.handlebars.registerHelper($.handlebarsLayouts($.handlebars));
		
		$.handlebars.registerHelper('is', function (value, test, options) {
			if (value === test) {
				return options.fn(this);
			} else {
				return options.inverse(this);
			}
		});
		$.handlebars.registerHelper('date', function (date) {
			return $.moment(date, "MM-DD-YYYY").format('Do MMM \'YY');
		});

		// metalsmith handlebars
		gulp.task('f-metalsmith', () => {
			$.metalsmith(__dirname)
			.metadata({
				site: {
					name: 'My site',
					description: "My super sweet Metalsmith site on Netlify.",
					generatorname: "Metalsmith",
					generatorurl: "http://metalsmith.io/",
					generatortitle: "Check out Metalsmith!",
					hostname: "Netlify",
					hosturl: "https://netlify.com/",
					hosttitle: "Learn more about Netlify"
				}
			})
			.source('../src/content')
			.destination('../dist')
			.clean(false)
			.use($.metalsmithDrafts())
			.use($.metalsmithCollections({
				posts: {
					pattern: 'posts/*.md',
					sortBy: 'date',
					reverse: true
				},
				pages: {
					pattern: '*.md',
					sortBy: 'menu-order'
				}
			}))
			.use($.metalsmithMarkdown())
			.use($.metalsmithPermalinks())
			.use($.metalsmithLayouts({
				engine: 'handlebars',
				directory: '../src/views',
				default: 'app-default.hbs',
				partials: '../src/views/partials'
			}))
			.use($.metalsmithSitemap({
				hostname: "https://www.test.com"
			}))
			.build(function (err) {
				if (err) throw err;
			});
		})

		// all static views tasks
		gulp.task('f-views-static', callback => {
			$.runSequence('f-metalsmith', callback)
		})
	}
})()
