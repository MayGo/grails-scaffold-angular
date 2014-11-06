'use strict';

angular.module('angularDemoApp')
	.controller('${domainClass.shortName}ListCtrl', function (\$scope) {
	\$scope.message = 'Hello';
});

/*App.controller('List${domainClass.shortName}Controller', ['\$scope', '\$routeParams',  '${domainClass.shortName}', function (\$scope, \$routeParams, ${domainClass.shortName}){
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
        if (popupService.showPopup('Really delete this?')) {
        	${domainClass.propertyName}.\$delete(function() {
            \$window.location.href = ''; //redirect to home
          });
        }
      };
}]);*/