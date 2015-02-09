'use strict';

angular.module('angularDemoApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('app.search', {
        url: '/search',
        templateUrl: 'app/search/search.html',
        controller: 'SearchController'
      });
  });