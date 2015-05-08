'use strict';

angular.module('angularDemoApp')
  .controller('SettingsController', function ($scope, SessionService, FileUploader, appConfig) {
  	$scope.user = SessionService.getCurrentUser();
    var uploader = $scope.uploader = new FileUploader({
      url: appConfig.restUrl + '/upload'
    });
  });
