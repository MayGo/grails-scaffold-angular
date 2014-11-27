'use strict';

angular.module('angularDemoApp')
  .controller('LogoutCtrl', function(\$auth) {
    if (!\$auth.isAuthenticated()) {
        return;
    }
   \$auth.logout()
      .then(function() {
        console.log("Logged out");
      });
  });
