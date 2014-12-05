'use strict';

angular.module('angularDemoApp')
    .controller('${domainClass.shortName}ViewController', function (\$scope, \$state, \$stateParams, \$translate, inform, ${domainClass.shortName}) {
	 	\$scope.${domainClass.propertyName} = ${domainClass.shortName}.get({id:\$stateParams.id});
	 	\$scope.delete${domainClass.shortName} = function(${domainClass.shortName}) { 
			${domainClass.shortName}.\$delete(function() {
				\$translate('pages.${domainClass.shortName}.messages.delete').then(function (msg) {
			    	inform.add(msg, {'type': 'warning'});
			    	\$state.go('^.list');
				});
			});
		};

	});