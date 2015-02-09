'use strict';

angular.module('angularDemoApp')
  .controller('DashboardController', function ($scope, lastInsertedList, totalInsertedList) {
	$scope.lastinsertedCollectionSafe = lastInsertedList;
	$scope.totalInsertedCollection = totalInsertedList;
  });
