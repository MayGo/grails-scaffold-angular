'use strict';

angular.module('angularDemoApp')
    .controller('${domainClass.shortName}CreateCtrl', function (\$scope, ${domainClass.shortName}, inform) {
		 \$scope.${domainClass.propertyName} = new ${domainClass.shortName}();
	
	    \$scope.submit = function() {
	    	\$scope.${domainClass.propertyName}.\$save(function() {
	            inform.add("Created ${domainClass.shortName}", {
	            	  "type": "success"
	            	});
	        });
	    };
	
	});