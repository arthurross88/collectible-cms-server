var gulp    = require('gulp');
var clean   = require('gulp-clean');
var webpack = require('gulp-webpack');

gulp.task('clean', function(cb) {
    return gulp.src('dist', {read: false})
        .pipe(clean());
});

gulp.task('build', ['clean'], function(cb) {
    return gulp.src('src/main.js')
        .pipe(webpack( require('./config/webpack.prod.js') ))
        .pipe(gulp.dest('dist/'));
});

gulp.task('default', ['clean', 'build']);
