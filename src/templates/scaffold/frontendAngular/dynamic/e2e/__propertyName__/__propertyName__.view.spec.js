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
var helper = require('../utils/helper.js');
describe('${domainClass.propertyName} view page', function() {
	var page;
	var mockModule = require('./${domainClass.propertyName}.mocks');
	beforeEach(function() {
		browser.addMockModule('httpBackendMock', mockModule );
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
	  browser.wait(function() {
			  return \$('#${domainClass.propertyName}_form').isPresent(); // keeps waiting until this statement resolves to true
		  },
		  1000,
		  '${domainClass.propertyName}_form element not visible'
	  );
	  helper.currentUrlContains('/#/app/${domainClass.propertyName}/edit/1');

  });
  <% } %>
  it('back button changes path to /list', function() {
	  element(by.id('backBtn')).click();
	  browser.wait(function() {
			  return \$('#${domainClass.propertyName}_list').isPresent(); // keeps waiting until this statement resolves to true
		  },
		  1000,
		  '${domainClass.propertyName}_list element not visible'
	  );
	  helper.currentUrlContains('/#/app/${domainClass.propertyName}/list');

  });
  <% if(!isComposite){ %>
  it('delete button changes path to /list and deletes item', function() {
	  element(by.id('deleteBtn')).click();
	  browser.wait(function() {
			  return \$('#${domainClass.propertyName}_list').isPresent(); // keeps waiting until this statement resolves to true
		  },
		  1000,
		  '${domainClass.propertyName}_list element not visible'
	  );
	  helper.currentUrlContains('/#/app/${domainClass.propertyName}/list');

  });
  <% } %>
});
