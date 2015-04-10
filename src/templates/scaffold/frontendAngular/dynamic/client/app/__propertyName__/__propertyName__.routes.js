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
			controller: '${domainClass.shortName}EditController',
			resolve:{
				${domainClass.propertyName}Data: function(\$stateParams, ${domainClass.shortName}Service) {
					return new ${domainClass.shortName}Service();
				}
			}
		}).state('app.${domainClass.propertyName}.edit',{
			url: '/edit/:id',
			templateUrl: 'app/${domainClass.propertyName}/${domainClass.propertyName}.form.html',
			controller: '${domainClass.shortName}EditController',
			resolve:{
				${domainClass.propertyName}Data: function(\$stateParams, ${domainClass.shortName}Service){
					return ${domainClass.shortName}Service.get({id:\$stateParams.id}).\$promise.then(
						function( response ){
							return response;
						}
					);
				}
			}
		}).state('app.${domainClass.propertyName}.view',{
			url: '/view/:id',
			templateUrl: 'app/${domainClass.propertyName}/${domainClass.propertyName}.view.html',
			controller: '${domainClass.shortName}ViewController',
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
		onEnter: function(\$stateParams, \$state, \$modal, \$resource) {
			var modalId = \$stateParams.modalId
			\$modal.open({
				size:'lg',
				templateUrl: 'app/${domainCl.propertyName}/${domainCl.propertyName}.view.html',
				data:{
					isModal:true,
				},
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
			});
		}

	})
	<%}%>
<%
relationsProps = scaffoldingHelper.findRelationsProps(domainClass, domainClasses as List).collect{it.value}.unique()
relationsProps.each{domainCl->
	%>
		.state('app.${domainClass.propertyName}.view.${domainCl.propertyName}',{
			url: '/${domainCl.propertyName}/:relationName',
			templateUrl: 'app/${domainCl.propertyName}/${domainCl.propertyName}.list.html',
			controller: '${domainCl.shortName}ListController'
		})
	<%}%>
;
});