'use strict';

angular.module('angularDemoApp')
    .controller('${domainClass.shortName}ViewController', function (\$scope, \$state, \$stateParams, \$translate, inform,
            ${domainClass.shortName}Service, ${domainClass.propertyName}Data,\$mdDialog) {
	 	\$scope.${domainClass.propertyName} = ${domainClass.propertyName}Data;

		if(\$state.current.data){
			\$scope.isModal = \$state.current.data.isModal;
		}

		\$scope.delete${domainClass.shortName} = function(instance){
			return ${domainClass.shortName}Service.deleteInstance(instance).then(function(instance){
				\$state.go('^.list');
				return instance;
			});
		};
		\$scope.go = function(route){
			\$state.go(route);
		};
		\$scope.closeItemViewer = function () {
			\$mdDialog.hide();
		};
	});
