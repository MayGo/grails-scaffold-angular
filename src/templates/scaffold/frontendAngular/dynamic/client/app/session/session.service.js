'use strict';

angular.module('angularDemoApp').provider('SessionService', function (\$authProvider, appConfig) {

	\$authProvider.loginOnSignup = true;
    \$authProvider.logoutRedirect = '/';
    \$authProvider.loginUrl =  appConfig.loginUrl;
    \$authProvider.unlinkUrl = appConfig.logoutUrl;
    \$authProvider.loginRoute = '/login';
    \$authProvider.tokenName =  'access_token';
    \$authProvider.authHeader =  'Authorization';

	this.\$get = function (\$localStorage, \$auth, \$q, appConfig, \$http) {
		var service = {};
		var _currentUser = {};

		service.login = function (username, password) {
		  var deferred = \$q.defer();

		  \$auth.login({ username: username, password: password }).then(function (response) {
			console.log("Logged in.");
			service.afterLogin(response.data);
			deferred.resolve(response.data);
		  }).catch(function (response) {
			console.log("Error when login.");
			deferred.reject(response)
		  });

		  return deferred.promise;
		};

		service.afterLogin = function (userData) {
		  _currentUser = userData;
		  // save settings to local storage
			\$localStorage.userData = userData;
		};

		service.logout = function () {
		  delete \$localStorage.userData;
		  _currentUser = {};
		  return \$auth.logout();
		};

		service.getCurrentUser = function () {
		  if (!_.isEmpty(_currentUser)) {
			return _currentUser;
		  }

		  //get from local storage
		  if (angular.isDefined(\$localStorage.userData)) {
			_currentUser = \$localStorage.userData;
		  }

		  return _currentUser;
		};

		service.isAuthenticated = function () {
		  return !_.isEmpty(service.getCurrentUser())
		};

		return service;
	};
});
