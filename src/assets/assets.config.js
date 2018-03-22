// path variables
const pathvars = require('../../gulp/pathvars.js');

module.exports = {
	bundle: {
		master: {
			scripts: [
				pathvars.paths.scripts.dist + '/vendor/breaky.js',
				pathvars.paths.scripts.dist + '/vendor/fontfaceobserver.js',
				pathvars.paths.scripts.dist + '/vendor/lazyload-script.js',
				pathvars.paths.scripts.dist + '/vendor/material-kit.min.js',
				pathvars.paths.scripts.dist + '/client/master.js'
			]
		}
	}
};
