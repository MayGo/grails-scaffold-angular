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
      console.log($scope.uiLink);
      console.log($state.get($scope.uiLink));
      $scope.isModal = true
      $scope.selectItem = function (item) {
        $rootScope.$emit('select-and-close-modal', item);
      };

      $scope.registerForEvent = function () {
        var stateSettings = $state.get($scope.uiLink);
        var settings ={
          templateUrl: stateSettings.templateUrl,
          controller: stateSettings.controller,
          scope: $scope
        }

        console.log(settings)

        ItemSelectorService.openModal(settings);

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

    }
  };
});
