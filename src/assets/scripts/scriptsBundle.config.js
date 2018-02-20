// path variables
const pathvars = require('../../../gulp/pathvars.js');

module.exports = {
	bundle: {
		app: {
			scripts: [
				pathvars.paths.scripts.dist + 'vendor/material-kit.min.js',
				pathvars.paths.scripts.dist + 'client/components/test.js',
				pathvars.paths.scripts.dist + 'client/master.js'
			]
		}
	}
};
