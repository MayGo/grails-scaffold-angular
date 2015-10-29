'use strict';

angular.module('angularDemoApp').directive('menuToggle', [ '$timeout', function($timeout) {
  return {
    scope: {
      section: '='
    },
    templateUrl: 'partials/menu-toggle.tmpl.html',
    link: function($scope, $element) {
      var controller = $element.parent().controller();
      var $ul = $element.find('ul');
      var originalHeight;

      $scope.isOpen = function() {
        return controller.isOpen($scope.section);
      };
      $scope.toggle = function() {
        controller.toggleOpen($scope.section);
      };
      $scope.$watch(
        function () {
          return controller.isOpen($scope.section);
        },
        function (open) {
          var $ul = $element.find('ul');
          var targetHeight = open ? getTargetHeight() : 0;
          $timeout(function () {
            $ul.css({ height: targetHeight + 'px' });
          }, 0, false);

          function getTargetHeight () {
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
      if(parentNode.classList.contains('parent-list-item')) {
        var heading = parentNode.querySelector('h2');
        $element[0].firstChild.setAttribute('aria-describedby', heading.id);
      }
    }
  };
}])
