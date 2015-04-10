module.exports = function(){
	angular.module('httpBackendMock', ['ngMockE2E'])
		.run(function(\$httpBackend, appConfig) {

			function quote(str) {
				return str.replace(/(?=[\\/\\\\^\$*+?.()|{}[\\]])/g, "\\\\");
			}

			var url = appConfig.restUrl + '/${domainClass.propertyName.toLowerCase()}s/v1';
			\$httpBackend.whenPOST(new RegExp(quote(url + "/1"))).respond(function(method, url){return [200, {id : 1}];});//edit
			\$httpBackend.whenPOST(new RegExp(quote(url))).respond(function(method, url){return [200, {'id' : 1}];});//create
			\$httpBackend.whenGET(new RegExp(quote(url + "/1"))).respond(function(method, url){return [200, {'id' : 1}];});//view
			\$httpBackend.whenDELETE(new RegExp(quote(url + "/1"))).respond(function(method, url){return [204];});//delete
			\$httpBackend.whenGET(new RegExp(quote(url) + ".*")).respond(function(method, url){return [200, [{'id' : 1}]];});//list
			//Mock relations
<%

	import grails.plugin.scaffold.angular.DomainHelper
	import grails.converters.JSON

	allProps = scaffoldingHelper.getProps(domainClass)
	props = allProps


	String renderAutocompleteMock(p, owningClass, parentProperty = null){
		def dClass = (p.component)?:owningClass
		String parentVarName = (parentProperty?.component) ? parentProperty.name + '_': ''
		String acFunctionName = (parentProperty?.cp?.format)?:(p.cp?.format)?:p.name
		def inst = DomainHelper.createOrGetInst(dClass, 1)

		def val = (inst) ?: []

		def json = val as JSON
		jsonData = json.toString()


		println """
			var ${parentVarName}${p.name}Url = appConfig['${acFunctionName}Url'] || 'http://localhost:8080/${acFunctionName}Url';
			var ${parentVarName}${p.name}Re = new RegExp(quote(${parentVarName}${p.name}Url) + ".*");
			\$httpBackend.whenGET(${parentVarName}${p.name}Re).respond(function(method, url){return [200, [$jsonData]]});//list
			"""
	}

	props.each{p->
			if(p.cp.widget == 'autocomplete'){
				renderAutocompleteMock(p, domainClass)
			}else if(p.embedded) {
				def embeddedProps = scaffoldingHelper.getProps(p.component).grep{it.cp?.display != false &&it.cp?.editable != false && it.name!= 'id'}
				if(embeddedProps){
					embeddedProps.each{ep->
						if(ep.cp.widget == 'autocomplete') {
							renderAutocompleteMock(ep, p.component, p)
						}
					}
				}
			}else if(p.isAssociation()){
				def domainCl = p.referencedDomainClass
				Map useDisplaynames = scaffoldingHelper.getDomainClassDisplayNames(domainCl, p)
				def inst = DomainHelper.createOrGetInst(domainCl, 1)
				useDisplaynames['id'] = null
				List useDisplaynamesWithValues = useDisplaynames.collect{key, value->
				def val = inst?."${key}"
				if(key == 'id') val = 1
				return "'" + key + "': '" + val + "'"
			}
			useDisplaynamesWithValues.unique(true)
	%>
			var ${p.name}Url =/.*\\/${domainCl.propertyName.toLowerCase()}s\\/v1.*/;
			\$httpBackend.whenGET(${p.name}Url).respond(function(method, url){return [200, [{${useDisplaynamesWithValues.join(",")}}]]});//list
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
