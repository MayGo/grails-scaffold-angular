'use strict';

angular.module('angularDemoApp')
  .config(function (\$stateProvider) {
    \$stateProvider
      .state('app.main', {
        url: '/main',
        templateUrl: 'app/main/main.html',
        controller: 'MainController'
      });
  });