'use strict';

angular.module('angularDemoApp')
    .controller('${domainClass.shortName}ViewCtrl', function (\$scope, ${domainClass.shortName}Service) {
	 	\$scope.${domainClass.propertyName} = ${domainClass.shortName}Service.get({id:1});

	});
