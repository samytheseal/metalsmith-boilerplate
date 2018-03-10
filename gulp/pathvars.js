// project paths
const basePaths = {
	src: 'src',
	dist: 'dist'
}

// file paths
const paths = {
	fonts: {
		srcFolder: basePaths.src + '/assets/fonts',
		src: basePaths.src + '/assets/fonts/**/*.*',
		dist: basePaths.dist + '/assets/fonts'
	},
	images: {
		srcFolder: basePaths.src + '/assets/images',
		src: basePaths.src + '/assets/images/**/*.*',
		dist: basePaths.dist + '/assets/images'
	},
	scripts: {
		srcFolder: basePaths.src + '/assets/scripts',
		src: basePaths.src + '/assets/scripts/**/*.{js,json}',
		dist: basePaths.dist + '/assets/scripts'
	},
	styles: {
		srcFolder: basePaths.src + '/assets/styles',
		src: basePaths.src + '/assets/styles/**/*.{css,scss}',
		dist: basePaths.dist + '/assets/styles'
	},
	viewsStatic: {
		srcFolder: basePaths.src + '/views',
		src: basePaths.src + '/views/**/*.{hbs,json}',
		dist: basePaths.dist
	}
}

// export paths
module.exports = {
	basePaths: basePaths,
	paths: paths
}
