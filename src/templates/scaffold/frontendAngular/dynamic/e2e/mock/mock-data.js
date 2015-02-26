module.exports = function(){
	angular.module('httpBackendMock', ['ngMockE2E'])
    	.run(function(\$httpBackend, appConfig) {

<%for(d in domainClasses){%>
	     	var ${d.propertyName}Url = appConfig.restUrl + '/${d.propertyName.toLowerCase()}s/v1';
	        \$httpBackend.whenPOST(${d.propertyName}Url).respond(function(method, url){return [200, {'id' : 1}];});
	        \$httpBackend.whenPOST(${d.propertyName}Url + "/1").respond(function(method, url){return [200, {'id' : 1}];});
	        \$httpBackend.whenGET(${d.propertyName}Url + "/1").respond(function(method, url){return [200, {'id' : 1}];});
<%}%>
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

