<%=packageName ? "package ${packageName}" : ''%>
<%
import grails.plugin.scaffold.angular.DomainHelper
import grails.converters.JSON
import org.codehaus.groovy.grails.web.json.JSONObject
%>
import grails.test.mixin.TestFor
import grails.test.mixin.Mock
import spock.lang.Ignore
import spock.lang.Specification
import defpackage.exceptions.ResourceNotFound
import grails.validation.ValidationException

@TestFor(${className}ModifyService)
@Mock(${className})
class ${className}ModifyServiceSpec extends Specification {

	void 'Creating ${className} with no data is not possible'() {

		setup:
			Map data = [:]
		when:
			service.create${className}(data)
		then:
			thrown(IllegalArgumentException)
	}

	void 'Creating ${className} with invalid data is not possible'() {

		setup:

			Map data = invalidData()
		when:
			service.create${className}(data)
		then:
			thrown(ValidationException)
	}

	void 'Creating ${className} with valid data returns ${className} instance'() {

		setup:
			Map data = validData()
		when:
			${className} ${domainClass.propertyName} = service.create${className}(data)
		then:
			${domainClass.propertyName} != null
			${domainClass.propertyName}.id != null
	}

	void 'Updating ${className} without id is not possible'() {

		setup:
			Map data = [:]
		when:
			service.update${className}(data)
		then:
			thrown(IllegalArgumentException)
	}

	void 'Updating ${className} with illegal id is not possible'() {

		setup:
			Map data = [id:-1L]
		when:
			service.update${className}(data)
		then:
			thrown(IllegalArgumentException)
	}

	void 'Updating ${className} with fictional id is not possible'() {

		setup:
			Map data = [id:99999999L]

		when:
			service.update${className}(data)
		then:
			thrown(ResourceNotFound)
	}

	@Ignore //TODO: set invalid data first
	void 'Updating ${className} with invalid data is not possible'() {

		setup:
			Map data = invalidData()
			data.id = createValid${className}().id
		when:
			${className} ${domainClass.propertyName} = service.update${className}(data)
		then:
			thrown(ValidationException)
	}

	void 'Updating ${className} with valid data returns ${className} instance'() {

		setup:
			Map data = validData()
			data.id = createValid${className}().id
		when:
			${className} ${domainClass.propertyName} = service.update${className}(data)
		then:
			${domainClass.propertyName} != null
			${domainClass.propertyName}.id == 1
	}

	Map invalidData() {
		return ["foo": "bar"]//Sadisfy 'empty data' exception
	}

	Map validData() {
		<%
		String jsonData = ""
		def inst = DomainHelper.createOrGetInst(domainClass, 1)
		if(inst){
			jsonData = (inst as JSON).toString()
			jsonData = jsonData.replaceAll(/\{/,'[')
			jsonData = jsonData.replaceAll(/\}/,']')
		}
		%>
		Map data = <% println jsonData %>
		return data
	}

	${className} createValid${className}(){
		${className} ${domainClass.propertyName} = new ${className}(validData())
		${domainClass.propertyName}.save flush:true, failOnError: true
		return ${domainClass.propertyName}
	}

}

