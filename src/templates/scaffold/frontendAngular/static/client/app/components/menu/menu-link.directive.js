'use strict';

angular.module('angularDemoApp').directive('menuLink', function() {
  return {
    scope: {
      section: '='
    },
    templateUrl: 'app/components/menu/menu-link.tmpl.html',
    controller:function(){},
    controllerAs: 'menuLinkCtrl',
    bindToController: true,
    link: function($scope, $element) {
      /*var controller = $element.parent().controller();

      $scope.isSelected = function() {
        return controller.isSelected($scope.section);
      };

      $scope.focusSection = function() {
        // set flag to be used later when
        // $locationChangeSuccess calls openPage()
        controller.autoFocusContent = true;
      };*/
    }
  };
})
