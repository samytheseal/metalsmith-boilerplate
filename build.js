const pathvars = require('./gulp/pathvars.js')

const metalsmith = require('metalsmith');
const drafts = require('metalsmith-drafts');
const markdown = require('metalsmith-markdown');
const collections = require('metalsmith-collections');
const permalinks = require('metalsmith-permalinks');
const layouts = require('metalsmith-layouts');
const sitemap = require('metalsmith-sitemap');
const handlebars = require('handlebars');
const moment = require('moment');
const hbHelpers = require('handlebars-helpers');
const hbLayouts = require('handlebars-layouts');

handlebars.registerHelper(hbHelpers(handlebars));
handlebars.registerHelper(hbLayouts(handlebars));

handlebars.registerHelper('is', function (value, test, options) {
    if (value === test) {
        return options.fn(this);
    } else {
        return options.inverse(this);
    }
});
handlebars.registerHelper('date', function (date) {
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
        default: 'app-default.hbs',
        partials: 'src/views/partials'
    }))
    .use(sitemap({
        hostname: "https://www.test.com"
    }))
    .build(function (err) {
        if (err) throw err;
    });
