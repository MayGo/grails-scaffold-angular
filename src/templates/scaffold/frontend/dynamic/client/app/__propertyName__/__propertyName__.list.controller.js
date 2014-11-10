'use strict';

angular.module('angularDemoApp')
	.controller('${domainClass.shortName}ListCtrl', function (\$scope, ${domainClass.shortName}, inform) {
		\$scope.currentPage = 1;
		\$scope.maxPagerSize = 10;
	
		\$scope.perPageSizes = [
		    {value: 10},
		    {value: 20},
		    {value: 50},
		    {value: 100},
		    {value: 150}
		];
		\$scope.itemsPerPageSelected = \$scope.perPageSizes[1];
		\$scope.itemsPerPage =  \$scope.itemsPerPageSelected.value;
		\$scope.updateItemsPerPage = function () {
		    \$scope.itemsPerPage = \$scope.itemsPerPageSelected.value;
		};
		
		
		\$scope.pageChanged = function() {
		    var offset = (\$scope.currentPage - 1) * \$scope.itemsPerPage;
		    \$scope.${domainClass.propertyName}s = ${domainClass.shortName}.query({offset: offset, max:\$scope.itemsPerPage}, function(u, responseHeaders){
		        \$scope.totalItems = responseHeaders().total;
		    });
		};
		\$scope.pageChanged();
		
	    \$scope.delete${domainClass.shortName} = function(${domainClass.propertyName}) { 
	    	${domainClass.propertyName}.\$delete(function() {
	    			inform.add("Deleted ${domainClass.shortName}", {
	            	  "type": "warning"
	            	});	
	    			\$scope.pageChanged();
	            })
	    };
	});
