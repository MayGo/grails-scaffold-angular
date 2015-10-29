'use strict';

angular.module('angularDemoApp', [
  'ngAnimate',
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngTouch',
  'ngStorage',
  'ui.router',
  'ui.bootstrap.dropdown',
  'pascalprecht.translate',
  'tmh.dynamicLocale',
  'jcs-autoValidate',
  'angular-loading-bar',
  'ngTable',
  'inform',
  'inform-exception',
  'FBAngular',
  'satellizer',
  'mgcrea.ngStrap.helpers.dimensions',
  'mgcrea.ngStrap.helpers.dateParser',
  'mgcrea.ngStrap.tooltip',
  'mgcrea.ngStrap.datepicker',
  'mgcrea.ngStrap.timepicker',
  'permission',
  'JSONedit',
  'ncy-angular-breadcrumb',
  'angularFileUpload',
  'ngAria',
  'ngMaterial',
  'mentio',
  'angularDemoApp.config',
  'angularDemoApp.common',
  'angularDemoApp.common.services',
  'angularDemoApp.common.components',
  'angularDemoApp.common.filters',
  'ngMask',
  'angular.filter',
  'unsavedChanges'
]);
angular.module('angularDemoApp')
  .config(function (unsavedWarningsConfigProvider) {

    //TODO: https://github.com/facultymatt/angular-unsavedChanges teha ticket $translate promise kasutamiseks.
    var msg = 'Te kaotate salvestamata muudatused, kui lahkute lehelt';
    unsavedWarningsConfigProvider.navigateMessage = msg;
    unsavedWarningsConfigProvider.reloadMessage = msg;
    unsavedWarningsConfigProvider.useTranslateService = false;
    unsavedWarningsConfigProvider.routeEvent = '$stateChangeStart';

  })
  .config(function ($datepickerProvider, appConstants) {
    angular.extend($datepickerProvider.defaults, {
      dateFormat: appConstants.dateFormat,
      autoclose: 1,
      container: 'body',
      modelDateFormat: appConstants.modelDateTimeFormat,
      dateType: 'string',
      timezone: null,
      startWeek: 1,
      template: 'datepicker/datepicker.with.today.tpl.html'
    });
  })
  .run(['$templateCache', function ($templateCache) {
    $templateCache.put('datepicker/datepicker.with.today.tpl.html', '<div class="dropdown-menu datepicker" ' +
      'ng-class="\'datepicker-mode-\' + $mode" style="max-width: 320px">' +
      '<table style="table-layout: fixed; height: 100%; width: 100%"><thead>' +
      '<tr class="text-center"><th>' +
      '<button tabindex="-1" type="button" class="btn btn-default pull-left" ng-click="$selectPane(-1)">' +
      '<i class="{{$iconLeft}}"></i></button></th>' +
      '<th colspan="{{ rows[0].length - 2 }}">' +
      '<button tabindex="-1" type="button" class="btn btn-default btn-block text-strong" ng-click="$toggleMode()">' +
      '<strong style="text-transform: capitalize" ng-bind="title"></strong></button></th>' +
      '<th><button tabindex="-1" type="button" class="btn btn-default pull-right" ng-click="$selectPane(+1)">' +
      '<i class="{{$iconRight}}"></i></button></th></tr><tr ng-if="showLabels" ng-bind-html="labels"></tr></thead>' +
      '<tfoot><tr><td colspan="2">' +
      '<button tabindex="-1" type="button" class="btn btn-info btn-today" style="width: 100%;margin-left:5px;" ' +
      'ng-click="dateCtrl.selectToday()"><span translate-once="datepicker.today"' +
      '></span></button>' +
      '</td></tr></tfoot>' +
      '<tbody><tr ng-repeat="(i, row) in rows" height="{{ 100 / rows.length }}%" >' +
      '<td class="text-center" ng-repeat="(j, el) in row" >' +
      '<button tabindex="-1" type="button" class="btn btn-default" style="width: 100%" ' +
      'ng-class="{\'btn-primary\': el.selected, \'btn-info btn-today\': el.isToday && !el.selected}" ' +
      'ng-click="$select(el.date)" ng-disabled="el.disabled"><span ng-class="{\'text-muted\': el.muted}" ' +
      'ng-bind="el.label"></span></button></td></tr></tbody></table></div>');
  }])

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

