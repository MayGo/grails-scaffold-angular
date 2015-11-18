'use strict';

angular
  .module('angularDemoApp')
  .factory('FormUtils',
  function ($anchorScroll, $location, $log) {

    var focusFirstInvalidField = function () {
      var invalidElements = angular.element.find('.ng-invalid:not(form)');

      if (invalidElements.length > 0) {
        var id = invalidElements[0].id;
        $log.debug('Focus first invalid field with id:' + id);
        $location.hash(id);
        $anchorScroll();
        invalidElements[0].focus();
      }
    };

    var focusField = function (element) {
      var id = element.id;
      if (!id) {
        $log.error('Can not focus field: no id', element);
        return;
      }

      $log.debug('Focus field with id:' + id);
      $anchorScroll(id);
      element.focus();
    };

    var blurField = function (element) {
      var id = element.id;
      if (!id) {
        $log.error('Can not focus field: no id', element);
        return;
      }

      $log.debug('Focus field with id:' + id);
      element.blur();
    };

    var nameFromModelName = function (modelName) {
      var nameParts = modelName.split('.');

      var name = '';

      if (nameParts.length > 3) {
        name = nameParts[nameParts.length - 2] + '.' + nameParts[nameParts.length - 1];
      } else if (nameParts.length > 1) {
        name = nameParts[nameParts.length - 1];
      } else {
        name = nameParts[0];
      }

      return name;
    };

    return {
      focusFirstInvalidField: focusFirstInvalidField,
      focusField: focusField,
      nameFromModelName: nameFromModelName,
      blurField: blurField
    };
  }
);
