'use strict';

angular.module('angularDemoApp').factory('ItemSelectorService', function ($stateParams, $state, $modal, $rootScope) {

  var selectedItem;
  var updateModel;
  var service = {};
  var modalInstance;

  service.closeModal = function (item) {
    if (modalInstance) {
      modalInstance.close(item);
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
    modalInstance.result.then(function (item) {
      if (item) {
        settings.scope.updateModel = item;
      }
    })

  }

  return service;
});
