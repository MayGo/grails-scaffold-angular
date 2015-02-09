'use strict';

angular.module('angularDemoApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('app.error', {
        url: '/error',
        templateUrl: 'app/error/error.html',
        controller: 'ErrorController',
		params: {messageCode: null, url: null}
      });
  });