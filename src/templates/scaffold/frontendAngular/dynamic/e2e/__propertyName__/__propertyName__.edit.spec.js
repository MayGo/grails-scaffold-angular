'use strict';
<% 
import grails.plugin.scaffold.core.ScaffoldingHelper
ScaffoldingHelper sh = new ScaffoldingHelper(domainClass, pluginManager, comparator, getClass().classLoader)
allProps = sh.getProps()
props = allProps.findAll{p->!p.embedded} 

%>
<%
private renderFieldRow(p, owningClass) {
	return "expect(page.${p.name}El).not.toBeNull()"
}%>
describe('${domainClass.propertyName} edit page', function() {
  var page;

  beforeEach(function() {
    browser.get('/#/app/${domainClass.propertyName}/edit/1');
    page = require('./${domainClass.propertyName}.edit.po');
  });

  
  it('should contain all fields.', function() {
    <%for (p in props) {%>
    ${renderFieldRow(p, domainClass)}\
    <%}%>
  });
});
