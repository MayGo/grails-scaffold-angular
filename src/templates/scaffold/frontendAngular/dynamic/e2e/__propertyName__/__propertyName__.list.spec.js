'use strict';
<%
allProps = scaffoldingHelper.getProps(domainClass)
props = allProps.findAll{p->!p.embedded && !p.oneToMany && !p.manyToMany} 

private renderFieldRow(p, owningClass) {
	return "expect(page.${p.name}El).not.toBeNull()"
}
%>
describe('${domainClass.propertyName} list page', function() {
	var page;

	beforeEach(function() {
		var mockModule = require('./${domainClass.propertyName}.mocks');
		browser.addMockModule('httpBackendMock', mockModule );
		browser.get('/#/app/${domainClass.propertyName}/list');
		page = require('./${domainClass.propertyName}.list.po');
	});
	afterEach(function() {
		browser.clearMockModules();
	});

 
	it('should contain all search fields.', function() {
	<%for (p in props) {%>
		${renderFieldRow(p, domainClass)}\
	<%}%>
	});
});
