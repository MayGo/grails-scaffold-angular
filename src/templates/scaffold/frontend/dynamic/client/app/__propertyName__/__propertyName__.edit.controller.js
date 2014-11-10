'use strict';

angular.module('angularDemoApp')
    .controller('${domainClass.shortName}EditCtrl', function (\$scope, \$stateParams, ${domainClass.shortName}, inform) {
		 \$scope.${domainClass.propertyName} = ${domainClass.shortName}.get({id:\$stateParams.id});
	
	    \$scope.submit = function() {
	        \$scope.${domainClass.propertyName}.\$update(function() {
	            inform.add("Updated ${domainClass.shortName}", {
	            	  "type": "success"
	            	});
	        });
	    };
      
	});
