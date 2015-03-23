'use strict';

angular.module('angularDemoApp')
    .controller('${domainClass.shortName}ViewController', function (\$scope, \$state, \$stateParams, \$translate, inform, ${domainClass.shortName}Service, ${domainClass.propertyName}Data) {
	 	\$scope.${domainClass.propertyName} = ${domainClass.propertyName}Data;

		\$scope.delete${domainClass.shortName} = function(instance){
			return ${domainClass.shortName}Service.deleteInstance(instance).then(function(instance){
				\$state.go('^.list');
				return instance;
			});
		};
	});
