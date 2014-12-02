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
  'mgcrea.ngStrap'
])
	.constant("appConfig", (function() {
  		function removeSlash(str){
 			if(str.substr(0, 1) == "/" ) str = str.substr(1);
 			return str
 		}
 		function appendSlash(str){
 			if(str.substr(-1) != "/" ) str += "/";
 			return str
 		}
 		var restUrl = appendSlash('${appUrl}');
 	    return {
 	    	restUrl : restUrl,
 			loginUrl : restUrl + removeSlash('${(config.grails.plugin.springsecurity.rest.login.endpointUrl)?:"api/login"}'),
 			logoutUrl : restUrl + removeSlash('${(config.grails.plugin.springsecurity.rest.logout.endpointUrl)?:"api/logout"}'),
 			validationUrl: restUrl + removeSlash('${(config.grails.plugin.springsecurity.rest.token.validation.endpointUrl)?:"api/validate"}'),
 			securityEnabled : ${(config.grails.plugin.springsecurity.rest.login.active)?:false},
 	    }
   })())
  .config(function (\$stateProvider, \$urlRouterProvider, \$locationProvider, cfpLoadingBarProvider, datepickerConfig, datepickerPopupConfig) {
  	\$stateProvider
		.state('app', {
			//abstract: true,
			url: '/app',
			templateUrl: 'app/app.html',
			controller: 'AppController',
			resolve: {
	          authenticated: function(\$location, \$auth, appConfig) {
	            if (appConfig.securityEnabled && !\$auth.isAuthenticated()) {
	              return \$location.path('/login');
	            }
	          }
	        }
		});
	\$urlRouterProvider
      .otherwise('/app/dashboard');
  	
    cfpLoadingBarProvider.includeSpinner = true;
    cfpLoadingBarProvider.includeBar = true;
    cfpLoadingBarProvider.latencyThreshold = 1;
    
	
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
        displayProperty:"name",
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
  .config(function(\$authProvider, appConfig) {
      \$authProvider.loginOnSignup = true;
    \$authProvider.logoutRedirect =  '/';
    \$authProvider.loginUrl =  appConfig.loginUrl;
    \$authProvider.unlinkUrl = appConfig.logoutUrl,
    \$authProvider.loginRoute =  '/login';
    \$authProvider.tokenName =  'access_token';
    \$authProvider.authHeader =  'Authorization';
    
  })
  .run(function(\$filter, validator) { 
  		validator.setValidElementStyling(false);

		Date.prototype.toJSON = function() {
	    	var grailsAcceptableFormat = 'yyyy-MM-dd HH:mm:ss.sssZ';
	    	return \$filter('date')(this, grailsAcceptableFormat)
	    };
  });