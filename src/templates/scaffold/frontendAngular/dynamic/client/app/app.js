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

		// Return correct config
		var restUrl = removeSlash(defaultConfig.restUrl);
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
					var msg = 'Network error (' + rejection.status + '): ' + rejection.statusText;
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

		Date.prototype.toJSON = function() {
	    	var grailsAcceptableFormat = 'yyyy-MM-dd HH:mm:ss.sssZ';
	    	return \$filter('date')(this, grailsAcceptableFormat);
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
