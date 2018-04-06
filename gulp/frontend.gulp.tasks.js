(function frontendGulp() {


    // path variables
    const pathvars = require('./pathvars.js');
    // set environment default value
    process.env.NODE_ENV = 'production';


    // tasks function
    module.exports = function (gulp, $) {


        // ---------------------------------------------------------------------
        // || assets & general
        // ---------------------------------------------------------------------

        // fonts
        gulp.task('f-assets:fonts', () => {
            return gulp.src(
                pathvars.paths.fonts.src
            )
                .pipe(gulp.dest(pathvars.paths.fonts.dist));
        });

        // svg icons
        gulp.task('f-assets:icons-svg', () => {
            return gulp.src(
                pathvars.paths.images.srcFolder + '/icons/svg/**/*.svg'
            )
                .pipe($.svgSprites({
                    baseSize: 16,
                    common: 'svg-icon',
                    cssFile: 'assets/styles/svg-icons.css',
                    preview: {
                        sprite: 'svg-icons.html'
                    },
                    selector: 'svg-icon--%f',
                    svg: {
                        sprite: 'assets/images/icons/svg/svg-icons.svg'
                    }
                }))
                .pipe(gulp.dest(pathvars.basePaths.dist));
        });

        // images
        gulp.task('f-assets:images', () => {
            return gulp.src([
                pathvars.paths.images.srcFolder + '/**/*.*',
                '!' + pathvars.paths.images.srcFolder + '/icons/svg/**/*.svg'
            ])
                // .pipe($.imagemin(
                // 	[
                // 		$.imagemin.gifsicle({ interlaced: true }),
                // 		$.imagemin.jpegtran({ progressive: true }),
                // 		$.imagemin.optipng({ optimizationLevel: '3' }),
                // 		$.imagemin.svgo()
                // 	],
                // 	{ verbose: true }
                // ))
                .pipe(gulp.dest(pathvars.paths.images.dist));
        });

        // progressive web app service worker
        gulp.task('f-assets:service-worker', function (callback) {
            $.swPrecache.write(
                pathvars.basePaths.dist + '/service-worker.js',
                {
                    staticFileGlobs: [
                        pathvars.basePaths.dist + '/assets/scripts/jsBundle-*.js',
                        pathvars.basePaths.dist + '/assets/scripts/client/components/*.js',
                        pathvars.basePaths.dist + '/assets/styles/master.css',
                        pathvars.basePaths.dist + '/assets/styles/*-component.css'
                    ],
                    stripPrefix: pathvars.basePaths.dist
                },
                callback
            )
        });
        // progressive web app copy
        gulp.task('f-assets:pwa', () => {
            return gulp.src(
                pathvars.basePaths.src + '/*.{txt,json}'
            )
                .pipe(gulp.dest(pathvars.basePaths.dist));
        });

        // all assets tasks
        gulp.task('f-assets', (callback) => {
            $.runSequence(
                'f-assets:fonts',
                'f-assets:icons-svg',
                'f-assets:images',
                'f-assets:service-worker',
                'f-assets:pwa',
                callback);
        });


        // ---------------------------------------------------------------------
        // || scripts
        // ---------------------------------------------------------------------

        // js lint
        gulp.task('f-scripts:lint', () => {
            return gulp.src(
                pathvars.paths.scripts.srcFolder + '/switch/**/*.js'
            )
                .pipe($.eslint())
                .pipe($.eslint.format())
                .pipe($.eslint.failAfterError())
                .on('error', $.notify.onError('JS Error: <%= error.message %>.\nCheck your console.'));
        });

        // js
        gulp.task('f-scripts:js', () => {
            return gulp.src([
                pathvars.paths.scripts.srcFolder + '/**/*.js',
                '!' + pathvars.paths.scripts.srcFolder + '/assets.config.js'
            ])
                .pipe($.if(process.env.NODE_ENV === 'development',
                    $.cached('js')
                ))
                .pipe($.sourcemaps.init())
                .pipe($.sourcemaps.write('./'))
                .pipe(gulp.dest(pathvars.paths.scripts.dist));
        });

        // optimise js
        gulp.task('f-scripts:optimise', () => {
            return gulp.src(
                pathvars.paths.scripts.dist + '/client/**/*.js'
            )
                .pipe($.optimizeJs())
                .pipe(gulp.dest(pathvars.paths.scripts.dist + '/client'));
        });

        // js bundles
        gulp.task('f-scripts:bundle', () => {
            return gulp.src(
                pathvars.paths.scripts.srcFolder + '/assets.config.js'
            )
                .pipe($.bundleAssets())
                .pipe($.bundleAssets.results({
                    dest: pathvars.paths.viewsStatic.srcFolder + '/data',
                    fileName: 'assets.config',
                    pathPrefix: '/assets/scripts/'
                }))
                .pipe(gulp.dest(pathvars.paths.scripts.dist)
                    .on('end', () => {
                        if (process.env.NODE_ENV === 'production') {
                            $.del([
                                pathvars.paths.scripts.dist + '/client/*.*',
                                '!' + pathvars.paths.scripts.dist + '/client/components'
                            ]);
                            $.del(pathvars.paths.scripts.dist + '/vendor');
                        }
                    })
                );
        });

        // all js tasks
        gulp.task('f-scripts', (callback) => {
            if (process.env.NODE_ENV === 'development') {
                $.runSequence(
                    'f-scripts:lint',
                    'f-scripts:js',
                    'f-scripts:optimise',
                    'f-scripts:bundle',
                    callback);
            }
            if (process.env.NODE_ENV === 'production') {
                $.runSequence(
                    'f-scripts:js',
                    'f-scripts:optimise',
                    'f-scripts:bundle',
                    callback);
            }
        });


        // ---------------------------------------------------------------------
        // || styles
        // ---------------------------------------------------------------------

        // scss lint
        gulp.task('f-styles:lint', () => {
            var styleLint = require('gulp-stylelint');
            return gulp.src([
                pathvars.paths.styles.srcFolder + '/**/_*.scss',
                '!' + pathvars.paths.styles.srcFolder + '/vendor/**/*'
            ])
                .pipe(styleLint({
                    configFile: '.stylelintrc',
                    failAfterError: false,
                    reporters: [{
                        formatter: 'string',
                        console: true
                    }]
                })
                    .on('error', $.notify.onError('SCSS Error: <%= error.message %>.\nCheck your console.')));
        });

        // scss
        gulp.task('f-styles:scss', () => {
            var processors = [
                $.autoprefixer({
                    cascade: false
                })
            ];
            return gulp.src(
                pathvars.paths.styles.src
            )
                .pipe($.sourcemaps.init())
                .pipe($.if(process.env.NODE_ENV === 'development',
                    $.sass({ outputStyle: 'expanded' })
                ))
                .pipe($.if(process.env.NODE_ENV === 'production',
                    $.sass({ outputStyle: 'compressed' })
                ))
                .pipe($.postcss(processors))
                .pipe($.sourcemaps.write('./'))
                .pipe(gulp.dest(pathvars.paths.styles.dist));
        });

        // inline critical css
        gulp.task('f-styles:inline', () => {
            return gulp.src(
                pathvars.basePaths.dist + '/**/*.html'
            )
                .pipe($.inlineSource())
                .pipe(gulp.dest(pathvars.basePaths.dist));
        });

        // all styles tasks
        gulp.task('f-styles', (callback) => {
            if (process.env.NODE_ENV === 'development') {
                $.runSequence(
                    'f-styles:lint',
                    'f-styles:scss',
                    callback);
            }
            if (process.env.NODE_ENV === 'production') {
                $.runSequence(
                    'f-styles:scss',
                    'f-styles:inline',
                    callback);
            }
        });


        // ---------------------------------------------------------------------
        // || views
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

        //var test = require('../src/views/data/test.json');

        // static
        gulp.task('f-views:static', () => {
            $.decache('../' + pathvars.paths.viewsStatic.srcFolder + '/data/assets.config.json');
            $.decache('../' + pathvars.paths.viewsStatic.srcFolder + '/data/components.config.json');
            $.decache('../' + pathvars.paths.viewsStatic.srcFolder + '/data/data.config.json');
            $.metalsmith(__dirname)
                .metadata({
                    assets: require('../' + pathvars.paths.viewsStatic.srcFolder + '/data/assets.config.json'),
                    component: require('../' + pathvars.paths.viewsStatic.srcFolder + '/data/components.config.json'),
                    data: require('../' + pathvars.paths.viewsStatic.srcFolder + '/data/data.config.json'),
                    faker: require('faker')
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
                .use($.metalsmithHtmlMinifier({
                    minifierOptions: {
                        collapseWhitespace: true
                    }
                }))
                .use($.metalsmithSitemap({
                    hostname: "https://www.test.com"
                }))
                .build(function (err) {
                    if (err) throw err;
                });
        });

        // all views tasks
        gulp.task('f-views', (callback) => {
            $.runSequence(
                'f-views:static',
                callback);
        });


        // ---------------------------------------------------------------------
        // || tools & config
        // ---------------------------------------------------------------------

        // ascii
        gulp.task('f-ascii', () => {
            return gulp.src(
                './gulp/frontend.ascii.txt'
            )
                .pipe($.cat());
        });

        // build frontend for prod
        gulp.task('f-build', ['f-clean'], (done) => {
            $.runSequence(
                'f-scripts',
                'f-styles',
                'f-views',
                'f-assets',
                done);
        });

        // clean delete
        gulp.task('f-clean', () => {
            return Promise.all([
                $.del(pathvars.basePaths.dist + '/assets/**/*'),
                $.del(pathvars.paths.viewsStatic.dist + '/**/*'),
                $.del(pathvars.basePaths.dist + '/{manifest,service-worker}.{js,json}')
            ]).then(() => {
                console.log('Files and folders deleted.');
            });
        });

        // clear caches
        gulp.task('f-cache', () => {
            $.cached.caches = {};
        });

        // menu
        gulp.task('f', (done) => {
            $.inquirer.prompt([{
                type: 'list',
                message: 'Pick a frontend task!',
                name: 'start',
                choices: [
                    'Frontend Dev work.',
                    'Build frontend for deployment.'
                ]
            }]).then((answers) => {
                if (answers.start === 'Frontend Dev work.') {
                    process.env.NODE_ENV = 'development';
                    console.log(
                        '------------------------------------------------------------\n' +
                        '|| Building app frontend for environment "' + process.env.NODE_ENV + '"\n' +
                        '------------------------------------------------------------'
                    );
                    $.runSequence(
                        'f-cache',
                        'f-build',
                        'f-serve',
                        'f-ascii'
                    );
                }
                if (answers.start === 'Build frontend for deployment.') {
                    process.env.NODE_ENV = 'production';
                    console.log(
                        '------------------------------------------------------------\n' +
                        '|| Building app frontend for environment "' + process.env.NODE_ENV + '"\n' +
                        '------------------------------------------------------------'
                    );
                    $.runSequence(
                        'f-build'
                    );
                }
                done();
            });
        });

        // serve
        gulp.task('f-serve', () => {
            // browsersync
            $.browserSync.init({
                reloadDebounce: 2000,
                reloadDelay: 1500,
                reloadOnRestart: false,
                server: 'dist',
                startPath: '/index.html'
            });
            // watch
            gulp.watch(pathvars.paths.scripts.src, ['f-scripts']).on('change', $.browserSync.reload);
            gulp.watch(pathvars.paths.styles.srcFolder + '/**/*', ['f-styles']).on('change', $.browserSync.reload);
            gulp.watch(pathvars.paths.viewsStatic.srcFolder + '/**/*', ['f-views']).on('change', $.browserSync.reload);
        });


    };


}());
