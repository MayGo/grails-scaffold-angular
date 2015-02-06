'use strict';
<% 
import grails.plugin.scaffold.core.ScaffoldingHelper
ScaffoldingHelper sh = new ScaffoldingHelper(domainClass, pluginManager, comparator, getClass().classLoader)
allProps = sh.getProps()
props = allProps.findAll{p->!p.embedded} 

%>
<%
private renderFieldRow(p, owningClass) {
	return "this.${p.name}El = element(by.model('${owningClass.propertyName}.${p.name}'));"
}%>


var CreatePage = function() {
  this.submitButton = element(by.id('${domainClass.propertyName}SubmitBtn'));
  <%for (p in props) {%>
  ${renderFieldRow(p, domainClass)}\
  <%}%>
};

module.exports = new CreatePage();
