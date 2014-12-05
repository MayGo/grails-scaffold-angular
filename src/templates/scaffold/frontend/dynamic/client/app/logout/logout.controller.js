'use strict';

angular.module('angularDemoApp')
  .controller('LogoutController', function(\$auth) {
    if (!\$auth.isAuthenticated()) {
        return;
    }
    \$auth.logout()
      .then(function() {
        console.log('Logged out');
      });
  });
