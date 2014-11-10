'use strict';



angular.module('angularDemoApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ui.router',
  'ui.bootstrap',
  'jcs-autoValidate',
  'angular-loading-bar', 
  'ngAnimate',
  'inform', 
  'inform-exception', 
  'inform-http-exception'
])
  .config(function (\$stateProvider, \$urlRouterProvider, \$locationProvider, cfpLoadingBarProvider, datepickerConfig, datepickerPopupConfig) {
	  cfpLoadingBarProvider.includeSpinner = true;
	  cfpLoadingBarProvider.includeBar = true;
	  cfpLoadingBarProvider.latencyThreshold = 1;
    \$urlRouterProvider
      .otherwise('/app/main');
	\$stateProvider
		.state('app', {
			//abstract: true,
			url: '/app',
			templateUrl: 'app/app.html'
		})
	datepickerConfig.showWeeks = false;
	datepickerConfig.startingDay = 1;
    datepickerPopupConfig.datepickerPopup= 'dd.MM.yyyy';
    datepickerPopupConfig.showButtonBar = false;
    
		
    
   // \$locationProvider.html5Mode(true);
  }).run(function(\$filter) { 
	  Date.prototype.toJSON = function() {
	    	console.log(this)
	       // return "2014-11-04 00:00:00.000+0200";
	    	var grailsAcceptableFormat = 'yyyy-MM-dd HH:mm:ss.sssZ';
	    	return \$filter('date')(this, grailsAcceptableFormat)
	    };
  });