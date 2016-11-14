var gulp  = require('gulp');
var clean = require('gulp-clean');
var exec  = require('child_process').exec;

var assetFiles = [
    './app/**/*.html',
    './app/**/*.css'
];

gulp.task('clean', function(){
    return gulp.src(['dist/aot/*'], {read:false})
               .pipe(clean());
});

gulp.task('ngc', ['clean'], function(cb) {
    return exec('.\\node_modules\\.bin\\ngc --p ./tsconfig.aot.json', function(err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    })
});

gulp.task('move', ['clean', 'ngc'], function() {
    return gulp.src(assetFiles, { base: './' })
               .pipe(gulp.dest('dist/aot'))
});

gulp.task('default', ['clean', 'ngc', 'move']);
