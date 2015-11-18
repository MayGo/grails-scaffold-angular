angular
  .module('angularDemoApp')
  .factory('CustomHttpInterceptor', function ($q, logger, FormUtils) {
    function interceptor(rejection) {

      try {
        if (rejection.status === 401) {
         // $rootScope.$emit('show-relogin-modal');
        } else if (rejection.status === 403) {
        /*  $translate('pages.session.messages.forbidden').then(function (msg) {
            logger.info(msg);
          });*/
        } else if (rejection.status === 422) {
          logger.debug('Status 422');

          if (rejection.data.errors) {
            logger.debug('Server validation errors:', rejection.data.errors);
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

                logger.debug('Add validation error to field: ' + fieldName);
                controller.setExternalValidation(null, error.message, true);
              } else {
                logger.info(error.message);
              }
            });

            // Focus elements after DOM changes are loaded.
            if (focusFirstField) {
             // $timeout(function () {
                FormUtils.focusField(focusFirstField);
             // });
            }
          }
        } else if (rejection.config) {
          var msg = 'Network error (' + rejection.status + '): ' + rejection.statusText + ' for url:' + rejection.config.url;
          logger.info(msg);

        } else {
          logger.info('Error (' + rejection.message + '): ');
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
    $httpProvider.interceptors.push('CustomHttpInterceptor');
  });
