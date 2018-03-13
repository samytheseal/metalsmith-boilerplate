(function gulpfile() {


	// ---------------------------------------------------------------------
	// | config                                                            |
	// ---------------------------------------------------------------------

	// default dependencies
	const gulp = require('gulp');
	const $ = require('gulp-load-plugins') ({
		pattern: '*',
		scope: ['dependencies', 'devDependencies']
	});

	// subtasks
	$.loadSubtasks('./gulp/*.tasks.js', $);


	// ---------------------------------------------------------------------
	// | default tasks                                                     |
	// ---------------------------------------------------------------------

	// default
	gulp.task('default', (callback) => {
		process.env.NODE_ENV = 'production';
		console.log(
			'------------------------------------------------------------\n' +
			'|| Building app frontend for environment "'+ process.env.NODE_ENV +'"\n' +
			'------------------------------------------------------------'
		);
		$.runSequence(
			'f-build',
		callback);
	})


}());
