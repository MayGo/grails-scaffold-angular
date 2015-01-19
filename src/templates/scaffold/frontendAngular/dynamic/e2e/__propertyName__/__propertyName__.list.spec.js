'use strict';
<% 
import grails.plugin.scaffold.core.ScaffoldingHelper
ScaffoldingHelper sh = new ScaffoldingHelper(domainClass, pluginManager, comparator, getClass().classLoader)
allProps = sh.getProps()
props = allProps.findAll{p->!p.embedded && !p.oneToMany && !p.manyToMany} 

%>
<%
private renderFieldRow(p, owningClass) {
	return "expect(page.${p.name}El).not.toBeNull()"
}%>
describe('${domainClass.propertyName} list page', function() {
  var page;

  beforeEach(function() {
    browser.get('/#/app/${domainClass.propertyName}/list');
    page = require('./${domainClass.propertyName}.list.po');
  });

 
  it('should contain all search fields.', function() {
    <%for (p in props) {%>
    ${renderFieldRow(p, domainClass)}\
    <%}%>
  });
});
