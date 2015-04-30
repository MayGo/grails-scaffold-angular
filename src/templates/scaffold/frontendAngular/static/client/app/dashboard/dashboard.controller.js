'use strict';

angular.module('angularDemoApp')
  .controller('DashboardController', function ($scope, lastInsertedList, totalInsertedList, ngTableParams) {

    var lastinsertedCollection = lastInsertedList;
    $scope.totalInsertedCollection = totalInsertedList;
    $scope.tableParams = new ngTableParams({
      page: 1,
      count: 20
    }, {
      total: lastinsertedCollection.length,
      getData: function ($defer, params) {
        $defer.resolve(lastinsertedCollection.slice((params.page() - 1) * params.count(), params.page() * params.count()));
      }
    });
  });
