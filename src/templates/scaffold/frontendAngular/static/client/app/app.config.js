'use strict';


angular.module('angularDemoApp.config', [])
  .constant('appConstants', {
    dateFormat: 'dd.MM.yyyy',
    dateTimeFormat: 'dd.MM.yyyy HH:mm',
    modelDateTimeFormat: 'yyyy-MM-ddTHH:mm:ss',
    momentDateTimeFormat: 'YYYY-MM-DDTHH:mm:ss', //moment.js use for date editing
    showMomentDateFormat: 'DD.MM.YYYY',
    showMomentDateTimeFormat: 'DD.MM.YYYY HH:mm'
  })
  .config(function ($mdThemingProvider,
                    $mdIconProvider) {
    $mdThemingProvider.theme('default')
      .primaryPalette('light-blue')
      .accentPalette('light-green')
      .warnPalette('red');


    $mdIconProvider.icon('user', 'assets/images/user.svg', 64);
  });



