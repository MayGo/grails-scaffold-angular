'use strict';

angular.module('angularDemoApp').filter('stateToI10n', function () {
  return function (value) {
    return (!value) ? '' : value.replace(/app./g, '');
  };
});
