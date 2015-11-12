'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');

var Server = require('karma').Server;

function runTests (singleRun, done) {
  new Server({
    configFile: path.join(__dirname, '/../karma.conf.js'),
    singleRun: singleRun,
    autoWatch: !singleRun
  }, function() {
    done();
  }).start();
}

gulp.task('test', ['scripts'], function(done) {
  runTests(true, done);
});

gulp.task('test:auto', ['watch'], function(done) {
  runTests(false, done);
});
