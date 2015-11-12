'use strict';

angular.module('angularDemoApp').directive('appMenu', function () {
  return {
    scope: {
      section: '=',
      isSideMenu: '@?'
    },
    templateUrl: 'app/components/menu/menu.tmpl.html',
    controller: function ($scope, $element, MenuService) {
      var ctrl = this;

      ctrl.isOpen = isOpen;
      ctrl.isSelected = isSelected;
      ctrl.toggleOpen = toggleOpen;
      ctrl.isSectionSelected = isSectionSelected;
      ctrl.autoFocusContent = false;


      ctrl.flexType = (ctrl.isSideMenu) ? 'column' : 'row';

      ctrl.sections = MenuService.sections;

      $scope.$on('MENU_TOGGLE', function(e, data){
        toggleOpen(data);
      });


      function isSelected(page) {
        return MenuService.isPageSelected(page);
      }

      function isSectionSelected(section) {
        var selected = false;
        var openedSection = MenuService.openedSection;
        if(openedSection === section){
          selected = true;
        }
        else if(section.children) {
          section.children.forEach(function(childSection) {
            if(childSection === openedSection){
              selected = true;
            }
          });
        }
        return selected;
      }

      function isOpen(section) {
        return MenuService.isSectionSelected(section);
      }

      function toggleOpen(section) {
        MenuService.toggleSelectSection(section);
      }

      function openPage() {
        $scope.closeMenu();

        if (self.autoFocusContent) {
          focusMainContent();
          self.autoFocusContent = false;
        }
      }

      function focusMainContent($event) {
        // prevent skip link from redirecting
        if ($event) { $event.preventDefault(); }

        $timeout(function(){
          mainContentArea.focus();
        },90);

      }
    },
    controllerAs: 'menuCtrl',
    bindToController: true,
    link: function () {

      /*   var controller = $element.parent().controller();

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
