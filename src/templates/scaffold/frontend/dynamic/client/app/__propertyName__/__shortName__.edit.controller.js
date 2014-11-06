'use strict';

angular.module('angularDemoApp')
    .controller('${domainClass.shortName}EditCtrl', function (\$scope) {
    \$scope.message = 'Hello';
});
/*
App.controller('Edit${domainClass.shortName}Controller', ['\$scope', '\$routeParams',  '${domainClass.shortName}', function (\$scope, \$routeParams, ${domainClass.shortName}){
    \$scope.${domainClass.propertyName} = ${domainClass.shortName}.get({id:1});

    \$scope.submit = function() {
        \$scope.${domainClass.propertyName}.\$update(function() {
            //updated in the backend
            console.log("updated");
        });
    };

    \$(".form-validate").validate({
        errorPlacement: function(error, element){
            error.insertAfter(element);
        }
    });
}]);*/
