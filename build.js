const pathvars = require('./gulp/pathvars.js')

const metalsmith = require('metalsmith');
const drafts = require('metalsmith-drafts');
const markdown = require('metalsmith-markdown');
const collections = require('metalsmith-collections');
const permalinks = require('metalsmith-permalinks');
const layouts = require('metalsmith-layouts');
const sitemap = require('metalsmith-sitemap');
const Handlebars = require('handlebars');
const moment = require('moment');
const gulpsmith = require('gulpsmith');
const hb = require('gulp-hb');

Handlebars.registerHelper('is', function (value, test, options) {
    if (value === test) {
        return options.fn(this);
    } else {
        return options.inverse(this);
    }
});

Handlebars.registerHelper('date', function (date) {
    return moment(date, "MM-DD-YYYY").format('Do MMM \'YY');
});

metalsmith(__dirname)
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
    .source('./src/content')
    .destination('./dist')
    .clean(true)
    .use(drafts())
    .use(collections({
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
    .use(markdown())
    .use(permalinks())
    .use(layouts({
        engine: 'handlebars',
        directory: 'src/views',
        default: 'default.hbs',
        partials: 'src/views/partials'
    }))
    .use(sitemap({
        hostname: "https://www.test.com"
    }))
    .use(gulpsmith()
        var timestamp = new Date().toISOString()
        timestamp = timestamp.replace(/:|\./g, '-')
        return gulp
            .src(pathvars.paths.viewsStatic.src)
            // .pipe($.dataJson())
            .pipe(hb()
                .data(require('./' + pathvars.paths.viewsStatic.srcFolder + 'data/components.config.js'))
                .data(require('./' + pathvars.paths.viewsStatic.srcFolder + 'data/data.config.js'))
                .data(require('./' + pathvars.paths.viewsStatic.srcFolder + 'data/route.config.js'))
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
                .partials('./' + pathvars.paths.viewsStatic.srcFolder + 'partials/**/*.hbs')
            )
            .pipe($.replace('!TIMESTAMP!', timestamp))
            .pipe(
                gulp.dest(pathvars.paths.viewsStatic.dist).on('end', () => {
                    $.del(pathvars.paths.viewsStatic.dist + 'partials/')
                })
            )
        )
    )
    .build(function (err) {
        if (err) throw err;
    });
