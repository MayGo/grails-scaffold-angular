module.exports = function(){
	angular.module('httpBackendMock', ['ngMockE2E'])
    	.run(function(\$httpBackend, appConfig) {

	     	var url = appConfig.restUrl + '${domainClass.propertyName.toLowerCase()}s';
	        \$httpBackend.whenPOST(url).respond(function(method, url){return [200, {'id' : 1}];});//create
	        \$httpBackend.whenGET(url).respond(function(method, url){return [200, [{'id' : 1}]];});//list
	        \$httpBackend.whenPOST(url + "/1").respond(function(method, url){return [200, {'id' : 1}];});//edit
	        \$httpBackend.whenGET(url + "/1").respond(function(method, url){return [200, {'id' : 1}];});//view
	        

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

/*
exports.create_request = function(){
    var expected_response = {'id' : 1};
    angular.module('angularDemoApp.httpBackendMock', ['ngMockE2E'])
        .run(function (\$httpBackend, appConfig) {
        	
    });
}*/
