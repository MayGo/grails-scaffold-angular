'use strict';

angular.module('angularDemoApp')
    .controller('${domainClass.shortName}ViewController', function (\$scope, \$state, \$stateParams, \$translate, inform, ${domainClass.shortName}) {
	 	\$scope.${domainClass.propertyName} = ${domainClass.shortName}.get({id:\$stateParams.id});

		\$scope.delete${domainClass.shortName} = function(instance){
			return ${domainClass.shortName}.deleteInstance(instance).then(function(instance){
				\$state.go('^.list');
				return instance;
			});
		};

	});