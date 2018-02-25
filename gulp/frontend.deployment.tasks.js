(function frontendDeployment() {

	// path variables
	const pathvars = require('./pathvars.js')

	// tasks function
	module.exports = function(gulp, $) {

		// ---------------------------------------------------------------------
		// | assets & general                                                  |
		// ---------------------------------------------------------------------

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

		// timestamp css file
		gulp.task('f-build:views-timestamp', () => {
			var timestamp = new Date().toISOString()
			timestamp = timestamp.replace(/:|\./g, '-')
			return gulp.src(
				pathvars.paths.viewsStatic.dist + '**/*.html'
			)
			.pipe($.replace('!TIMESTAMP!', timestamp))
			.pipe(gulp.dest(pathvars.paths.viewsStatic.dist))
		})

		// all styles tasks
		gulp.task('f-build:styles', callback => {
			$.runSequence(
				'f-build:scss',
				// 'f-build:scss-inline',
				'f-build:views-timestamp',
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
		gulp.task('f-build:views-static', () => {
			return $.metalsmith(__dirname)
			.metadata({
				site: {
					title: 'My site',
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
			})
		})

		// all views tasks
		gulp.task('f-build:views', callback => {
			$.runSequence(
				'f-build:views-static',
			callback)
		})

	}

})()