/*
  .factory('AuthHttpInterceptor', function ($q, $injector, $rootScope, $translate, inform, $log, FormUtils, $timeout) {
    function interceptor(rejection) {

      try {
        if (rejection.status === 401) {
          $rootScope.$emit('show-relogin-modal');
        } else if (rejection.status === 403) {
          $translate('pages.session.messages.forbidden').then(function (msg) {
            inform.add(msg, {type: 'danger', ttl: 0});
          });
        } else if (rejection.status === 422) {
          $log.debug('Status 422');

          if (rejection.data.errors) {
            $log.debug('Server validation errors:', rejection.data.errors);
            var controller;
            var focusFirstField;

            angular.forEach(rejection.data.errors, function (error) {
              var fieldNameParts = error.field.split('.');
              var fieldName = fieldNameParts[fieldNameParts.length - 1];
              var el = angular.element('#' + fieldName);

              if (el.length === 1) {
                controller = angular.element(el).controller('ngModel');
              }

              if (el.length === 1 && controller) {
                if (!focusFirstField) {
                  focusFirstField = el[0];
                }

                $log.log('Add validation error to field: ' + fieldName);
                controller.setExternalValidation(null, error.message, true);
              } else {
                inform.add(error.message, {ttl: -1, type: 'warning'});
              }
            });

            // Focus elements after DOM changes are loaded.
            if (focusFirstField) {
              $timeout(function () {
                FormUtils.focusField(focusFirstField);
              });
            }
          }
        } else if (rejection.config) {
          var msg = 'Network error (' + rejection.status + '): ' + rejection.statusText + ' for url:' + rejection.config.url;
          inform.add(msg, {type: 'danger', ttl: 0});
        } else {
          inform.add('Error (' + rejection.message + '): ', {type: 'danger', ttl: 0});
        }

      } catch (ex) {
        $log.error('$httpProvider', ex);
      }

      return $q.reject(rejection);
    }

    return {
      requestError: interceptor,
      responseError: interceptor
    };

  })

  .config(function ($httpProvider) {
    $httpProvider.interceptors.push('AuthHttpInterceptor');
  })
*/
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

  .run(function ($rootScope, $state, tmhDynamicLocale, $log) {

    $rootScope.$on('$translateChangeSuccess', function (event, data) {
      // asking angular-dynamic-locale to load and apply proper AngularJS $locale setting
      tmhDynamicLocale.set(data.language.toLowerCase().replace(/_/g, '-'));
    });

    $rootScope.$on('$stateChangeError', function (e, toPage) {
      $log.info('State Change Error', e, toPage);
      var stateParams = {};
      stateParams.messageCode = 'pages.session.messages.state-change-error';
      stateParams.url = toPage.url;

      var errorState = 'app.error';

      if (toPage.name !== errorState) {
        $state.go(errorState, stateParams, {location: false});
      } else {
        $log.info('State Change Error: There is application error');
      }
    });

    $rootScope.$on('$stateChangePermissionDenied', function (e, toPage) {
      $log.info('State Change Permission Denied');

      var stateParams = {};
      stateParams.messageCode = 'pages.session.messages.permission-denied';
      stateParams.url = toPage.url;
      $state.go('app.error', stateParams, {location: false});
    });

  }).run(function (Permission, SessionService) {

    Permission
      .defineRole('ROLE_USER', function () {
        return SessionService.hasRole('ROLE_USER');
      })
      .defineRole('ROLE_ADMIN', function () {
        return SessionService.hasRole('ROLE_ADMIN');
      });
  });
angular.module('angularDemoApp.common', []);
angular.module('angularDemoApp.common.filters', ['ngSanitize']);
angular.module('angularDemoApp.templates', []);
angular.module('angularDemoApp.common.services', ['angularDemoApp.config', 'ngResource']);
angular.module('angularDemoApp.common.components', ['angularDemoApp.common.services', 'angularDemoApp.common.filters', 'ngAria', 'ngMaterial', 'pascalprecht.translate']);
