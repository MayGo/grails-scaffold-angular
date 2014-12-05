'use strict';

angular.module('angularDemoApp')
  .controller('LoginController', function (\$scope, \$http, \$state, appConfig, \$auth, SessionService) {
    \$scope.authError = null;

 	\$scope.login = function() {
 		\$scope.authError = null;
      	\$auth.login({ username: \$scope.user.username, password: \$scope.user.password })
        	.then(function(response) {
	        	SessionService.afterLogin(response.data);
	        })
	        .catch(function(response) {
	        	console.error(response);
	        	\$scope.authError = 'Username or Password not right';
	        });
    };
  });
