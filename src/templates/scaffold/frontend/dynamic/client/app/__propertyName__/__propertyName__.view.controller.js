'use strict';

angular.module('angularDemoApp')
    .controller('${domainClass.shortName}ViewCtrl', function (\$scope, \$stateParams, ${domainClass.shortName}) {
	 	\$scope.${domainClass.propertyName} = ${domainClass.shortName}.get({id:\$stateParams.id});

	});
