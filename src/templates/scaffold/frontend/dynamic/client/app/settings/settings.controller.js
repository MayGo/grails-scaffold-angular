'use strict';

angular.module('angularDemoApp')
  .controller('SettingsController', function (\$scope, \$http, \$state, appConfig, \$auth, SessionService) {
  	\$scope.user = SessionService.getCurrentUser();
  
  });
