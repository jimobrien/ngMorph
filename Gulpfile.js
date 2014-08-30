var gulp    = require('gulp'),
    concat  = require('gulp-concat'),
    uglify  = require('gulp-uglify'),
    notify  = require('gulp-notify');

var paths = {
  scripts: [
    'src/transitions/transitions.js',
    'src/transitions/modal.js',
    'src/transitions/expand.js',
    'src/transitions/overlay.js',
    'src/directives/directives.js',
    'src/directives/modal.js',
    'src/morphAssist.js',
    'src/morph.js',
    'src/app.js'
  ],
  dist: './dist/'
};


gulp.task('concat', function(){
  return gulp.src(paths.scripts)
    .pipe( concat('angular-morph.js'))
    .pipe( gulp.dest(paths.dist));
});


gulp.task('uglify',function(){
  return gulp.src(paths.dist + 'angular-morph.min.js')
   .pipe( uglify())
   .pipe( gulp.dest(paths.dist))
   .pipe( notify({message: 'Build Done'}));
});

gulp.task('build', ['concat','uglify']);

gulp.task('watch', function(){
  gulp.watch(paths.source, ['build']);
});

gulp.task('default', ['build','watch']);