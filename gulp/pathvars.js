// project paths
const basePaths = {
    base: './',
    dist: 'dist',
    src: 'src'
}

// file paths
const paths = {
    fonts: {
        dist: basePaths.dist + '/assets/fonts',
        src: basePaths.src + '/assets/fonts/**/*.*',
        srcFolder: basePaths.src + '/assets/fonts'
    },
    images: {
        dist: basePaths.dist + '/assets/images',
        src: basePaths.src + '/assets/images/**/*.*',
        srcFolder: basePaths.src + '/assets/images'
    },
    scripts: {
        dist: basePaths.dist + '/assets/scripts',
        src: basePaths.src + '/assets/scripts/**/*.{js,json}',
        srcFolder: basePaths.src + '/assets/scripts'
    },
    styles: {
        dist: basePaths.dist + '/assets/styles',
        src: [
            basePaths.src + '/assets/styles/*.scss',
            basePaths.src + '/assets/styles/components/*.scss'
        ],
        srcFolder: basePaths.src + '/assets/styles'
    },
    viewsStatic: {
        dist: basePaths.dist,
        src: basePaths.src + '/views/**/*.{hbs,json}',
        srcFolder: basePaths.src + '/views'
    }
}

// export paths
module.exports = {
    basePaths: basePaths,
    paths: paths
}
