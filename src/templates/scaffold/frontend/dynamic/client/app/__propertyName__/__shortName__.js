'use strict';

angular.module('angularDemoApp')
	.config(function (\$stateProvider) {
\$stateProvider
		.state('${domainClass.propertyName}', {
			url: '/${domainClass.propertyName}/list',
			templateUrl: 'app/${domainClass.propertyName}/${domainClass.propertyName}.list.html',
			controller: '${domainClass.shortName}ListCtrl'
		}).state('${domainClass.propertyName}.create',{
			url: '/${domainClass.propertyName}/create',
			templateUrl: 'app/${domainClass.propertyName}/${domainClass.propertyName}.create.html',
			controller: '${domainClass.shortName}CreateCtrl'
		}).state('${domainClass.propertyName}.edit',{
			url: '/${domainClass.propertyName}/edit',
			templateUrl: 'app/${domainClass.propertyName}/${domainClass.propertyName}.edit.html',
			controller: '${domainClass.shortName}EditCtrl'
		}).state('${domainClass.propertyName}.view',{
			url: '/${domainClass.propertyName}/view',
			templateUrl: 'app/${domainClass.propertyName}/${domainClass.propertyName}.view.html',
			controller: '${domainClass.shortName}ViewCtrl'
		});
});