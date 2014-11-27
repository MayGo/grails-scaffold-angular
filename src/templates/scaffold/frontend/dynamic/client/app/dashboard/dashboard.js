'use strict';

angular.module('angularDemoApp')
  .config(function (\$stateProvider) {
    \$stateProvider
      .state('app.dashboard', {
        url: '/dashboard',
        templateUrl: 'app/dashboard/dashboard.html',
        controller: 'DashboardCtrl'
      });
  });