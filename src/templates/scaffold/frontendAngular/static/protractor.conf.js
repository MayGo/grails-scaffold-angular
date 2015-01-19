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
  baseUrl: 'http://localhost:' + (process.env.PORT || '9000'),

  directConnect: true,


  // list of files / patterns to load in the browser
  specs: [
    'e2e/**/pet.create.spec.js'
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
  capabilities: {
	    'browserName': 'chrome'
  },

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
    defaultTimeoutInterval: 5000
  },
  onPrepare: function() {
	  browser.manage().window().setSize(1600, 1000);
	  //var mockModule = require('./e2e/mock/mock-data');
	  //browser.addMockModule('httpBackendMock', mockModule );
	  
	  var path = require('path');
	  jasmine.getEnv().addReporter(new HtmlReporter({
	         baseDirectory: 'test/e2e/test-results/screenshots/',
	         pathBuilder: function pathBuilder(spec, descriptions, results, capabilities) {
	          
	            var currentDate = new Date(),
	                currentHoursIn24Hour = currentDate.getHours(),
	                currentTimeInHours = currentHoursIn24Hour>12? currentHoursIn24Hour-12: currentHoursIn24Hour,
	                totalDateString = currentDate.getDate()+ '-' + currentDate.getMonth() + '-'+(currentDate.getYear()+1900) + 
	                                      '-'+ currentDate.getHours()+'h-' + Math.round(currentDate.getMinutes()*0.2)+'m';

	            return path.join(totalDateString,capabilities.caps_.browserName, descriptions.join('-'));
	         }
      }));

    require('jasmine-reporters');
    jasmine.getEnv().addReporter(
        new jasmine.JUnitXmlReporter('test/e2e/test-results/JUnitXML/', true, true)
    );

  }
};
