'use strict';
<% 

import grails.plugin.scaffold.angular.DomainHelper

allProps = scaffoldingHelper.getProps(domainClass)
props = allProps.findAll{p->!p.embedded && !p.oneToMany && !p.manyToMany} 
isComposite = DomainHelper.isComposite(domainClass)
%>
<%
private renderFieldRow(p, owningClass) {
	return "expect(page.${p.name}El).not.toBeNull()"
}%>
describe('${domainClass.propertyName} view page', function() {
  var page;

  beforeEach(function() {
    browser.get('/#/app/${domainClass.propertyName}/view/1');
    page = require('./${domainClass.propertyName}.view.po');
  });

  
  it('should contain all fields.', function() {
    <%for (p in props) {%>
    ${renderFieldRow(p, domainClass)}\
    <%}%>
  });
  
  it('should contain searchable tables foreach includment of ${domainClass.propertyName} in other domain models', function() {
	  
  });
  
  <% if(!isComposite){ %>
  it('edit button changes path to /edit', function() {
	  element(by.id('editBtn')).click();
	  expect(browser.getCurrentUrl()).toContain("/#/app/${domainClass.propertyName}/edit/1");
  });
  <% } %>
  it('back button changes path to /list', function() {
	  element(by.id('backBtn')).click();
	  expect(browser.getCurrentUrl()).toContain("/#/app/${domainClass.propertyName}/list");
  });
  <% if(!isComposite){ %>
  it('delete button changes path to /list and deletes item', function() {
	  element(by.id('deleteBtn')).click();
	  expect(browser.getCurrentUrl()).toContain("/#/app/${domainClass.propertyName}/list");
  });
  <% } %>
});
