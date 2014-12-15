<%=packageName ? "package ${packageName}\n" : ''%>

import grails.plugins.rest.client.*
import spock.lang.Specification
import static org.springframework.http.HttpStatus.*
import defpackage.AbstractRestSpec
<%
import grails.plugin.scaffold.core.ScaffoldingHelper
import java.text.SimpleDateFormat
import grails.buildtestdata.handler.NullableConstraintHandler
import grails.buildtestdata.CircularCheckList
String propertyName = domainClass.propertyName;
String shortNameLower = propertyName.toLowerCase()+"s";


ScaffoldingHelper sh = new ScaffoldingHelper(domainClass, pluginManager, comparator, getClass().classLoader)
allProps = sh.getProps()
props = allProps.findAll{p->!p.isAssociation()}

//cache instances for later use
cachedInstances = [:]

private renderAll(boolean isResp = false, int groupId){
	
	String resp = ""
	
	
	//Get instance from cache or create if does not exists
	def inst
	if(cachedInstances.containsKey(groupId)){
		inst = cachedInstances[groupId]
	}else{
		domainClass.clazz.withTransaction{
			inst = domainClass.clazz.buildWithoutSave()
		}
		cachedInstances[groupId] = inst
	}
	
	props.each{p->
		String str = (isResp)?"\t\t\tresponse.json.":"\t\t\t\t"
		String asign = (isResp)?"==":"="
		def val = inst."${p.name}"
		if (p.type && Number.isAssignableFrom(p.type) || (p.type?.isPrimitive() || p.type == boolean)){
			str +="${p.name} $asign $val\n"
		}else if(p.type == Date || p.type == java.sql.Date || p.type == java.sql.Time || p.type == Calendar){
			String dateStr = (val)?new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.sZ").format(val):''
			str +="${p.name} $asign '$dateStr'\n"
		}else{
			str +="${p.name} $asign '$val'\n"
		}
		resp += str
	}
	
	println resp
}
%>



class ${className}Spec extends AbstractRestSpec {

	void "Test ${className} crud"() {

		given:
		def authResponse = sendCorrectCredentials()
		def ${propertyName}Id

		when: "Create ${propertyName}"
		def response = restBuilder.post("\${baseUrl}/${shortNameLower}") {
			header 'Authorization', 'Bearer '+authResponse.json.access_token
			accept "application/json"
			json {
<%renderAll(false, 1)%>
			}
		}
		${propertyName}Id = response.json.id
		then: "Should create and return created values"
		
<%renderAll(true, 1)%>
		response.status == CREATED.value()

		when: "Read ${propertyName}"
		response = restBuilder.get("\${baseUrl}/${shortNameLower}/\${${propertyName}Id}") {
			header 'Authorization', 'Bearer '+authResponse.json.access_token
			accept "application/json"
		}
		then: "Should return correct values"
<%renderAll(true, 1)%>
		response.status == OK.value()

		when: "Update ${propertyName}"
		response = restBuilder.put("\${baseUrl}/${shortNameLower}/\${${propertyName}Id}") {
			header 'Authorization', 'Bearer '+authResponse.json.access_token
			accept "application/json"
			json {
<%renderAll(false, 2)%>
			}
		}
		then: "Should return updated values"
<%renderAll(true, 2)%>
		response.status == OK.value()


		when:"Get ${propertyName} sorted list"
		response = restBuilder.get("\${baseUrl}/${shortNameLower}.json?order=desc&sort=id") {
			header 'Authorization', 'Bearer '+authResponse.json.access_token
			accept "application/json"
		}

		then:"First item should be just inserted object"
		response.json[0].id == ${propertyName}Id
		response.status == OK.value()

		
		when:"Find unexisting ${propertyName}"
		response = restBuilder.get("\${baseUrl}/${shortNameLower}/nonexistent") {
			header 'Authorization', 'Bearer '+authResponse.json.access_token
			accept "application/json"
		}
		then:"Should not find"
		response.status == NOT_FOUND.value()

		
		when: "Delete ${propertyName}"
		response = restBuilder.delete("\${baseUrl}/${shortNameLower}/\${${propertyName}Id}") {
			header 'Authorization', 'Bearer '+authResponse.json.access_token
			accept "application/json"
		}
		then:
		response.status == NO_CONTENT.value()
		
	}
}
