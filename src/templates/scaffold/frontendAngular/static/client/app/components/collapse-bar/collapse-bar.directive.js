'use strict';

function CollapseBar() {
  return {

    controller: 'CollapseBarController',
    controllerAs: 'collapseCtrl',
    transclude: true,
    scope: {
      id: '@',
      isToggleOpen: '@?',
      title: '@?'
    },
    bindToController: true,
    templateUrl: 'app/components/collapse-bar/collapse-bar.tmpl.html'
  };
}

angular
  .module('angularDemoApp.common.components')
  .directive('collapseBar', CollapseBar);
