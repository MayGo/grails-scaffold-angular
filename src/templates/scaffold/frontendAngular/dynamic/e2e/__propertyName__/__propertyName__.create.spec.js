'use strict';
<% 
import grails.plugin.scaffold.core.ScaffoldingHelper
import grails.plugin.scaffold.angular.DomainHelper

ScaffoldingHelper sh = new ScaffoldingHelper(domainClass, pluginManager, comparator, getClass().classLoader)
allProps = sh.getProps()
props = allProps.findAll{p->!p.embedded} 
simpleProps = allProps.findAll{p->!p.isAssociation()}


%>

describe('${domainClass.propertyName} create page', function() {
  var page;
  var mockModule = require('./${domainClass.propertyName}.mocks');
  

  beforeEach(function() {
	  browser.addMockModule('httpBackendMock', mockModule ); 
    browser.get('/#/app/${domainClass.propertyName}/create');
    page = require('./${domainClass.propertyName}.create.po');
  });
  
  afterEach(function() {
    browser.manage().logs().get('browser').then(function(browserLog) {
      expect(browserLog.length).toEqual(0);
      // Uncomment to actually see the log.
      //console.log('log: ' + require('util').inspect(browserLog));
    });
  });

  
/*  it('should contain all fields.', function() {
	<%for (p in props) {%>
    println "expect(page.${p.name}El).not.toBeNull()"
    <%}%>
  });
  */
  it('after filling all the fields, should be ', function() {
	expect(page.submitButton.isEnabled()).toBe(false);
	//Fill the form
<%
def inst = DomainHelper.createOrGetInst(domainClass, 1)
props.each{p->
	def realVal = ""
	
	if(p.isAssociation()){
		Map useDisplaynames = ScaffoldingHelper.getDomainClassDisplayNames(domainClass, config, p)
		if(!useDisplaynames) useDisplaynames = ['id': null]
		useDisplaynames.each{key, value->
			def val = inst."${p.name}"?."${key}"
			if(val) realVal += val
		}
		if(realVal)realVal+="\\uE015\\n"
	}else{
		def val = inst."${p.name}" 
		realVal = (val)?DomainHelper.getRealValueForInput(p, val):null
		
	}
		
	if(realVal)println "\t\tpage.${p.name}El.sendKeys('$realVal')"
}
%>

	expect(page.submitButton.isEnabled()).toBe(true);
	page.submitButton.isEnabled().then(function(enabled){
		if(enabled){
			page.submitButton.click();
			expect(browser.getCurrentUrl()).toContain("/#/app/${domainClass.propertyName}/view/1");
		}else{
			console.log("(${domainClass.propertyName}).Submit button not enabled. Not testing submiting.")
		}
	});

  });
  
  
});
