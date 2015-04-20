'use strict';
<%

import grails.plugin.scaffold.angular.DomainHelper

allProps = scaffoldingHelper.getProps(domainClass)
props = allProps.grep{it.cp?.display != false && it.cp?.editable != false && it.name!= 'id'}

private renderFieldRow(p, owningClass, parentProperty = null, boolean displayParentPropName = false) {
	String propName = DomainHelper.getPropertyFullName(p, parentProperty, '.', displayParentPropName)
	String varName = DomainHelper.getPropertyFullName(p, parentProperty, '_', displayParentPropName)
	if((p.oneToMany && !p.bidirectional) || p.manyToMany){
		println "\t\tthis.${varName}El = element(by.css('#${propName} .input'));"
	}else{
		println "\t\tthis.${varName}El = element(by.model('${owningClass.propertyName}.${propName}'));"
	}
}

private renderFieldRowBind(p, owningClass, parentProperty = null, boolean displayParentPropName = false) {
	String propName = DomainHelper.getPropertyFullName(p, parentProperty, '.', displayParentPropName)
	String varName = DomainHelper.getPropertyFullName(p, parentProperty, '_', displayParentPropName)
	if((p.oneToMany && !p.bidirectional) || p.manyToMany){
		println "\t\tthis.${varName}ViewEl = element.all(by.repeater('item in ${owningClass.propertyName}.${propName}'));"
	}else{
		println "\t\tthis.${varName}ViewEl = element.all(by.binding('${owningClass.propertyName}.${propName}')).first();"
	}
}
%>

var CreatePage = function() {
  this.submitButton = element(by.id('${domainClass.propertyName}SubmitBtn'));

	<%for (p in props) {
			if(p.embedded){
				def embeddedProps = scaffoldingHelper.getProps(p.component).grep{it.cp?.display != false && it.name!= 'id'}
				if(embeddedProps){
					if(embeddedProps.size()>1) {
						println "\t\tthis.${p.name}AccordionEl = element(by.css('#${p.name}Accordion a.accordion-toggle'));"
					}
					embeddedProps.each{ep->
						renderFieldRow(ep, domainClass, p, true)
						renderFieldRowBind(ep, domainClass, p, true)
					}
				}
			}else{
				renderFieldRow(p, domainClass)
				renderFieldRowBind(p, domainClass)
			}
	}%>
};

module.exports = new CreatePage();

