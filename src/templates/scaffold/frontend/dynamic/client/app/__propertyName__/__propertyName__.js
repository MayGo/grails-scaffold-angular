'use strict';

angular.module('angularDemoApp')
	.config(function (\$stateProvider) {
\$stateProvider
		.state('app.${domainClass.propertyName}', {
		    url: '/${domainClass.propertyName}',
		    template: '<div ui-view class="fade-in-up"></div>'
		})
		.state('app.${domainClass.propertyName}.list', {
			url: '/list?search',//TODO: search so that search is not an object in url
			templateUrl: 'app/${domainClass.propertyName}/${domainClass.propertyName}.list.html',
			controller: '${domainClass.shortName}ListController'
		}).state('app.${domainClass.propertyName}.create',{
			url: '/create',
			templateUrl: 'app/${domainClass.propertyName}/${domainClass.propertyName}.form.html',
			controller: '${domainClass.shortName}EditController'
		}).state('app.${domainClass.propertyName}.edit',{
			url: '/edit/:id',
			templateUrl: 'app/${domainClass.propertyName}/${domainClass.propertyName}.form.html',
			controller: '${domainClass.shortName}EditController'
		}).state('app.${domainClass.propertyName}.view',{
			url: '/view/:id',
			templateUrl: 'app/${domainClass.propertyName}/${domainClass.propertyName}.view.html',
			controller: '${domainClass.shortName}ViewController'
		});
		
});