'use strict';

angular.module('angularDemoApp')
	.controller('${domainClass.shortName}ListController', function (\$scope, \$q, ${domainClass.shortName}, \$translate, inform) {
		
	\$scope.delete${domainClass.shortName} = function(${domainClass.shortName}) {
		var deferred = \$q.defer();	
		${domainClass.shortName}.\$delete(
			function() {
				\$translate('pages.${domainClass.shortName}.messages.delete').then(function (msg) {
					inform.add(msg, {'type': 'warning'});
				});
					
				var index = \$scope.rowCollection.indexOf(${domainClass.shortName});
				if (index !== -1) {
					\$scope.rowCollection.splice(index, 1);
				}
				deferred.resolve(true);
			},
			function(response){
				console.log("Could not delete item.");
				deferred.reject(response);
		    }
		);
		return deferred.promise;
	};
	\$scope.isLoading = false;
	\$scope.rowCollection = [];
	
	\$scope.callServer = function (tableState) {
		
		var query = {max: \$scope.stTable.itemsByPage, offset: tableState.pagination.start};
		if (tableState.sort.predicate) {
			query.order = tableState.sort.reverse ? 'asc' : 'desc';
			query.sort = tableState.sort.predicate;
		}

		var searchParams = tableState.search.predicateObject;
		if (searchParams) {
			query.filter = {};
			angular.forEach(searchParams, function(value, key) {
				if(!_.isEmpty(value)){
					this[key] = value;
				}
			}, query.filter);
		}
		
		if(!\$scope.skipFirstQueryInEmbeddedView ){
			${domainClass.shortName}.query(query, function(response, responseHeaders){
				\$scope.isLoading = false;
				\$scope.rowCollection = response;
				tableState.pagination.numberOfPages = Math.ceil(responseHeaders().total / tableState.pagination.number);
			});
		}else{
			\$scope.skipFirstQueryInEmbeddedView = null;
		}
	};

});
//Simple Controller to make new scope for ListController
angular.module('angularDemoApp')
	.controller('${domainClass.shortName}EmbeddedListController', function (\$scope) {
	\$scope.isEmbeddedView = true;
	\$scope.skipFirstQueryInEmbeddedView = true;
});

