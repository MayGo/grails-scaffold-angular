'use strict';

angular.module('angularDemoApp')
  .controller('AppController', function ($scope, $state, $translate, $localStorage, $window, Fullscreen, AutocompleteService, SessionService) {
    var isSmartDevice = function ($window) {
      // Adapted from http://www.detectmobilebrowsers.com
      var ua = $window.navigator.userAgent || $window.navigator.vendor || $window.opera;
      // Checks for iOs, Android, Blackberry, Opera Mini, and Windows mobile devices
      return (/iPhone|iPod|iPad|Silk|Android|BlackBerry|Opera Mini|IEMobile/).test(ua);
    };

    $scope.username = SessionService.getCurrentUser().login;
    $scope.autocompleteService = AutocompleteService;

    // add 'ie' classes to html
    var isIE = !!navigator.userAgent.match(/MSIE/i);
    if (isIE) {
      angular.element($window.document.body).addClass('ie');
    }
    if (isSmartDevice($window)) {
      angular.element($window.document.body).addClass('smart');
    }

    // config


    $scope.app = {
      version: '1.3.2',

      // for chart colors
      color: {
        primary: '#7266ba',
        info: '#23b7e5',
        success: '#27c24c',
        warning: '#fad733',
        danger: '#f05050',
        light: '#e8eff0',
        dark: '#3a3f51',
        black: '#1c2b36'
      },
      settings: {
        themeID: 1,
        navbarHeaderColor: 'bg-black',
        navbarCollapseColor: 'bg-white-only',
        asideColor: 'bg-black',
        headerFixed: true,
        asideFixed: false,
        asideFolded: false,
        asideDock: false,
        container: false
      }
    };

    // save settings to local storage
    if (angular.isDefined($localStorage.settings)) {
      $scope.app.settings = $localStorage.settings;
    } else {
      $localStorage.settings = $scope.app.settings;
    }
    $scope.$watch('app.settings', function () {
      if ($scope.app.settings.asideDock && $scope.app.settings.asideFixed) {
        // aside dock and fixed must set the header fixed.
        $scope.app.settings.headerFixed = true;
      }
      // save to local storage
      $localStorage.settings = $scope.app.settings;
    }, true);

    // angular translate
    $scope.lang = {isopen: false};
    $scope.langs = {'en': 'English', 'de_DE': 'German', 'it_IT': 'Italian'};
    $scope.selectLang = $scope.langs[$translate.proposedLanguage()] || 'English';
    $scope.setLang = function (langKey) {
      // set the current lang
      $scope.selectLang = $scope.langs[langKey];
      // You can change the language during runtime
      $translate.use(langKey);
      $scope.lang.isopen = !$scope.lang.isopen;
    };


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


  });
