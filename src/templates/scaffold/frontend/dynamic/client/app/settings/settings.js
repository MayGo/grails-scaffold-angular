'use strict';

angular.module('angularDemoApp')
  .config(function (\$stateProvider) {
    \$stateProvider
      .state('app.settings', {
        url: '/app/settings',
        templateUrl: 'app/settings/settings.html',
        controller: 'SettingsController'
      });
  });