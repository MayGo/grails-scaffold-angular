'use strict';

function CollapseBarController() {
  //-- private variables
  var ctrl = this;

  //-- public variables

  //Konverteerime boolean-iks

  ctrl.isOpen = (ctrl.isToggleOpen !== 'false');

  if (!ctrl.title) {
    ctrl.title = 'pages.' + ctrl.id + '.title';
  }

  //-- public methods
}

angular
  .module('angularDemoApp.common.components')
  .controller('CollapseBarController', CollapseBarController);
