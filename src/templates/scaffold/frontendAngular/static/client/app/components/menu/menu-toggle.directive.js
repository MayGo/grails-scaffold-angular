'use strict';

angular.module('angularDemoApp').directive('menuToggle', ['$timeout', function ($timeout) {
  return {
    scope: {
      section: '='
    },
    templateUrl: 'app/components/menu/menu-toggle.tmpl.html',
    controller: function ($scope, $element, MenuService) {
      var ctrl = this;
      var $ul = $element.find('ul');
      var originalHeight;

      ctrl.toggle = function () {
        $scope.$emit('MENU_TOGGLE', ctrl.section);
      }
      $scope.$watch(
        function () {
          return MenuService.isSectionSelected(ctrl.section);
        },
        function (open) {
          var $ul = $element.find('ul');
          var targetHeight = open ? getTargetHeight() : 0;
          $timeout(function () {
            $ul.css({height: targetHeight + 'px'});
          }, 0, false);

          function getTargetHeight() {
            var targetHeight;
            $ul.addClass('no-transition');
            $ul.css('height', '');
            targetHeight = $ul.prop('clientHeight');
            $ul.css('height', 0);
            $ul.removeClass('no-transition');
            return targetHeight;
          }
        }
      );


      var parentNode = $element[0].parentNode.parentNode.parentNode;
      if (parentNode.classList.contains('parent-list-item')) {
        var heading = parentNode.querySelector('h2');
        $element[0].firstChild.setAttribute('aria-describedby', heading.id);
      }
    },
    controllerAs: 'menuToggleCtrl',
    bindToController: true,
    link: function ($scope, $element, MenuService) {

    }
  };
}])
