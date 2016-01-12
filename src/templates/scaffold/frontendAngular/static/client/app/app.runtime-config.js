'use strict';

angular.module('angularDemoApp.runtime-config', ['angularDemoApp.config',
    'ngCookies', 'unsavedChanges',
    'angular-loading-bar', 'ncy-angular-breadcrumb', 'pascalprecht.translate', 'tmh.dynamicLocale'])

  .config(function (cfpLoadingBarProvider) {
    cfpLoadingBarProvider.includeSpinner = true;
    cfpLoadingBarProvider.includeBar = true;
    cfpLoadingBarProvider.latencyThreshold = 150;
  })
  .config(function (unsavedWarningsConfigProvider) {

    //TODO: https://github.com/facultymatt/angular-unsavedChanges teha ticket $translate promise kasutamiseks.
    var msg = 'Te kaotate salvestamata muudatused, kui lahkute lehelt';
    unsavedWarningsConfigProvider.navigateMessage = msg;
    unsavedWarningsConfigProvider.reloadMessage = msg;
    unsavedWarningsConfigProvider.useTranslateService = false;
    unsavedWarningsConfigProvider.routeEvent = '$stateChangeStart';

  })

  .config(function ($translateProvider) {
    // Register a loader for the static files
    // So, the module will search missing translation tables under the specified urls.
    // Those urls are [prefix][langKey][suffix].
    $translateProvider.useStaticFilesLoader({
      prefix: 'l10n/',
      suffix: '.json'
    });

    // Tell the module what language to use by default
    $translateProvider.preferredLanguage('en');

    // Tell the module to store the language in the local storage
    $translateProvider.useLocalStorage();
    $translateProvider.useSanitizeValueStrategy('escaped');
  })

  .config(function ($mdThemingProvider) {
    $mdThemingProvider.theme('default')
      .primaryPalette('light-blue', {
        default: '800',
        'hue-1': '200',
        'hue-2': '100',
        'hue-3': '50'
      })
      .accentPalette('green', {
        default: '700'
      })
      .warnPalette('red', {
        default: '500'
      });
      /*.backgroundPalette('grey', {
        default: '50'
      });*/
  })

  .config(function ($breadcrumbProvider) {
    $breadcrumbProvider.setOptions({
      templateUrl: 'app/blocks/breadcrumbs.html'
    });
  })

  .config(function (tmhDynamicLocaleProvider) {
    tmhDynamicLocaleProvider.localeLocationPattern('bower_components/angular-i18n/angular-locale_{{locale}}.js');
  })

  .run(function ($filter, validator, materialElementModifier, defaultErrorMessageResolver) {

    validator.registerDomModifier(materialElementModifier.key, materialElementModifier);
    validator.setDefaultElementModifier(materialElementModifier.key);

    defaultErrorMessageResolver.setI18nFileRootPath('l10n');
    defaultErrorMessageResolver.setCulture('en');
  })

  .run(function ($rootScope, $state, tmhDynamicLocale, logger) {

    $rootScope.$on('$translateChangeSuccess', function (event, data) {
      // asking angular-dynamic-locale to load and apply proper AngularJS $locale setting
      tmhDynamicLocale.set(data.language.toLowerCase().replace(/_/g, '-'));
    });

    $rootScope.$on('$stateChangeError', function (e, toPage) {
      logger.error('State Change Error', [e, toPage]);
      var stateParams = {};
      stateParams.messageCode = 'pages.session.messages.state-change-error';
      stateParams.url = toPage.url;

      var errorState = 'app.error';

      if (toPage.name !== errorState) {
        $state.go(errorState, stateParams, {location: false});
      } else {
        logger.info('State Change Error: There is application error');
      }
    });

    $rootScope.$on('$stateChangePermissionDenied', function (e, toPage) {
      logger.info('State Change Permission Denied');

      var stateParams = {};
      stateParams.messageCode = 'pages.session.messages.permission-denied';
      stateParams.url = toPage.url;
      $state.go('app.error', stateParams, {location: false});
    });

  })
  .run(function (Permission, SessionService) {

    Permission
      .defineRole('ROLE_USER', function () {
        return SessionService.hasRole('ROLE_USER');
      })
      .defineRole('ROLE_ADMIN', function () {
        return SessionService.hasRole('ROLE_ADMIN');
      });
  });
