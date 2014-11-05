'use strict';

angular.module('angularDemoApp')
  .config(function (\$stateProvider) {
    \$stateProvider
      .state('main', {
        url: '${appUrl}/spa/main/',
        templateUrl: 'app/main/main.html',
        controller: 'MainCtrl'
      });
  });