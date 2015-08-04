'use strict';

angular.module('angularDemoApp').directive('itemSelector', function ($mdDialog) {
  return {
    restrict: 'E',
    scope: {
      itemLink: '@',
      updateModel: '='
    },
    template: '<md-button class="md-icon-button" ng-click="openItemSelector($event)">'+
              '<md-tooltip>{{"button.openItemSelector" |translate}}</md-tooltip>'+
              '<md-icon md-font-set="material-icons" class="md-primary">add_circle</md-icon></md-button>',

    controller: function ($scope, $state) {

      var stateSettings = $state.get($scope.itemLink);

      $scope.openItemSelector = function (ev) {
        $mdDialog.show({
          templateUrl: stateSettings.templateUrl,
          controller: stateSettings.controller,
          parent: angular.element(document.body),
          targetEvent: ev,
        }).then(function (selectedItem) {
          $scope.updateModel = selectedItem;
        });
      }

    }
  };
});
