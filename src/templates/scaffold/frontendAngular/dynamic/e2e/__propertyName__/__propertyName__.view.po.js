/**
 * This file uses the Page Object pattern to define the main page for tests
 * https://docs.google.com/presentation/d/1B6manhG0zEXkC-H-tPo2vwU06JhL8w9-XCF9oehXzAQ
 */

'use strict';
<% 
allProps = scaffoldingHelper.getProps(domainClass)
props = allProps.findAll{p->!p.embedded} 

%>
<%
private renderFieldRow(p, owningClass) {
	return "this.${p.name}El = element(by.binding('${owningClass.propertyName}.${p.name}'));"
}%>


var ViewPage = function() {
  <%for (p in props) {%>
  ${renderFieldRow(p, domainClass)}\
  <%}%>
};

module.exports = new ViewPage();

