'use strict';
<%
import grails.plugin.scaffold.angular.DomainHelper

allProps = scaffoldingHelper.getProps(domainClass)
props =  allProps.grep{it.cp?.display != false && it.cp?.editable != false && it.name!= 'id'}

private renderFieldRowBind(p, owningClass, parentProperty = null, boolean displayParentPropName = false) {

	String varName = DomainHelper.getPropertyFullName(p, parentProperty, '_', displayParentPropName)
	if((p.oneToMany && !p.bidirectional) || p.manyToMany){
		println "\t\t//expect(page.${varName}ViewEl).toBeDefined()"
	}else{
		println "\t\texpect(page.${varName}ViewEl).toBeDefined()"
	}
}


private renderFieldSendKeys(p, owningClass, inst, parentProperty = null, boolean displayParentPropName = false) {
	String varName = DomainHelper.getPropertyFullName(p, parentProperty, '_', displayParentPropName)
	Closure findAllValuesFromMap
	findAllValuesFromMap = {map->
		String str = ""
		map.each{k, v->
			if(v instanceof Map){
				str += findAllValuesFromMap(v)
			}else{
				if(str){
					str += ' ';
				}
				str += v
			}
		}
		return str
	}

	def realVal = ""
	if(p.cp.widget == 'autocomplete'){
		Map useDisplaynames = scaffoldingHelper.getDomainClassDisplayNames(p.getType())

		useDisplaynames.each{key, value->
			if(realVal) realVal += " " + realVal

			def val = inst."${p.name}"?."${key}"
			if(val && val?.getClass() == Map || "${val?.getClass()?.name}" == "com.google.gson.internal.LinkedTreeMap"){
				realVal +=findAllValuesFromMap(val)
			}else if(val){
				realVal += val; // Using only one value, because backend does not accept multistring for autocomplete
			}
		}
	}else if(p.type == Map || "${p.type.name}" == "com.google.gson.internal.LinkedTreeMap"){

		def val = inst."${p.name}"


		if(val){
			realVal = findAllValuesFromMap(val)
		}
	}else if(p.isAssociation()){

		Map useDisplaynames = scaffoldingHelper.getDomainClassDisplayNames(owningClass,  p)
		if(!useDisplaynames) useDisplaynames = ['id': null]
		useDisplaynames.each{key, value->
			def val = inst."${p.name}"?."${key}"
			if(val) realVal = val; // Using only one value, because backend does not accept multistring for autocomplete
		}
	}else{
		def val = inst."${p.name}"
		realVal = (val.toString())?DomainHelper.getRealValueForInput(p, val):null
	}


	if(realVal.toString() && realVal.toString()!='null'){//there can be also boolean true/false and 1, -1, 0
		if(p.type == boolean || p.type == Boolean){
			println "\t\tpage.${varName}El.click();"
		}else if(p.cp.widget == 'autocomplete' || parentProperty?.cp?.widget == 'autocomplete'){
			println "\t\tpage.${varName}El.sendKeys('${realVal.toString().replaceAll(" ", "_")}').sendKeys(protractor.Key.ENTER);"
		}else if(p.isAssociation()){
			println "\t\tpage.${varName}El.sendKeys('${realVal.toString().replaceAll(" ", "_")}').sendKeys(protractor.Key.ENTER);"
		}else{
			println "\t\tpage.${varName}El.sendKeys('$realVal');"
		}
	}else{
		println "\t\tpage.${varName}El.sendKeys('');//no val for ${varName}"
	}
}
%>
var helper = require('../utils/helper.js');
describe('${domainClass.propertyName} create page', function() {
	var page;

	beforeEach(function() {
		var mockModule = require('./${domainClass.propertyName}.mocks');
		browser.addMockModule('httpBackendMock', mockModule );
		browser.get('/#/app/${domainClass.propertyName}/create');
		page = require('./${domainClass.propertyName}.create.po');
	});
	afterEach(function() {
		browser.clearMockModules();
	});

/*
	it('should contain all fields.', function() {
	<%for (p in props) {%>
		expect(page.${p.name}El).not.toBeNull()
	<%}%>
	});
*/
	it('after filling all the fields, should submit and change route to view', function() {
		expect(page.submitButton.isEnabled()).toBe(false);
		//Fill the form
<%
def inst = DomainHelper.createOrGetInst(domainClass, 1)
if(inst){
	for (p in props) {
		if(p.embedded){
			def embeddedProps = scaffoldingHelper.getProps(p.component).grep{it.cp?.display != false &&it.cp?.editable != false && it.name!= 'id'}
			if(embeddedProps){

				if(embeddedProps.size()>1) {
					println	"\t\tpage.${p.name}AccordionEl.click()"
				}
				def embeddedInst = DomainHelper.createOrGetInst(p.component, 1, domainClass, p)

				if(embeddedInst) {
					embeddedProps.each{ep ->
						renderFieldSendKeys(ep, p.component, embeddedInst, p, true)
					}
				}else{
					println "// no data for ${p.name}"
				}
			}else{
				println "// no embeddedporps for ${p.name}"
			}
		}else{
			renderFieldSendKeys(p, domainClass, inst)
		}
	}
}
%>
		expect(page.submitButton.isEnabled()).toBe(true);
		page.submitButton.click();
		helper.currentUrlContains('/#/app/${domainClass.propertyName}/view/1');
		browser.wait(function() {
				return \$('#${domainClass.propertyName}_view').isPresent(); // keeps waiting until this statement resolves to true
			},
			1000,
			'${domainClass.propertyName}_view element not visible'
		);

		<%for (p in props) {
			if(p.embedded){
				def embeddedProps = scaffoldingHelper.getProps(p.component).grep{it.cp?.display != false && it.name!= 'id'}
				if(embeddedProps){
					if(embeddedProps.size()>1) {
						println	"\t\tpage.${p.name}AccordionEl.click()"
					}
					embeddedProps.each{ep->
						renderFieldRowBind(ep, p.component, p, true)
					}
				}
			}else{
				renderFieldRowBind(p, domainClass)
			}
		}%>


	});
});
