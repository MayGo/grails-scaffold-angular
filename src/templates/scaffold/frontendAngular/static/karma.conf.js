'use strict';

var path = require('path');
var conf = require('./gulp/conf');


var _ = require('lodash');
var wiredep = require('wiredep');

function listFiles() {
  var wiredepOptions = _.extend({}, conf.wiredep, {
    dependencies: true,
    devDependencies: true
  });

  return wiredep(wiredepOptions).js
    .concat([
      path.join(conf.paths.src, '/app/**/!(*.spec).js'),
      path.join(conf.paths.src, '/app/**/*.spec.js'),
      path.join(conf.paths.src, '/**/*.mock.js'),
      path.join(conf.paths.src, '/**/*.html')
    ]);
}

module.exports = function (config) {

  var configuration = {
    reporters: ['progress', 'coverage', 'notify'],

    notifyReporter: {
      reportEachFailure: false, // Default: false, Will notify on every failed sepc
      reportSuccess: true, // Default: true, Will notify when a suite was successful
    },

    files: listFiles(),

    singleRun: true,

    autoWatch: false,

    frameworks: ['jasmine', 'angular-filesort'],

    angularFilesort: {
      whitelist: [path.join(conf.paths.src, '/**/!(*.html|*.spec|*.mock).js')]
    },

    ngHtml2JsPreprocessor: {
      stripPrefix: 'client/',
      moduleName: 'angularDemoApp.templates'
    },



    browsers: ['PhantomJS'],

    plugins: [
      'karma-phantomjs-launcher',
      'karma-angular-filesort',
      'karma-jasmine',
      'karma-ng-html2js-preprocessor',
      'karma-coverage',
      'karma-notify-reporter'
    ],

    preprocessors: {
      'client/app/**/*.html': ['ng-html2js'],
      'client/**/!(*.html|*.spec|*.mock).js': ['coverage']
    }
  };

  // This block is needed to execute Chrome on Travis
  // If you ever plan to use Chrome and Travis, you can keep it
  // If not, you can safely remove it
  // https://github.com/karma-runner/karma/issues/1144#issuecomment-53633076
  if (configuration.browsers[0] === 'Chrome' && process.env.TRAVIS) {
    configuration.customLaunchers = {
      'chrome-travis-ci': {
        base: 'Chrome',
        flags: ['--no-sandbox']
      }
    };
    configuration.browsers = ['chrome-travis-ci'];
  }

  config.set(configuration);
};
