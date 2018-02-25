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

	// build frontend
	gulp.task('f-build', ['f-build:clean'], (done) => {
		$.runSequence(
			'f-build:views',
			'f-build:scripts',
			'f-build:styles',
			'f-build:assets',
		done);
	});

	// default
	gulp.task('default', ['f-build']);


}());
