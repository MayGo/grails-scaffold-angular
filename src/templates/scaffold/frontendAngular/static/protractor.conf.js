'use strict';

// An example configuration file.
exports.config = {
  // The address of a running selenium server.
  //seleniumAddress: 'http://localhost:4444/wd/hub',
  //seleniumServerJar: deprecated, this should be set on node_modules/protractor/config.json
  //allScriptsTimeout: 110000,

  //getPageTimeout: 10000,
  // Capabilities to be passed to the webdriver instance.
  capabilities: {
    browserName: 'chrome',
    shardTestFiles: true,
    maxInstances: 3
  },

  baseUrl: 'http://localhost:3100',

  framework: 'jasmine2',

  // Spec patterns are relative to the current working directly when
  // protractor is called.
  specs: ['e2e/**/*.js'],

  // Options to be passed to Jasmine-node.
  jasmineNodeOpts: {
    // If true, print colors to the terminal.
    showColors: true,
    // Default time to wait in ms before a test fails.
    //defaultTimeoutInterval: 300000
  },

  onPrepare: function () {
    browser.manage().window().setSize(1600, 1000);

    // Disable animations so e2e tests run more quickly
    var disableNgAnimate = function () {
      angular.module('disableNgAnimate', []).run(function ($animate) {
        $animate.enabled(false);
      });
    };

    browser.addMockModule('disableNgAnimate', disableNgAnimate);

    var disableCssAnimate = function () {
      angular.module('disableCssAnimate', []).run(function () {
        var style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = '* {' +
          '-webkit-transition: none !important;' +
          '-moz-transition: none !important;' +
          '-o-transition: none !important;' +
          '-ms-transition: none !important;' +
          'transition: none !important;' +
          '}';
        document.getElementsByTagName('head')[0].appendChild(style);
      });
    };

    browser.addMockModule('disableCssAnimate', disableCssAnimate);

    // Store the name of the browser that's currently being used.
    browser.getCapabilities().then(function (caps) {
      browser.params.browser = caps.get('browserName');
    });


    var path = require('path');
    var jasmineReporters = require('jasmine-reporters');

    var HtmlScreenshotReporter = require('protractor-jasmine2-screenshot-reporter');

    var timestamp = new Date().getTime()


    var TestsReporter = require('jasmine2-reporter').Jasmine2Reporter;
    var options = {
      symbols: {
        failed: '- '.strikethrough,
        passed: '+ '.strikethrough,
        pending: '~ '.strikethrough,
        suite: '» '.strikethrough
      }
    };
    jasmine.getEnv().addReporter(new TestsReporter(options));

    return browser.getProcessedConfig().then(function (config) {
      // index.html nimetame ümber spec-i nimeks, et saaks shardida.
      var specName = config.specs[0].match(/[\w.]*.spec.js$/gm)[0];
      jasmine.getEnv().addReporter(new HtmlScreenshotReporter({
        dest: './test-results/e2e',
        filename: specName + '.html',
        pathBuilder: function (currentSpec, suites, browserCapabilities) {
          // will return chrome/your-spec-name.png
          var p = currentSpec.fullName;
          p = p.replace(/ /g, '-');
          p = p.replace(/:/g, '/');
          p = p.replace(/,/g, '/');
          return '/' + p;
        }
      }));

      // you could use other properties here if you want, such as platform and version
      var browserName = config.capabilities.browserName;

      var junitReporter = new jasmineReporters.JUnitXmlReporter({
        consolidateAll: false,
        savePath: './test-results/JUnitXML/',
        filePrefix: 'xmloutput-'
      });
      jasmine.getEnv().addReporter(junitReporter);
    });
  }

};
