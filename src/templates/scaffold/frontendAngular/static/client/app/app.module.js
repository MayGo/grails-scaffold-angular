'use strict';
angular.module('angularDemoApp', [
  'ngAnimate',

  'ngResource',
  'ngSanitize',
  'ngStorage',
  'ui.router',
  'ui.bootstrap.dropdown',

  'jcs-autoValidate',
  'ngTable',
  'FBAngular',
  'satellizer',

  'permission',
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
  'angularDemoApp.config',
  'angularDemoApp.runtime-config',
  'blocks.logger',
  'blocks.exception'
]);

angular.module('angularDemoApp.config', ['blocks.logger',
  'blocks.exception']);
angular.module('angularDemoApp.common', []);
angular.module('angularDemoApp.common.filters', ['ngSanitize']);
angular.module('angularDemoApp.templates', []);
angular.module('angularDemoApp.common.services', ['angularDemoApp.config', 'ngResource', 'ngMaterial', 'ui.router',
  'pascalprecht.translate']);
angular.module('angularDemoApp.common.components', ['angularDemoApp.common.services', 'angularDemoApp.common.filters',
  'ngAria', 'ngMaterial', 'pascalprecht.translate', 'blocks.logger',
  'blocks.exception']);
