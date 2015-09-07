'use strict';

angular.module('angularDemoApp')
	.config(function (\$stateProvider) {
\$stateProvider
		.state('app.${domainClass.propertyName}', {
		    url: '/${domainClass.propertyName}',
			abstract: true,
		    template: '<div ui-view="page" class="fade-in-up"></div>'
		})
		.state('app.${domainClass.propertyName}.list', {
			url: '/list?search',//TODO: search so that search is not an object in url
			views: {
				'page@app.${domainClass.propertyName}': {
					templateUrl: 'app/${domainClass.propertyName}/${domainClass.propertyName}.list.html',
					controller: '${domainClass.shortName}ListController'
				}
			}
		}).state('app.${domainClass.propertyName}.create',{
			url: '/create',
			ncyBreadcrumb: {
				parent: 'app.${domainClass.propertyName}.list'
			},
			views: {
				'page@app.${domainClass.propertyName}': {
					templateUrl: 'app/${domainClass.propertyName}/${domainClass.propertyName}.form.html',
					controller: '${domainClass.shortName}EditController'
				}
			},
			resolve:{
				${domainClass.propertyName}Data: function(\$stateParams, ${domainClass.shortName}Service) {
					return new ${domainClass.shortName}Service();
				}
			}
		}).state('app.${domainClass.propertyName}.view',{
			url: '/view/:id',
			ncyBreadcrumb: {
				parent: 'app.${domainClass.propertyName}.list'
			},
			views: {
				'page@app.${domainClass.propertyName}': {
					templateUrl: 'app/${domainClass.propertyName}/${domainClass.propertyName}.view.html',
					controller: '${domainClass.shortName}ViewController'
				}
			},
			resolve:{
				${domainClass.propertyName}Data: function(\$stateParams, ${domainClass.shortName}Service){
					return ${domainClass.shortName}Service.get({id:\$stateParams.id}).\$promise.then(
						function( response ){
							return response;
						}
					);
				}
			}
		}).state('app.${domainClass.propertyName}.view.edit',{
			url: '/edit',
			views: {
				'page@app.${domainClass.propertyName}': {
					templateUrl: 'app/${domainClass.propertyName}/${domainClass.propertyName}.form.html',
					controller: '${domainClass.shortName}EditController',
				}
			},
			resolve:{
				${domainClass.propertyName}Data: function(\$stateParams, ${domainClass.shortName}Service){
					return ${domainClass.shortName}Service.get({id:\$stateParams.id}).\$promise.then(
						function( response ){
								return response;
						}
					);
				}
			}
		})

<%
allProps = scaffoldingHelper.getProps(domainClass)
modalRoutesDomainClasses = allProps.grep{p->p.manyToOne || p.oneToOne}.collect{it.referencedDomainClass}.unique()
modalRoutesDomainClasses.each{domainCl->
%>
	.state('app.${domainClass.propertyName}.view.${domainCl.propertyName}Modal',{
		url: '/modal/${domainCl.propertyName}/:modalId',
		data:{
			isModal:true
		},
		onEnter: function(\$stateParams, \$state, \$mdDialog) {
			var modalId = \$stateParams.modalId;
			\$mdDialog.show({
				templateUrl: 'app/${domainCl.propertyName}/${domainCl.propertyName}.view.modal.html',
				resolve: {
					${domainCl.propertyName}Data: function(\$stateParams, ${domainCl.shortName}Service){
						//TODO: Add parent (\$stateParams.id) to query
						return ${domainCl.shortName}Service.get({id:modalId}).\$promise.then(
							function( response ){
								return response;
							}
						);
					}
				},
				controller: '${domainCl.shortName}ViewController',

			}).then(function () {
				\$state.go('^');
			});
		}

	}).state('app.${domainClass.propertyName}.view.edit.${domainCl.propertyName}SearchModal',{
		templateUrl: 'app/${domainCl.propertyName}/${domainCl.propertyName}.list.modal.html',
		controller: '${domainCl.shortName}ListController'
	})
	<%}%>
<%
relationsProps = scaffoldingHelper.findRelationsProps(domainClass, domainClasses as List).collect{it.value}.unique()
relationsProps.each{domainCl->
	%>
		.state('app.${domainClass.propertyName}.view.${domainCl.propertyName}',{
			url: '/${domainCl.propertyName}/:relationName',
			ncyBreadcrumb: {
				skip: true
			},
			data:{
				isTab:true
			},
			views: {
				'tabs': {
					templateUrl: 'app/${domainCl.propertyName}/${domainCl.propertyName}.list.html',
					controller: '${domainCl.shortName}ListController'
				}
			}
		})
	<%}%>
;
});