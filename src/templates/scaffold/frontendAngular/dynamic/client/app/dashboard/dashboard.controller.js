'use strict';

angular.module('angularDemoApp')
  .controller('DashboardController', function (\$scope, \$http, appConfig) {
    \$scope.lastinsertedCollection = [].concat(\$scope.lastinsertedCollectionSafe);
	\$http.get(appConfig.restUrl + 'statistics/lastInserted').success(function(lastinsertedCollection) {
      \$scope.lastinsertedCollectionSafe = lastinsertedCollection;
	});
	
	\$scope.totalInsertedCollection = [];
	\$http.get(appConfig.restUrl + 'statistics/totalInserted').success(function(totalInsertedCollection) {
      \$scope.totalInsertedCollection = totalInsertedCollection;
	});

  });
