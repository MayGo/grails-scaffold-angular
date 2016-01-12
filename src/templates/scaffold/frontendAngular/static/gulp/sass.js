'use strict';

var path = require('path');
var gulp = require('gulp');
var sass = require('gulp-sass');
var conf = require('./conf');

gulp.task('sass', function () {
  gulp.src(path.join(conf.paths.src, '/assets/SCSS/**/*.scss'))
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(path.join(conf.paths.src, '/assets')));
});
