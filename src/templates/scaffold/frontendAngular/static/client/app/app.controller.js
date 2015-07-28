'use strict';

angular.module('angularDemoApp')
  .controller('AppController', function ($scope, $state, $translate, $localStorage, $window, Fullscreen, AutocompleteService, SessionService, MenuService, $mdSidenav, $timeout) {

    $scope.menu = MenuService;
    $scope.state = $state
    $scope.path = path;
    $scope.goHome = goHome;
    $scope.openMenu = openMenu;
    $scope.closeMenu = closeMenu;
    $scope.isSectionSelected = isSectionSelected;

    // Methods used by menuLink and menuToggle directives
    this.isOpen = isOpen;
    this.isSelected = isSelected;
    this.toggleOpen = toggleOpen;
    this.autoFocusContent = false;

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


    var isIE = !!navigator.userAgent.match(/MSIE/i);
      isIE && angular.element($window.document.body).addClass('ie');
      isSmartDevice( $window ) && angular.element($window.document.body).addClass('smart');

      // config
      $scope.app = {
        settings: {
          themeID: 1,
          navbarHeaderColor: 'bg-black',
          navbarCollapseColor: 'bg-white-only',
          asideColor: 'bg-black',
          headerFixed: true,
          asideFixed: true,
          asideFolded: false,
          asideDock: false,
          container: false
        }
      }

      // save settings to local storage
      if ( angular.isDefined($localStorage.settings) ) {
        $scope.app.settings = $localStorage.settings;
      } else {
        $localStorage.settings = $scope.app.settings;
      }
      $scope.$watch('app.settings', function(){
        if( $scope.app.settings.asideDock  &&  $scope.app.settings.asideFixed ){
          // aside dock and fixed must set the header fixed.
          $scope.app.settings.headerFixed = true;
        }
        // for box layout, add background image
        $scope.app.settings.container ? angular.element('html').addClass('bg') : angular.element('html').removeClass('bg');
        // save to local storage
        $localStorage.settings = $scope.app.settings;
      }, true);

      // angular translate
      $scope.lang = { isopen: false };
      $scope.langs = {en:'English', de_DE:'German', it_IT:'Italian'};
      $scope.selectLang = $scope.langs[$translate.proposedLanguage()] || "English";
      $scope.setLang = function(langKey, $event) {
        // set the current lang
        $scope.selectLang = $scope.langs[langKey];
        // You can change the language during runtime
        $translate.use(langKey);
        $scope.lang.isopen = !$scope.lang.isopen;
      };

      function isSmartDevice( $window )
      {
          // Adapted from http://www.detectmobilebrowsers.com
          var ua = $window['navigator']['userAgent'] || $window['navigator']['vendor'] || $window['opera'];
          // Checks for iOs, Android, Blackberry, Opera Mini, and Windows mobile devices
          return (/iPhone|iPod|iPad|Silk|Android|BlackBerry|Opera Mini|IEMobile/).test(ua);
      }


    $scope.goFullscreen = function () {
      if (Fullscreen.isEnabled()) {
        Fullscreen.cancel();
      } else {
        Fullscreen.all();
      }
    };

    $scope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
      // to be used for back button //won't work when page is reloaded.
      $scope.previousStateName = fromState.name;
      $scope.previousStateParams = fromParams;
    });
    //back button function called from back button's ng-click='back()'
    $scope.back = function () {
      if ($scope.previousStateName) {
        $state.go($scope.previousStateName, $scope.previousStateParams);
      } else {
        $state.go('^.list');
      }
    };

    $scope.username = SessionService.getCurrentUser().login;
    $scope.autocompleteService = AutocompleteService;

    $scope.openedSubmenuId = 0;
    $scope.openSubmenu = function (submenuId) {
      $scope.openedSubmenuId = submenuId;
      this.$parent.isOpen0 = true;
    }

  });
