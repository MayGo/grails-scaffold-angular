'use strict';
<%
import grails.plugin.scaffold.angular.DomainHelper

allProps = scaffoldingHelper.getProps(domainClass)
props = allProps.findAll{p->!p.embedded} 
simpleProps = allProps.findAll{p->!p.isAssociation()}

private renderFieldRowBind(p, owningClass) {
	return "expect(page.${p.name}ViewEl).toBeDefined()"
}

%>
var helper = require('../utils/helper.js');
describe('${domainClass.propertyName} create page', function() {
	var page;
	var mockModule = require('./${domainClass.propertyName}.mocks');

	beforeEach(function() {
		browser.addMockModule('httpBackendMock', mockModule );
		browser.get('/#/app/${domainClass.propertyName}/create');
		page = require('./${domainClass.propertyName}.create.po');
	});
  
	afterEach(function() {

	});
/*
	it('should contain all fields.', function() {
	<%for (p in props) {%>
		expect(page.${p.name}El).not.toBeNull()
	<%}%>
	});
*/
	it('after filling all the fields, should be ', function() {
		expect(page.submitButton.isEnabled()).toBe(false);
		//Fill the form
<%
def inst = DomainHelper.createOrGetInst(domainClass, 1)
if(inst) props.each{p->
	def realVal = ""
	
	if(p.isAssociation()){
		Map useDisplaynames = scaffoldingHelper.getDomainClassDisplayNames(domainClass,  p)
		if(!useDisplaynames) useDisplaynames = ['id': null]
		useDisplaynames.each{key, value->
			def val = inst."${p.name}"?."${key}"
			if(val) realVal = val; // Using only one value, because backend does not accept multistring for autocomplete
		}
	}else{
		def val = inst."${p.name}" 
		realVal = (val)?DomainHelper.getRealValueForInput(p, val):null
		
	}
		
	if(realVal){
		if(p.type == boolean || p.type == Boolean){
			println "\t\tpage.${p.name}El.click();"
		}else if(p.isAssociation()){
			println "\t\tpage.${p.name}El.sendKeys('$realVal').sendKeys(protractor.Key.ENTER);"
		}else{
			println "\t\tpage.${p.name}El.sendKeys('$realVal');"
		}
	}
}
%>

		expect(page.submitButton.isEnabled()).toBe(true);
		page.submitButton.isEnabled().then(function(enabled){
			if(enabled){
				page.submitButton.click();
				helper.currentUrlContains('/#/app/${domainClass.propertyName}/view/1');
				<%for (p in props) {%>
				${renderFieldRowBind(p, domainClass)}\
				<%}%>
			}else{
				console.log("(${domainClass.propertyName}).Submit button not enabled. Not testing submiting.")
			}
		});

  	});
});
