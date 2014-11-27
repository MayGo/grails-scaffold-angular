'use strict';

angular.module('angularDemoApp')
	.controller('${domainClass.shortName}ListCtrl', function (\$scope, \$stateParams, ${domainClass.shortName}, inform) {
		
	\$scope.delete${domainClass.shortName} = function(${domainClass.shortName}) { 
		${domainClass.shortName}.\$delete(function() {
				inform.add("Deleted ${domainClass.naturalName}", {"type": "warning"});	
		});
	};
	\$scope.isLoading = false;
	\$scope.rowCollection = [];
	
	\$scope.callServer = function getData(tableState, tableController) {
		
		var query = {max: \$scope.stTable.itemsByPage, offset: tableState.pagination.start};
		if (tableState.sort.predicate) {
			query.order = tableState.sort.reverse ? 'asc' : 'desc';
			query.sort = tableState.sort.predicate;
		}
		if(\$stateParams.search)tableState.search.predicateObject = \$stateParams.search;
		var searchParams = tableState.search.predicateObject || \$stateParams.search;
		if (searchParams) {
			query.filter = {};
			angular.forEach(searchParams, function(value, key) {
				this[key] = value;
			}, query.filter);
		}
	
		${domainClass.shortName}.query(query, function(response, responseHeaders){
			\$scope.isLoading = false;
			\$scope.rowCollection = response;
			tableState.pagination.numberOfPages = Math.ceil(responseHeaders().total / tableState.pagination.number);
		});
	};
	

});
