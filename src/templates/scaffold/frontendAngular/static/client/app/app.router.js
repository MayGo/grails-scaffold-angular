'use strict';

angular.module('angularDemoApp')
  .config(function ($stateProvider, $urlRouterProvider, $locationProvider, cfpLoadingBarProvider) {
    // Override default config from custom config  file
    $stateProvider
      .state('app', {
        abstract: true,
        url: '/app',
        templateUrl: 'app/app.html',
        controller: 'AppController',
        controllerAs: 'appCtrl',
        resolve: {
          authenticated: function ($location, appConfig, SessionService) {
            if (appConfig.securityEnabled && !SessionService.isAuthenticated()) {
              return $location.path('/login');
            }
          }
        }
      });

    $urlRouterProvider.otherwise('/app/settings');

    cfpLoadingBarProvider.includeSpinner = true;
    cfpLoadingBarProvider.includeBar = true;
    cfpLoadingBarProvider.latencyThreshold = 150;

// $locationProvider.html5Mode(true);
  })
