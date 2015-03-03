'use strict';
<%
allProps = scaffoldingHelper.getProps(domainClass)
props = allProps.findAll{p->!p.embedded} 

%>
<%
private renderFieldRow(p, owningClass) {
	return "this.${p.name}El = element(by.model('${owningClass.propertyName}.${p.name}'));"
}
private renderFieldRowBind(p, owningClass) {
	return "this.${p.name}ViewEl = element.all(by.binding('${owningClass.propertyName}.${p.name}')).first();"
}
%>


var CreatePage = function() {
  this.submitButton = element(by.id('${domainClass.propertyName}SubmitBtn'));
  <%for (p in props) {%>
  ${renderFieldRow(p, domainClass)}
  ${renderFieldRowBind(p, domainClass)}\
  <%}%>
};

module.exports = new CreatePage();

