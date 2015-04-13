'use strict';

angular.module('angularDemoApp').factory('ItemSelectorService', function ($stateParams, $state, $modal, $rootScope) {

  var selectedItem;
  var updateModel;
  var service = {};
  var modalInstance;

  service.closeModal = function () {
    if (modalInstance) {
      modalInstance.close();
    }
    modalInstance = null;
  }

  service.openModal = function (settings) {
    selectedItem = null;
    updateModel = null;
    modalInstance = $modal.open({
      scope: settings.scope,
      size: 'lg',
      templateUrl: settings.templateUrl,
      controller: settings.controller
    })

    modalInstance.result.finally(function () {
      $rootScope.$emit('select-and-close-modal');
      $state.go('^');
    });
  }

  return service;
});
