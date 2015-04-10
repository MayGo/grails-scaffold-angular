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
  'FBAngular',
  'ngTagsInput',
  'satellizer',
  //'mgcrea.ngStrap',
  'ngToggle',
  'permission',
	'JSONedit'
])
	.constant('appConfig', (function() {

		var removeSlash = function(str){
 			if(str.substr(0, 1) === '/' ){
 				 str = str.substr(1);
 			}
 			return str;
 		};

 		//Set defaults
		var defaultConfig = {
 				restUrl : '${appUrl}',
 	 			loginUrl : '${appUrl}${(config.grails.plugin.springsecurity.rest.login.endpointUrl)?:"/api/login"}',
 	 			logoutUrl : '${appUrl}${(config.grails.plugin.springsecurity.rest.logout.endpointUrl)?:"/api/logout"}',
 	 			validationUrl: '${appUrl}${(config.grails.plugin.springsecurity.rest.token.validation.endpointUrl)?:"/api/validate"}',
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

		if(defaultConfig.restUrl === undefined){
			console.error('Define restUrl in config.json.');
		}
		if(defaultConfig.loginUrl === undefined){
			console.error('Define loginUrl in config.json.');
		}
		if(defaultConfig.logoutUrl === undefined){
			console.error('Define logoutUrl in config.json.');
		}
		/*if(defaultConfig.validationUrl === undefined){
			console.error('Define validationUrl in config.json.');
		}*/
		if(defaultConfig.securityEnabled === undefined){
			console.error('Define securityEnabled in config.json.');
		}
		// Return correct config
		defaultConfig.restUrl = removeSlash(defaultConfig.restUrl);

 	    return defaultConfig;
   })())

  .config(function (\$stateProvider, \$urlRouterProvider, \$locationProvider, cfpLoadingBarProvider, datepickerConfig, datepickerPopupConfig) {
  	// Override default config from custom config  file
  	\$stateProvider
		.state('app', {
			abstract: true,
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

	\$urlRouterProvider.otherwise('/app/settings');

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
        loadOnFocus: true
      });
  })
	.factory('AuthHttpInterceptor', function (\$q, \$injector, \$rootScope, \$translate, inform) {
		function interceptor(rejection) {
			try {
				if(rejection.status === 401){
					\$rootScope.\$emit('show-relogin-modal');
				}else if(rejection.status === 403){
					\$translate('pages.session.messages.forbidden').then(function (msg) {
						inform.add(msg  , {'type': 'danger', ttl: 0});
					});
				}else{
					var msg = 'Network error (' + rejection.status + '): ' + rejection.statusText + ' for url:' + rejection.config.url;
					inform.add(msg, { type: 'danger', ttl: 0});
				}

			} catch(ex) {
				console.log('\$httpProvider', ex);
			}

			return \$q.reject( rejection );
		}
		return {
			requestError: interceptor,
			responseError: interceptor
		};

	})
	.config(function (\$httpProvider) {
		var regexIso8601 = /^(\\d{4}|\\+\\d{6})(?:-(\\d{2})(?:-(\\d{2})(?:T(\\d{2}):(\\d{2}):(\\d{2})\\.(\\d{1,})(Z|([\\-+])(\\d{2}):(\\d{2}))?)?)?)?\$/;

		function convertDateStringsToDates(input) {
			// Ignore things that aren't objects.
			if (typeof input !== "object") return input;

			for (var key in input) {
				if (!input.hasOwnProperty(key)) continue;

				var value = input[key];
				var match;
				// Check for string properties which look like dates.
				if (typeof value === "string" && (match = value.match(regexIso8601))) {
					var milliseconds = Date.parse(match[0])
					if (!isNaN(milliseconds)) {
						input[key] = new Date(milliseconds);
					}
				} else if (typeof value === "object") {
					// Recurse into object
					convertDateStringsToDates(value);
				}
			}
		}
		\$httpProvider.defaults.transformResponse.push(function(responseData){
			convertDateStringsToDates(responseData);
			return responseData;
		});
		\$httpProvider.interceptors.push('AuthHttpInterceptor');
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

		//Set date to timestamp to ignore users locale
		Date.prototype.toJSON = function() {
			var d = this
			d.setHours(0, 0, 0);
			var grailsAcceptableFormat = 'yyyy-MM-dd HH:mm:ss.sssZ';
			return \$filter('date')(d, grailsAcceptableFormat, 'UTC');
		};
  }).run(function (\$rootScope, \$state) {
		\$rootScope.\$on('\$stateChangeError', function (e, toPage) {
			console.log('State Change Error');
			var stateParams = { };
			stateParams.messageCode = 'pages.session.messages.state-change-error';
			stateParams.url = toPage.url;
			\$state.go('app.error', stateParams, {location: false});
		});

	\$rootScope.\$on('\$stateChangePermissionDenied', function (e, toPage) {
		console.log('State Change Permission Denied');

		var stateParams = { };
		stateParams.messageCode = 'pages.session.messages.permission-denied';
		stateParams.url = toPage.url;
		\$state.go('app.error', stateParams, {location: false});
	});

	}).run(function (Permission, SessionService) {
		Permission
			.defineRole('ROLE_USER', function () {
				return SessionService.hasRole('ROLE_USER');
			})
			.defineRole('ROLE_ADMIN', function () {
				return SessionService.hasRole('ROLE_ADMIN');
			});
	});
