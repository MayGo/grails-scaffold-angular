/**
 * This file uses the Page Object pattern to define the main page for tests
 * https://docs.google.com/presentation/d/1B6manhG0zEXkC-H-tPo2vwU06JhL8w9-XCF9oehXzAQ
 */

'use strict';
<%
allProps = scaffoldingHelper.getProps(domainClass)
props = allProps.grep{it.cp?.display != false && it.cp?.editable != false && it.name!= 'id'}

%>
<%
private renderFieldRow(p, owningClass, parentProperty = null) {
	String parentPropName = (parentProperty?.component) ? parentProperty.name + '.' : ''
	String parentVarName = (parentProperty?.component) ? parentProperty.name + '_': ''
	if((p.oneToMany && !p.bidirectional) || p.manyToMany){
		println "\t\t//this.${parentVarName}${p.name}El = element.all(by.repeater('item in ${owningClass.propertyName}.${parentPropName}${p.name}'));"
	}else{
		println "\t\tthis.${parentVarName}${p.name}El = element(by.model('${owningClass.propertyName}.${p.name}'));"
	}
}

%>


var EditPage = function() {
	<%for (p in props) {
		if(p.embedded){
			def embeddedProps = scaffoldingHelper.getProps(p.component).grep{it.cp?.display != false && it.name!= 'id'}
			if(embeddedProps){
				if(embeddedProps.size()>1) {
					println	"\t\t//page.${p.name}AccordionEl.click()"
				}
				embeddedProps.each{ep->
					renderFieldRow(ep, p.component, p)
				}
			}
		}else{
			renderFieldRow(p, domainClass)
		}
	}%>
};

module.exports = new EditPage();

