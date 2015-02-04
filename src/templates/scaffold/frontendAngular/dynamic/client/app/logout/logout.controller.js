'use strict';

angular.module('angularDemoApp')
  .controller('LogoutController', function(SessionService) {
	if (!SessionService.isAuthenticated()) {
        return;
    }
	SessionService.logout().then(function() {
		console.log('Logged out');
	}).catch(function (response) {
		console.error(response);
	});
  });
