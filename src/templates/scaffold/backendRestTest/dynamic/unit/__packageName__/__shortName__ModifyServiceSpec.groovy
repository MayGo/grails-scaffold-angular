<%=packageName ? "package ${packageName}" : ''%>
<%
import grails.plugin.scaffold.angular.DomainHelper
import grails.converters.JSON
import org.codehaus.groovy.grails.web.json.JSONObject

// get grails domain class mapping to check if id is composite. When composite then don't render alla tests
isComposite = DomainHelper.isComposite(domainClass)
%>
import grails.test.mixin.TestFor
import grails.test.mixin.Mock
<% if(isComposite){ println "import spock.lang.Ignore"}%>
import spock.lang.Specification
import defpackage.exceptions.ResourceNotFound
import grails.validation.ValidationException

@TestFor(${className}ModifyService)
@Mock(${className})
class ${className}ModifyServiceSpec extends Specification {

	static final long ILLEGAL_ID = -1L
	static final long FICTIONAL_ID = 99999999L

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
<% if(isComposite){ print "\t@Ignore"}%>
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
			Map data = [id: ILLEGAL_ID]
		when:
			service.update${className}(data)
		then:
			thrown(IllegalArgumentException)
	}

	void 'Updating ${className} with fictional id is not possible'() {

		setup:
			Map data = [id: FICTIONAL_ID]

		when:
			service.update${className}(data)
		then:
			thrown(ResourceNotFound)
	}
<% if(isComposite){ print "\t@Ignore"}%>
	void 'Updating ${className} with invalid data is not possible'() {

		setup:
			Map data = invalidData()
			data.id = createValid${className}().id
		when:
			service.update${className}(data)
		then:
			thrown(ValidationException)
	}
<% if(isComposite){ print "\t@Ignore"}%>
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

	void 'Deleting ${className} without id is not possible'() {
		when:
			service.delete${className}(null)
		then:
			thrown(IllegalArgumentException)
	}

	void 'Deleting ${className} with illegal id is not possible'() {

		setup:
			long id = ILLEGAL_ID
		when:
			service.delete${className}(id)
		then:
			thrown(IllegalArgumentException)
	}

	void 'Deleting ${className} with fictional id is not possible'() {

		setup:
			long id = FICTIONAL_ID
		when:
			service.delete${className}(id)
		then:
			thrown(ResourceNotFound)
	}
<% if(isComposite){ print "\t@Ignore"}%>
	void 'Deleting saved ${className} is possible'() {
		setup:
			Long ${domainClass.propertyName}Id = createValid${className}().id
			${className} ${domainClass.propertyName} = ${className}.findById(${domainClass.propertyName}Id).find()
		when:
			service.delete${className}(${domainClass.propertyName}Id)
		then:
			${domainClass.propertyName} != null
			${className}.findById(${domainClass.propertyName}Id) == null
	}

	Map invalidData() {
<%
		import org.codehaus.groovy.grails.validation.ConstrainedProperty
		allProps = scaffoldingHelper.getProps(domainClass)
		uniqueProps = []
		boolean hasHibernate = pluginManager?.hasGrailsPlugin('hibernate') || pluginManager?.hasGrailsPlugin('hibernate4')

		Map map = [:]
		if (hasHibernate) {
			allProps.each{p->
				cp = domainClass.constrainedProperties[p.name]
				cp?.appliedConstraints.each {
					String errorName = it.name
					String fieldName = p.name
					def val = 'null'
					if( errorName == ConstrainedProperty.BLANK_CONSTRAINT){
						if(!cp.blank) {
							map["'$fieldName'"] = " ''"
						}
					} else if( errorName == ConstrainedProperty.NULLABLE_CONSTRAINT){
						if(!cp.nullable && p.type != Boolean && p.type != boolean) {
							map["'$fieldName'"] = " null"
						}
					}

				}

			}

		}
		if(!map) map = ["'foo'": " 'Sadisfy empty data exception'"]
		%>
		return $map
	}

	Map validData() {
<%
		String jsonData = ""
		def inst = DomainHelper.createOrGetInst(domainClass, 1)
		if(inst){
			def json = inst as JSON
			json.setPrettyPrint(true)
			jsonData = json.toString()
			jsonData = jsonData.replaceAll(/\{/,'[')
			jsonData = jsonData.replaceAll(/\}/,']')
			jsonData = jsonData.replaceAll('"',"'")
			jsonData = jsonData.replaceAll(':',": ")
			jsonData = jsonData.replaceAll(",'",", '")
		}
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

