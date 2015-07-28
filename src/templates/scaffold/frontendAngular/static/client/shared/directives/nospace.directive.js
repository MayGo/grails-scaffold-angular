'use strict';

angular.module('angularDemoApp').filter('nospace', function () {
  return function (value) {
    return (!value) ? '' : value.replace(/ /g, '');
  };
});
