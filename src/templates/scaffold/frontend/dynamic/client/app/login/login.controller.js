'use strict';

angular.module('angularDemoApp')
  .controller('LoginController', function (\$scope, \$http, \$state, appConfig, \$auth) {
  	\$scope.user = {};
    \$scope.authError = null;

 	\$scope.login = function() {
 		\$scope.authError = null;
      \$auth.login({ username: \$scope.user.username, password: \$scope.user.password })
        .then(function(response) {
        	console.log(response)
          
        })
        .catch(function(response) {
        	console.log(response);
        	console.log("error")
          \$scope.authError = 'Username or Password not right';
        });
    };

//{"login":"maigo.erit","permissions":["ROLE_GROUP_-_ARENDUS","ROLE_EXT-PROJECT-KMAOZZ","ROLE_SMIT-EMPLOYEES","ROLE_SMIT-AD-TAO","ROLE_GROUP_-_SMIT_ALL","ROLE_PROJECT-SMIT07","ROLE_JIRA-ADMINISTRATORS","ROLE_X_SMIT_WIKI","ROLE_PROJECT-SMIT2702","ROLE_JIRASTUDIO-ADMIN","ROLE_CROWD-ADMINISTRATORS","ROLE_X_SSL_SMIT-WIKI","ROLE_X_SMIT_GIT","ROLE_X_SMIT_JIRA","ROLE_SMIT-AD-EMPLOYEES"],"access_token":"lae3hngk0tlciks4g23tlaagg1vkg8gs"}


  });
