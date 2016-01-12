'use strict';

var path = require('path');
var gulp = require('gulp');
var gutil = require('gulp-util');
var conf = require('./conf');
var clean = require('gulp-clean');

var $ = require('gulp-load-plugins')();

var mkdirp = require('mkdirp');

var argv = require('yargs').argv;

var failIfJshintErrors = (argv.failIfJshintErrors) ? true : false;

console.log("Do we fail if JsHint errors:", failIfJshintErrors);

gulp.task('scripts', function () {
  var jsFilter = $.filter('**/*.js');
  mkdirp(conf.paths.results, function (err) {
    // path was created unless there was error
  });

  gulp.src(path.join(conf.paths.results, '/jshint-output.html'))
    .pipe(clean({force: false}));

  return gulp.src(path.join(conf.paths.src, '/app/**/*.js'))
    .pipe(jsFilter)
   /* .pipe($.jshint('.jshintrc'))
    .pipe($.jshint.reporter('jshint-stylish'))
    .pipe($.jshint.reporter('gulp-jshint-html-reporter', {
      filename: path.join(conf.paths.results, '/jshint-output.html'),
      createMissingFolders: true
    }))
    .pipe(jsFilter.restore())
    .pipe($.jscsWithReporter('.jscsrc'))
    .pipe($.jscsWithReporter.reporter('console'))
    .pipe($.jscsWithReporter.reporter($.jscsHtmlReporter, {
      filename: path.join(conf.paths.results + '/jscs-output.html')
    }))
    .pipe(failIfJshintErrors ? $.jscsWithReporter.reporter('fail') : gutil.noop())
    .pipe(failIfJshintErrors ? $.jshint.reporter('fail') : gutil.noop())
    */
    .pipe($.size())
});
