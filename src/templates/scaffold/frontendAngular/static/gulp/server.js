'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');

var connect = require('gulp-connect');

var createServer = function(path){
  connect.server({
    root: path,
    port: conf.paths.port,
    livereload: true
  });
}

gulp.task('serve', ['watch'], function () {
  createServer([path.join(conf.paths.tmp, '/serve'), conf.paths.src, './']);
});

gulp.task('serve:dist', ['build'], function () {
  createServer(conf.paths.dist);
});
