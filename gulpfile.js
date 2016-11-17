var gulp    = require('gulp');
var clean   = require('gulp-clean');
var exec    = require('child_process').exec;
var server  = require('gulp-express');

gulp.task('clean', function(cb) {
    return gulp.src('apidoc/v1', {read: false})
        .pipe(clean());
});

gulp.task('apidoc-install', ['clean'], function(cb) {
    exec('"node_modules/.bin/apidoc" -i server/ -o apidoc/v1/ -t templates/apidoc', function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        // Why?....
        setTimeout(function() {
            cb(err);
        }, 1000);
    });
});

gulp.task('apidoc-update', ['apidoc-install'], function(cb) {
    exec('"node_modules/.bin/apidoc" -i server/ -o apidoc/v1/', function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    });
});

gulp.task('build', ['apidoc-update'], function(cb) {
    cb();
});

gulp.task('start', ['build'], function(cb) {
    server.run(['server.js']);
    cb();
});

gulp.task('stop', function(cb) {
    server.stop();
    cb();
})

gulp.task('default', ['build']);
