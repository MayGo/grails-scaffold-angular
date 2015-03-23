'use strict';
<%
allProps = scaffoldingHelper.getProps(domainClass)
props = allProps.grep{it.cp?.display != false && it.cp?.editable != false && it.name!= 'id'}

private renderFieldRow(p, owningClass, parentProperty = null) {
	String parentPropName = (parentProperty?.component) ? parentProperty.name + '.' : ''
	String parentVarName = (parentProperty?.component) ? parentProperty.name + '_': ''
	println "\t\tthis.${parentVarName}${p.name}El = element(by.model('${owningClass.propertyName}.${parentPropName}${p.name}'));"
}

private renderFieldRowBind(p, owningClass, parentProperty = null) {
	String parentPropName = (parentProperty?.component) ? parentProperty.name + '.' : ''
	String parentVarName = (parentProperty?.component) ? parentProperty.name + '_': ''
	if((p.oneToMany && !p.bidirectional) || p.manyToMany){
		println "\t\tthis.${parentVarName}${p.name}ViewEl = element.all(by.repeater('item in ${owningClass.propertyName}.${parentPropName}${p.name}'));"
	}else{
		println "\t\tthis.${parentVarName}${p.name}ViewEl = element.all(by.binding('${owningClass.propertyName}.${parentPropName}${p.name}')).first();"
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
						renderFieldRow(ep, domainClass, p)
						renderFieldRowBind(ep, domainClass, p)
					}
				}
			}else{
				renderFieldRow(p, domainClass)
				renderFieldRowBind(p, domainClass)
			}
	}%>
};

module.exports = new CreatePage();

