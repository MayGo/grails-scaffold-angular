<%=packageName ? "package ${packageName}" : ''%>
<%
import grails.converters.JSON
import grails.plugin.scaffold.angular.DomainHelper
%>


import org.springframework.http.HttpStatus
import grails.converters.JSON
import grails.test.mixin.TestFor
import grails.test.mixin.Mock
import spock.lang.Specification
import ${packageName}.v1.${className}Controller
import ${packageName}.${className}ModifyService
import ${packageName}.${className}SearchService

@TestFor(${className}Controller)
@Mock([${className}, ${className}ModifyService, ${className}SearchService])
class ${className}ControllerSpec extends Specification {



    void 'Test the index action returns the correct model'() {

        when: 'The index action is executed'
            controller.index()

        then: 'The response is correct'
            response.status == HttpStatus.OK.value
            response.text == ([] as JSON).toString()
    }

    void 'Creating instance with invalid data returns validation errors'() {

        when:
            request.JSON = invalidData() as JSON
            controller.save()

        then:
            response.status == HttpStatus.UNPROCESSABLE_ENTITY.value

    }

	void 'Creating instance with valid data returns created instance'() {

		when:
			request.JSON =  validData() as JSON
			controller.save()

		then:
			response.status == HttpStatus.CREATED.value

	}

	void 'Updating instance with invalid data returns validation errors'() {

		when:
			request.JSON = invalidData() as JSON
			controller.save()

		then:
			response.status == HttpStatus.UNPROCESSABLE_ENTITY.value

	}

	void 'Updating instance with valid data returns created instance'() {

		when:
			request.JSON =  validData() as JSON
			controller.save()

		then:
			response.status == HttpStatus.CREATED.value

	}

	void 'Deleting instance with finctional id is not possible'() {

		when:
			request.JSON = [id: 99999999L] as JSON
			controller.delete()

		then:
			response.status == HttpStatus.NOT_FOUND.value

	}

	void 'Deleting instance with correct id is possible'() {
		when:
			Map data = [:]
			data.id = createValidBook().id
			request.JSON = data as JSON
			controller.delete()

		then:
			${className}.count() == 0
			response.status == HttpStatus.NOT_FOUND.value

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
