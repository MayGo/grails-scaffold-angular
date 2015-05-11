'use strict';

angular.module('angularDemoApp')
  .controller('SettingsController', function ($scope, SessionService) {
    $scope.user = SessionService.getCurrentUser();
  });
