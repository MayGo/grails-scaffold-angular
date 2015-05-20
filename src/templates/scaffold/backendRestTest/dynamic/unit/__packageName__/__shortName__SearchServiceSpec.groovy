<%=packageName ? "package ${packageName}" : ''%>
<%
import grails.plugin.scaffold.angular.DomainHelper
import grails.converters.JSON

// get grails domain class mapping to check if id is composite. When composite then don't render alla tests
isComposite = DomainHelper.isComposite(domainClass)
%>
import grails.test.mixin.TestFor
import grails.test.mixin.Mock
<% if(isComposite){ println "import spock.lang.Ignore"}%>
import spock.lang.Specification
import defpackage.exceptions.ResourceNotFound

@TestFor(${className}SearchService)
@Mock(${className})
class ${className}SearchServiceSpec extends Specification {

	static final long ILLEGAL_ID = -1L
	static final long FICTIONAL_ID = 99999999L

	void 'Quering ${className} without id is not possible'() {

		when:
			service.queryFor${className}(null)
		then:
			thrown(IllegalArgumentException)
	}

	void 'Quering ${className} with illegal id is not possible'() {
		when:
			service.queryFor${className}(ILLEGAL_ID)
		then:
			thrown(IllegalArgumentException)
	}

	void 'Quering ${className} with fictional id is not possible'() {
		when:
			service.queryFor${className}(FICTIONAL_ID)
		then:
			thrown(ResourceNotFound)
	}
<% if(isComposite){ print "\t@Ignore"}%>
	void 'Quering ${className} with valid id returns ${className} instance'() {

		setup:
			Long ${domainClass.propertyName}Id = createValid${className}().id
		when:
			${className} ${domainClass.propertyName} = service.queryFor${className}(${domainClass.propertyName}Id)
		then:
			${domainClass.propertyName} != null
			${domainClass.propertyName}.id == 1
	}

	// TODO: Refactor and cleanup code so Codenarc check passes
	@SuppressWarnings(['MethodSize'])
	Map validData() {
<%
		def inst = DomainHelper.createOrGetInst(domainClass, 1)
		String jsonData = DomainHelper.prettyJsonData(inst)
		%>
		Map data = <% print jsonData %>
		return data
	}

	${className} createValid${className}() {
		${className} ${domainClass.propertyName} = new ${className}(validData())
		${domainClass.propertyName}.save flush: true, failOnError: true
		return ${domainClass.propertyName}
	}
}

