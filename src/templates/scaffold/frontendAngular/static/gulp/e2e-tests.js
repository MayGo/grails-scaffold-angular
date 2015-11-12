'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');
var runSequence = require('run-sequence');

var browserSync = require('browser-sync');

var $ = require('gulp-load-plugins')();

// Downloads the selenium webdriver
gulp.task('webdriver-update', $.protractor.webdriver_update);

gulp.task('webdriver-standalone', $.protractor.webdriver_standalone);

function runProtractor(done) {
  var params = process.argv;
  var args = params.length > 3 ? [params[3], params[4]] : [];

  var specs = path.join(conf.paths.e2e, '/**/*.spec.js');
  if (params[5] === 'protractor:bamboo') {
    console.log("Running protractor:bamboo with url:", conf.paths.e2e_dev_url)
    args.push('--baseUrl');
    args.push(conf.paths.e2e_dev_url);
  } else if (args[0] == '--spec') {
    console.log("Running --spec:", args[1])
    specs = path.join(conf.paths.e2e, '/**/' + args[1]);
  }

  gulp.src([specs])
    .pipe($.protractor.protractor({
      configFile: 'protractor.conf.js',
      args: args
    }))
    .on('error', function (err) {
      // Make sure failed tests cause gulp to exit non-zero
      throw err;
    })
    .on('end', function () {
      // Close browser sync server
      browserSync.exit();
      done();
    });
}
function runBambooProtractor() {
  var params = process.argv;
  var args = params.length > 3 ? [params[3], params[4]] : [];

  var specs = path.join(conf.paths.e2e, '/**/*.spec.js');

  console.log("Running protractor:bamboo with url:", conf.paths.e2e_dev_url)
  args.push('--baseUrl');
  args.push(conf.paths.e2e_dev_url);


  gulp.src([specs])
    .pipe($.protractor.protractor({
      configFile: 'protractor.conf.js',
      args: args
    }))
    .on('error', function (err) {
      // Make sure failed tests cause gulp to exit non-zero
      throw err;
    });
}

gulp.task('protractor:bamboo', ['bower', 'webdriver-update'], runBambooProtractor);
gulp.task('protractor', ['protractor:dist']);
gulp.task('protractor:src', ['serve:e2e', 'webdriver-update'], runProtractor);
gulp.task('protractor:dist', ['serve:e2e-dist', 'webdriver-update'], runProtractor);
