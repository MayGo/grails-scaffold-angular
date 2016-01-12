'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');
var connect = require('gulp-connect');

function isOnlyChange(event) {
  return event.type === 'changed';
}

gulp.task('watch', ['inject'], function () {

  gulp.watch([path.join(conf.paths.src, '/*.html'), 'bower.json'], ['inject']);

  gulp.watch(path.join(conf.paths.src, '/app/**/*.css'), function(event) {
    if(isOnlyChange(event)) {

    } else {
      gulp.start('inject');
    }
  });

  gulp.watch(path.join(conf.paths.src, '/assets/SCSS/**/*.scss'), function(event) {
    if(isOnlyChange(event)) {
      gulp.start('sass');
    }
  });



  gulp.watch(path.join(conf.paths.src, '/app/**/*.js'), function(event) {
    if(isOnlyChange(event)) {
      gulp.start('scripts');
    } else {
      gulp.start('inject');
    }
  });

  gulp.watch(path.join(conf.paths.src, '/**/*'), function(event) {
    gulp.src(event.path).pipe(connect.reload())
  });
});
