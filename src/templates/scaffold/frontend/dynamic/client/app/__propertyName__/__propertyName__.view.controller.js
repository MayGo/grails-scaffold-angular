'use strict';

angular.module('angularDemoApp')
    .controller('${domainClass.shortName}ViewController', function (\$scope, \$stateParams, ${domainClass.shortName}) {
	 	\$scope.${domainClass.propertyName} = ${domainClass.shortName}.get({id:\$stateParams.id});

	});
