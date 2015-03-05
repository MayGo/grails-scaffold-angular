module.exports = function(){
	angular.module('httpBackendMock', ['ngMockE2E'])
		.run(function(\$httpBackend, appConfig) {

			var url = appConfig.restUrl + '/${domainClass.propertyName.toLowerCase()}s/v1';
			\$httpBackend.whenPOST(url).respond(function(method, url){return [200, {'id' : 1}];});//create
			\$httpBackend.whenGET(url).respond(function(method, url){return [200, [{'id' : 1}]];});//list
			\$httpBackend.whenPOST(url + "/1").respond(function(method, url){return [200, {'id' : 1}];});//edit
			\$httpBackend.whenGET(url + "/1").respond(function(method, url){return [200, {'id' : 1}];});//view
			\$httpBackend.whenDELETE(url + "/1").respond(function(method, url){return [204];});//delete
			//Mock relations
<%

	import grails.plugin.scaffold.angular.DomainHelper
	allProps = scaffoldingHelper.getProps(domainClass)
	props = allProps.findAll{p->!p.embedded}


	props.each{property->
		if(property.isAssociation()){
			def domainCl = property.referencedDomainClass
			Map useDisplaynames = scaffoldingHelper.getDomainClassDisplayNames(domainCl, property)
			def inst = DomainHelper.createOrGetInst(domainCl, 1)
			useDisplaynames['id'] = null
			List useDisplaynamesWithValues = useDisplaynames.collect{key, value->
			def val = inst?."${key}"
				if(key == 'id') val = 1
				return "'" + key + "': '" + val + "'"
			}
			useDisplaynamesWithValues.unique(true)
	%>
			var ${property.name}Url =/.*\\/${domainCl.propertyName.toLowerCase()}s\\/v1.*/;
			\$httpBackend.whenGET(${property.name}Url).respond(function(method, url){return [200, [{${useDisplaynamesWithValues.join(",")}}]];});//list
<%
		}
}
%>
			//For everything else, don't mock
			\$httpBackend.whenGET(/.*/).passThrough();
			\$httpBackend.whenPOST(/.*/).passThrough();
			\$httpBackend.whenHEAD(/.*/).passThrough();
			\$httpBackend.whenDELETE(/.*/).passThrough();
			\$httpBackend.whenPUT(/.*/).passThrough();
			\$httpBackend.whenPATCH(/.*/).passThrough();
			\$httpBackend.whenJSONP(/.*/).passThrough();

			
	});
}
