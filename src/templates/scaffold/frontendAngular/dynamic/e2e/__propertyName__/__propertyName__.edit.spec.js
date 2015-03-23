'use strict';
<%
allProps = scaffoldingHelper.getProps(domainClass)
props = allProps.findAll{p->!p.embedded} 

%>
<%
private renderFieldRow(p, owningClass) {
	if((p.oneToMany && !p.bidirectional) || p.manyToMany){
		println "\t\t//expect(page.${p.name}El).not.toBeNull()"
	}else{
		println "\t\texpect(page.${p.name}El).not.toBeNull()"
	}
}%>
describe('${domainClass.propertyName} edit page', function() {
  var page;
  var mockModule = require('./${domainClass.propertyName}.mocks');
  beforeEach(function() {
	  browser.addMockModule('httpBackendMock', mockModule );
    browser.get('/#/app/${domainClass.propertyName}/edit/1');
    page = require('./${domainClass.propertyName}.edit.po');
  });

  it('should contain all fields.', function() {
	  <%for (p in props) {
		  if(p.embedded){
			  def embeddedProps = scaffoldingHelper.getProps(p.component).grep{it.cp?.display != false &&it.cp?.editable != false && it.name!= 'id'}
			  if(embeddedProps){
				  if(embeddedProps.size()>1) {
					  println	"\t\tpage.${p.name}AccordionEl.click()"
				  }
				  embeddedProps.each{ep->
				  renderFieldRow(ep, p.component, p)
				  }
			  }
		  }else{
			  renderFieldRow(p, domainClass)
		  }
	  }%>
  });
});
