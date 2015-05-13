'use strict';

angular.module('angularDemoApp').directive('objectFormatter', function () {
  return {
    restrict: 'A',
    require: 'ngModel',
    priority: 10,
    scope: {
      objectFormatter: '='
    },
    link: function (scope, element, attr, ngModel) {
      ngModel.$formatters.push(function (value) {
        if(_.isObject(value)) {
          return scope.objectFormatter(value)
        }
        return value
      });
      ngModel.$parsers.push(function (viewValue) {
        if(_.isObject(viewValue)) {
          ngModel.$setViewValue(scope.objectFormatter(viewValue));
        }
        return viewValue
      });
    }
  };
});
