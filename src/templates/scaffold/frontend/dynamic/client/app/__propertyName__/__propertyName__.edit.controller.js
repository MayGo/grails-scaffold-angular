'use strict';

angular.module('angularDemoApp')
    .controller('${domainClass.shortName}EditCtrl', function (\$scope, ${domainClass.shortName}Service) {
		 \$scope.${domainClass.propertyName} = ${domainClass.shortName}Service.get({id:1});
	
	    \$scope.submit = function() {
	        \$scope.${domainClass.propertyName}.\$update(function() {
	            //updated in the backend
	            console.log("updated");
	        });
	    };
	
	 /*   \$(".form-validate").validate({
	        errorPlacement: function(error, element){
	            error.insertAfter(element);
	        }
	    });*/
	});
