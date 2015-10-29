(function () {

  angular
    .module('angularDemoApp')
    .controller('AppController', AppController);

  AppController.$inject = ['MenuService', '$mdSidenav', '$mdBottomSheet', '$log', '$q', '$state', '$mdToast'];

  function AppController(MenuService, $mdSidenav, $mdBottomSheet, $log, $q, $state, $mdToast) {
    var ctrl = this;


    ctrl.menu = MenuService;
    ctrl.state = $state
    ctrl.path = path;
    ctrl.goHome = goHome;
    ctrl.openMenu = openMenu;
    ctrl.closeMenu = closeMenu;
    ctrl.isSectionSelected = isSectionSelected;

    // Methods used by menuLink and menuToggle directives
    ctrl.isOpen = isOpen;
    ctrl.isSelected = isSelected;
    ctrl.toggleOpen = toggleOpen;
    ctrl.autoFocusContent = false;

    var mainContentArea = document.querySelector("[role='main']");

    // *********************
    // Internal methods
    // *********************

    function closeMenu() {
      $timeout(function() { $mdSidenav('left').close(); });
    }

    function openMenu() {
      $timeout(function() { $mdSidenav('left').open(); });
    }

    function path() {
      return $location.path();
    }

    function goHome($event) {
      MenuService.selectPage(null, null);
      $location.path( '/' );
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

    //grap








    ctrl.toggleItemsList = toggleItemsList;
    ctrl.showActions = showActions;
   // ctrl.title = $state.current.data.title;
    ctrl.showSimpleToast = showSimpleToast;


    function toggleItemsList() {
      var pending = $mdBottomSheet.hide() || $q.when(true);

      pending.then(function () {
        $mdSidenav('left').toggle();
      });
    }



    function showActions($event) {
      $mdBottomSheet.show({
        parent: angular.element(document.getElementById('content')),
        templateUrl: 'app/views/partials/bottomSheet.html',
        controller: ['$mdBottomSheet', SheetController],
        controllerAs: "appCtrl",
        bindToController: true,
        targetEvent: $event
      }).then(function (clickedItem) {
        clickedItem && $log.debug(clickedItem.name + ' clicked!');
      });

      function SheetController($mdBottomSheet) {
        var ctrl = this;

        ctrl.actions = [
          {
            name: 'Share',
            icon: 'share',
            url: 'https://twitter.com/intent/tweet?text=Angular%20Material%20Dashboard%20https://github.com/flatlogic/angular-material-dashboard%20via%20@flatlogicinc'
          },
          {name: 'Star', icon: 'star', url: 'https://github.com/flatlogic/angular-material-dashboard/stargazers'}
        ];

        ctrl.performAction = function (action) {
          $mdBottomSheet.hide(action);
        };
      }
    }

    function showSimpleToast(title) {
      $mdToast.show(
        $mdToast.simple()
          .content(title)
          .hideDelay(2000)
          .position('top right')
      );
    }
  }

})();
