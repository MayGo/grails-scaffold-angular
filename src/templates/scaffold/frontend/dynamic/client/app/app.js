'use strict';

angular.module('angularDemoApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ui.router',
  'ui.bootstrap'
])
  .config(function (\$stateProvider, \$urlRouterProvider, \$locationProvider) {
    \$urlRouterProvider
      .otherwise('/app/main');
	\$stateProvider
		.state('app', {
			//abstract: true,
			url: '/app',
			templateUrl: 'app/app.html'
		})

   // \$locationProvider.html5Mode(true);
  });