'use strict';

angular.module('angularDemoApp').provider('SessionService', function ($authProvider, appConfig) {

	$authProvider.loginOnSignup = true;
    $authProvider.logoutRedirect = '/';
    $authProvider.loginUrl = appConfig.loginUrl;
    $authProvider.unlinkUrl = appConfig.logoutUrl;
    $authProvider.loginRoute = '/login';
    $authProvider.tokenName =  'access_token';
    $authProvider.authHeader =  'Authorization';

	this.$get = function ($localStorage, $auth, $q, appConfig, $http, $rootScope, $modal) {
		var service = {};
		var _currentUser = {};

		var _loginModal = null;

		$rootScope.$on('show-relogin-modal', function (event) {
			if(!_loginModal){
				showTheModal();
			}
		});

		function showTheModal() {
			_loginModal = $modal.open({
				templateUrl: 'app/login/login.html',
				controller: 'LoginController'
			})
			_loginModal.result.finally(function() {
				_loginModal = null;
			});
		}

		service.login = function (username, password) {
		  var deferred = $q.defer();

		  $auth.login({ username: username, password: password }).then(function (response) {
			console.log("Logged in.");
			// save settings to local storage
			$localStorage.userData = _currentUser = response.data;
			if(_loginModal){
				_loginModal.close();
			}
			deferred.resolve(response.data);
		  }).catch(function (response) {
			console.log("Error when login.");
			deferred.reject(response)
		  });

		  return deferred.promise;
		};

		service.logout = function () {
		  delete $localStorage.userData;
		  _currentUser = {};
		  return $auth.logout();
		};

		service.getCurrentUser = function () {
		  if (!_.isEmpty(_currentUser)) {
			return _currentUser;
		  }

		  //get from local storage
		  if (angular.isDefined($localStorage.userData)) {
			_currentUser = $localStorage.userData;
		  }

		  return _currentUser;
		};

		service.hasRole = function (role) {
			if (_.isEmpty(_currentUser) || _.isEmpty(_currentUser.permissions) ) {
				return false;
			}

			return _.indexOf(_currentUser.permissions, role) !== -1;
		};

		service.isAuthenticated = function () {
		  return !_.isEmpty(service.getCurrentUser())
		};

		return service;
	};
});
