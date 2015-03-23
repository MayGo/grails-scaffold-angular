// Karma configuration
// http://karma-runner.github.io/0.10/config/configuration-file.html

module.exports = function(config) {
  config.set({
    reporters: ['html', 'dots', 'progress', 'growl'],

    htmlReporter: {
      outputDir: 'test-results/unit', // where to put the reports
      focusOnFailures: true, // reports show failures on start
      namedFiles: false, // name files instead of creating sub-directories
      urlFriendlyName: false // simply replaces spaces with _ for files/dirs

    },
    // base path, that will be used to resolve files and exclude
    basePath: '',
    colors: true,
    // testing framework to use (jasmine/mocha/qunit/...)
    frameworks: ['jasmine'],

    // list of files / patterns to load in the browser
    files: [
      'client/bower_components/jquery/dist/jquery.js',
      'client/bower_components/jquery-ui/jquery-ui.min.js',
      'client/bower_components/angular/angular.js',
      'client/bower_components/angular-ui-sortable/sortable.min.js',
      'client/bower_components/angular-resource/angular-resource.js',
      'client/bower_components/angular-cookies/angular-cookies.js',
      'client/bower_components/angular-sanitize/angular-sanitize.js',
      'client/bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
      'client/bower_components/lodash/dist/lodash.compat.js',
      'client/bower_components/angular-ui-router/release/angular-ui-router.js',
      'client/bower_components/angular-auto-validate/dist/jcs-auto-validate.min.js',
      'client/bower_components/angular-loading-bar/build/loading-bar.js',
      'client/bower_components/angular-animate/angular-animate.js',
      'client/bower_components/angular-inform/dist/angular-inform.js',
      'client/bower_components/satellizer/satellizer.js',
      'client/bower_components/ng-tags-input/ng-tags-input.min.js',
      'client/bower_components/angular-smart-table/dist/smart-table.min.js',
      'client/bower_components/ngstorage/ngStorage.js',
      'client/bower_components/angular-translate/angular-translate.js',
      'client/bower_components/angular-translate-loader-static-files/angular-translate-loader-static-files.js',
      'client/bower_components/angular-translate-storage-cookie/angular-translate-storage-cookie.js',
      'client/bower_components/angular-translate-storage-local/angular-translate-storage-local.js',
      'client/bower_components/angular-fullscreen/src/angular-fullscreen.js',
      'client/bower_components/angular-strap/dist/angular-strap.js',
      'client/bower_components/angular-strap/dist/angular-strap.tpl.js',
      'client/bower_components/angular-touch/angular-touch.js',
      'client/bower_components/ngToggle/ng-toggle.js',
      'client/bower_components/angular-mocks/angular-mocks.js',
      'client/bower_components/angular-permission/dist/angular-permission.js',
      'client/bower_components/json-edit/js/directives.js',


      { pattern: 'client/config.json', included: false },
      'client/app/app.js',
      'client/app/app.html',
      'client/app/**/*.js',
      'client/app/**/*.coffee',
      'client/shared/**/*.js',
      'client/shared/**/*.coffee',
      'client/shared/**/*.coffee',
      'client/app/**/*.jade',
      'client/shared/**/*.jade',
      'client/app/**/*.html',
      'client/shared/**/*.html'
    ],

    preprocessors: {
      '**/*.jade': 'ng-jade2js',
      '**/*.html': 'html2js',
      '**/*.json': 'html2js',
      '**/*.coffee': 'coffee'
    },

    ngHtml2JsPreprocessor: {
      stripPrefix: 'client/',
      moduleName: 'angularDemoApp'
    },

    ngJade2JsPreprocessor: {
      stripPrefix: 'client/'
    },

    // list of files / patterns to exclude
    exclude: [],

    // web server port
    port: 8089,

    // level of logging
    // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
    logLevel: config.LOG_DEBUG,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,


    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    browsers: ['Chrome'],


    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: false
  });
};
