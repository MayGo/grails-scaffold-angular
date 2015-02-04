'use strict';

angular.module('angularDemoApp', [
  'ngAnimate',
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngTouch',
  'ngStorage',
  'ui.router',
  'ui.bootstrap',
  'pascalprecht.translate',
  'jcs-autoValidate',
  'angular-loading-bar',
  'smart-table',
  'ui.bootstrap.typeahead',
  'inform',
  'inform-exception',
  'inform-http-exception',
  'FBAngular',
  'ngTagsInput',
  'satellizer',
  'mgcrea.ngStrap',
  'ngToggle'
])
	.constant('appConfig', (function() {

		var removeSlash = function(str){
 			if(str.substr(0, 1) === '/' ){
 				 str = str.substr(1);
 			}
 			return str;
 		};

 		var appendSlash = function(str){
 			if(str.substr(-1) !== '/' ){
 				str += '/';
 			}
 			return str;
 		};

 		//Set defaults
		var defaultConfig = {
 				restUrl : '${appUrl}',
 	 			loginUrl : '${(config.grails.plugin.springsecurity.rest.login.endpointUrl)?:"/api/login"}',
 	 			logoutUrl : '${(config.grails.plugin.springsecurity.rest.logout.endpointUrl)?:"/api/logout"}',
 	 			validationUrl: '${(config.grails.plugin.springsecurity.rest.token.validation.endpointUrl)?:"/api/validate"}',
 	 			securityEnabled: ${(config.grails.plugin.springsecurity.active)?:false}
		};
 		var loadSuccess = function( data ) {
			 if(data){
			 	  angular.extend(defaultConfig, data);
			 }
		};
		// Load external config
		\$.ajax({
		    type: 'GET',
		    url: 'config.json',
		    dataType: 'json',
		    success: loadSuccess,
		    error: function(){console.log('Error loading config.json');},
		    async: false
		});

		// Return correct config
		var restUrl = appendSlash(defaultConfig.restUrl);
		var config = {
			restUrl : restUrl,
			loginUrl: defaultConfig.loginUrl,
			logoutUrl: defaultConfig.logoutUrl,
			securityEnabled: defaultConfig.securityEnabled
		};

 	    return config;
   })())

  .config(function (\$stateProvider, \$urlRouterProvider, \$locationProvider, cfpLoadingBarProvider, datepickerConfig, datepickerPopupConfig) {
  	// Override default config from custom config  file
  	\$stateProvider
		.state('app', {
			//abstract: true,
			url: '/app',
			templateUrl: 'app/app.html',
			controller: 'AppController',
			resolve: {
				authenticated: function (\$location, appConfig, SessionService) {
					if (appConfig.securityEnabled && !SessionService.isAuthenticated()) {
						return \$location.path('/login');
					}
				}
			}
		});

	\$urlRouterProvider.otherwise('/app/dashboard');

    cfpLoadingBarProvider.includeSpinner = true;
    cfpLoadingBarProvider.includeBar = true;
    cfpLoadingBarProvider.latencyThreshold = 150;


	datepickerConfig.showWeeks = false;
	datepickerConfig.startingDay = 1;
    datepickerPopupConfig.datepickerPopup= 'dd.MM.yyyy';
    datepickerPopupConfig.showButtonBar = false;



   // \$locationProvider.html5Mode(true);
  }).config(function(\$translateProvider){
    // Register a loader for the static files
    // So, the module will search missing translation tables under the specified urls.
    // Those urls are [prefix][langKey][suffix].
    \$translateProvider.useStaticFilesLoader({
      prefix: 'l10n/',
      suffix: '.js'
    });
    // Tell the module what language to use by default
    \$translateProvider.preferredLanguage('en');
    // Tell the module to store the language in the local storage
    \$translateProvider.useLocalStorage();
  })
  .config(function(tagsInputConfigProvider) {
       tagsInputConfigProvider.setDefaults('tagsInput', {
        displayProperty:'name',
        addFromAutocompleteOnly:true
      })
      .setDefaults('autoComplete', {
          minLength:0,
          maxResultsToShow:15,
        highlightMatchedText: true,
        loadOnDownArrow: true,
        loadOnEmpty: true,
        loadOnFocus: true,
      });

  })
  .value('uiJqConfig', {
    iCheck: {
        checkboxClass: 'icheckbox_square-blue',
        radioClass: 'iradio_square-blue',
        increaseArea: '20%' // optional
    }
  })
  .run(function(\$filter, validator) {
  		validator.setValidElementStyling(false);

		Date.prototype.toJSON = function() {
	    	var grailsAcceptableFormat = 'yyyy-MM-dd HH:mm:ss.sssZ';
	    	return \$filter('date')(this, grailsAcceptableFormat);
	    };
  });