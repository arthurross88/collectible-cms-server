var gulp  = require('gulp');
var clean = require('gulp-clean');
var exec  = require('child_process').exec;

gulp.task('clean', function(){
    return exec('rimraf dist', function(err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    });
});

gulp.task('build', ['clean'], function(cb) {
    return exec('webpack --config config/webpack.prod.js --progress --profile --bail', function(err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    });
});

gulp.task('default', ['clean', 'build']);
