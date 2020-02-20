'use strict'
var gulp = require('gulp');
var del = require('del');
var ts = require('gulp-typescript')
var sourcemaps = require('gulp-sourcemaps');

gulp.task('clean', gulp.series(function () {
    var out = 'dist';
    return del([out + '/*']);
}))

var compileTS = function () {
    var tsProj = ts.createProject('tsconfig.json');
    return gulp.src('src/**/*.ts')
        .pipe(sourcemaps.init())
        .pipe(tsProj())
        .pipe(sourcemaps.mapSources(function (sourcepath, file) {
            return sourcepath;
        }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('dist'))
}
gulp.task('compileTS', compileTS);

var watchTS = function () {
    gulp.watch('src/**/*.ts', gulp.series('compileTS'));
}

gulp.task('watchTS', watchTS);

var copyFiles = function () {
    var input = 'src/**';
    var file_exts = ['html', 'js', 'css', 'jpg', 'png', 'svg', 'eot', 'json'];
    var res = null;
    for (var i = 0; i < file_exts.length; i++) {
        input = input + '/*/*.' + file_exts[i];
        res = gulp.src(input)
            .pipe(gulp.dest('dist'));
    }

    var rest = gulp.src('./src/configuration/*', {
            base: "src"
        })
        .pipe(gulp.dest('dist'));
    return rest;
}

gulp.task('CopyFiles', copyFiles);

var watchFiles = function () {
    var input = 'src/'
    gulp.watch(input + '**/*.html', gulp.series('CopyFiles'));
    gulp.watch(input + '**/*.png', gulp.series('CopyFiles'));
    gulp.watch(input + '**/*.js', gulp.series('CopyFiles'));
    gulp.watch(input + '**/*.css', gulp.series('CopyFiles'));
    gulp.watch(input + '**/*.txt', gulp.series('CopyFiles'));
    return gulp.watch(input + '**/*.json', gulp.series('CopyFiles'));
}
gulp.task('WatchFiles', watchFiles);

gulp.task('Build', gulp.series('compileTS', 'CopyFiles'));
gulp.task('Watch', gulp.parallel('watchTS', 'WatchFiles'));

gulp.task('default', gulp.series('clean', 'Build', 'Watch'));