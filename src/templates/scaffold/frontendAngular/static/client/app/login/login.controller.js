'use strict';

angular.module('angularDemoApp')
  .controller('LoginController', function ($scope, SessionService) {
    $scope.authError = null;

 	$scope.login = function() {
 		$scope.authError = null;
		SessionService.login($scope.user.username,$scope.user.password)
        	.then(function(response) {

	        })
	        .catch(function(response) {
	        	console.error(response);
	        	$scope.authError = 'Username or Password not right';
	        });
    };
  });
