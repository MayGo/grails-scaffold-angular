// Protractor configuration
// https://github.com/angular/protractor/blob/master/referenceConf.js

'use strict';

var HtmlReporter = require('protractor-html-screenshot-reporter');


exports.config = {
  // The timeout for each script run on the browser. This should be longer
  // than the maximum time your application needs to stabilize between tasks.
  allScriptsTimeout: 110000,

  // A base URL for your application under test. Calls to protractor.get()
  // with relative paths will be prepended with this.
  baseUrl: 'http://localhost:' + (process.env.PORT || '9006'),
  // list of files / patterns to load in the browser
  specs: [
    'e2e/**/*.spec.js'
  ],

  // Patterns to exclude.
  exclude: [],

  // ----- Capabilities to be passed to the webdriver instance ----
  //
  // For a full list of available capabilities, see
  // https://code.google.com/p/selenium/wiki/DesiredCapabilities
  // and
  // https://code.google.com/p/selenium/source/browse/javascript/webdriver/capabilities.js
//  capabilities: {
//    'browserName': 'chrome',
//    shardTestFiles: true,
//    maxInstances: 3
//  },
  /* capabilities: {
   'browserName': 'chrome'
   },*/

  // ----- The test framework -----
  //
  // Jasmine and Cucumber are fully supported as a test and assertion framework.
  // Mocha has limited beta support. You will need to include your own
  // assertion framework if working with mocha.
  framework: 'jasmine',

  // ----- Options to be passed to minijasminenode -----
  //
  // See the full list at https://github.com/juliemr/minijasminenode
  jasmineNodeOpts: {
    // If true, display suite and spec names.
    isVerbose: false,
    // If true, print colors to the terminal.
    showColors: true,
    // If true, include stack traces in failures.
    includeStackTrace: true,
    // Time to wait in milliseconds before a test automatically fails
    defaultTimeoutInterval: 50000
  },
  onPrepare: function () {
    browser.manage().window().setSize(1600, 1000);

    var path = require('path');
    jasmine.getEnv().addReporter(new HtmlReporter({
      docName: 'index.html',
      baseDirectory: 'test-results/e2e/',
      preserveDirectory: true,
      pathBuilder: function pathBuilder(spec, descriptions, results, capabilities) {
        // Return '<browser>/<specname>' as path for screenshots:
        // Example: 'firefox/list-should work'.
        var p = descriptions.join('-');
        p = p.replace("/", "-")
        return path.join(capabilities.caps_.browserName, p);
      }
    }));

    require('jasmine-reporters');
    jasmine.getEnv().addReporter(
      new jasmine.JUnitXmlReporter('test/e2e/test-results/JUnitXML/', true, true)
    );

  }
};
