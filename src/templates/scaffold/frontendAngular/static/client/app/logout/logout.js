'use strict';

angular.module('angularDemoApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('logout', {
        url: '/logout',
        controller: 'LogoutController'
      });
  });