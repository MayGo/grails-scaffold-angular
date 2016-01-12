(function () {
  'use strict';

  angular
    .module('blocks.logger')
    .factory('logger', logger);

  logger.$inject = ['$log', '$injector', '$document'];

  function logger($log, $injector, $document) {
    var $mdToast;

    function init() {
      //to prevent circular dependency
      if (!$mdToast) {
        $mdToast = $injector.get('$mdToast');
      }
    }

    var toastPosition = 'top right';

    function showToast(msg) {

      var toastConf = $mdToast.build({
        parent: $document[0].querySelector('#mainToastContainer'),
        template: '<md-toast><div flex>' + msg + '</div></md-toast>',
        controller: function ($scope) {
          $scope.msg = msg;
        },

        hideDelay: 6000,
        position: toastPosition
      });
      $mdToast.show(toastConf);

    }

    var service = {
      showToasts: true,

      error: error,
      info: info,
      success: success,
      warning: warning,
      debug: debug,

      // straight to console; bypass toastr
      log: $log.log
    };

    return service;

    /////////////////////

    function error(message, data) {
      init();
      $log.error('Error: ' + message, data);
      showToast(message);
    }

    function info(message, data) {
      init();

      $log.info('Info: ' + message, data);
      showToast(message);
    }

    function success(message, data) {
      init();
      $log.info('Success: ' + message, data);
      showToast(message);
    }

    function warning(message, data) {
      init();
      $log.warn('Warning: ' + message, data);
      showToast(message);
    }

    function debug(message, data) {
      init();
      $log.debug('Debug: ' + message, data);
    }
  }
}());
