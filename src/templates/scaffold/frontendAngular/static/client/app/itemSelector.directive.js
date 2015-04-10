'use strict';

angular.module('angularDemoApp').directive('itemSelector', function (ItemSelectorService, $rootScope) {
  return {
    restrict: 'A',
    scope: {
      uiLink: '@',
      updateModel: '='
    },
    template: '<a class="btn btn-default"' +
    ' ui-sref="{{uiLink}}" ng-click="registerForEvent()" >' +
    '<i class="fa fa-search-plus"></i>' +
    ' </a>',
    controller: function ($scope, $state, $rootScope) {

      $scope.selectItem = function (item) {
        $rootScope.$emit('select-and-close-modal', item);
      };

      $scope.registerForEvent = function () {
        var unRegister = $rootScope.$on('select-and-close-modal', function (event, item) {
          if (item) {
            $scope.updateModel = item;
          }
          ItemSelectorService.closeModal();
          unRegister();
        });
      }
    },

    link: function (scope, element) {
      ItemSelectorService.setScope(scope);
    }
  };
});
