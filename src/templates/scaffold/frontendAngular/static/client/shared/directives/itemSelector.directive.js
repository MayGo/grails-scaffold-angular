'use strict';

angular.module('angularDemoApp').directive('itemSelector', function (ItemSelectorService, $rootScope) {
  return {
    restrict: 'A',
    scope: {
      uiLink: '@',
      updateModel: '='
    },
    template: '<a class="btn btn-default"' +
    ' ng-click="openItemSelector()" >' +
    '<i class="fa fa-search-plus"></i>' +
    ' </a>',
    controller: function ($scope, $state, $rootScope) {
      $scope.isModal = true
      $scope.selectItem = function (item) {
        ItemSelectorService.closeModal(item);
      };

      $scope.openItemSelector = function () {
        var stateSettings = $state.get($scope.uiLink);
        var settings ={
          templateUrl: stateSettings.templateUrl,
          controller: stateSettings.controller,
          scope: $scope
        }

        ItemSelectorService.openModal(settings);
      }
    }
  };
});
