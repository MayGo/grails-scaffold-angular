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
import org.codehaus.groovy.grails.orm.hibernate.cfg.CompositeIdentity;
import org.codehaus.groovy.grails.orm.hibernate.cfg.GrailsDomainBinder;
String propertyName = domainClass.propertyName;
String shortNameLower = propertyName.toLowerCase()+"s";


ScaffoldingHelper sh = new ScaffoldingHelper(domainClass, pluginManager, comparator, getClass().classLoader)
allProps = sh.getProps()
props = allProps.findAll{p->!p.isAssociation()}
assocProps = allProps.findAll{p->p.manyToOne || p.oneToOne}
//cache instances for later use
cachedInstances = [:]

// get grails domain class mapping to check if id is composite. When composite then don't render alla tests
domainMapping = new GrailsDomainBinder().getMapping(domainClass.clazz)
isComposite = false
if (domainMapping != null && domainMapping.getIdentity() instanceof CompositeIdentity){
	isComposite = true
}

// This is included in plugins doWithSpring
//private addAllPropertiesBuilding(){
//	def dClazz = domainClass.clazz
//	dClazz.metaClass.'static'.buildWithoutSave = {->
//		def domainInstanceBuilder = delegate.domainInstanceBuilders[domainClass]
//		domainInstanceBuilder.metaClass.findRequiredPropertyNames = {domainArtefact->
//			def constrainedProperties = domainArtefact.constrainedProperties
//            def propNames = domainArtefact.persistentProperties.findAll{p->!p.isAssociation()}*.name
//            def allPropertyNames = constrainedProperties.keySet()
//            return allPropertyNames.findAll { propName ->
//                propNames.contains(propName)
//            }
//		}
//		domainInstanceBuilder.buildWithoutSave([:])
//	}
//}
//addAllPropertiesBuilding()

//buildTestDataService = grails.util.Holders.getApplicationContext().getBean('buildTestDataService')



private renderAll(boolean isResp = false, int groupId){
	
	String resp = ""
	
	
	//Get instance from cache or create if does not exists
	def inst
	if(cachedInstances.containsKey(groupId)){
		inst = cachedInstances[groupId]
	}else{
		domainClass.clazz.withNewTransaction{
			inst = domainClass.clazz.buildWithoutSave()
		}
		cachedInstances[groupId] = inst
	}
	
	props.each{p->
		String str = (isResp)?"\t\t\tresponse.json.":"\t\t\t\t"
		String asign = (isResp)?"==":"="
		def val = inst."${p.name}"
		if (p.type && Number.isAssignableFrom(p.type) || (p.type?.isPrimitive() || p.type == boolean)){
			if(p.type == boolean) val = true
			str +="${p.name} $asign $val\n"
		}else if(p.type == Date || p.type == java.sql.Date || p.type == java.sql.Time || p.type == Calendar){
			def inputFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSSZ")
			def outputFormat = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss'Z'")
			outputFormat.timeZone = java.util.TimeZone.getTimeZone( 'GMT' )
			
			String dateStr = (val)?inputFormat.format(val):''
			
			if(isResp){//format input differently then comparison
				dateStr = (val)? outputFormat.format(val):''
			}
			str +="${p.name} $asign '$dateStr'\n"
		}else{
			str +="${p.name} $asign '$val'\n"
		}
		resp += str
	}
	
	assocProps.each{p->
		def refClass = p.getReferencedPropertyType()
		String str = (isResp)?"\t\t\tresponse.json.":"\t\t\t\t"
		String asign = (isResp)?"==":"="
		def val = refClass.first(sort: 'id')?.id
		//check if composite id
		
		if(isResp){
			str +="${p.name}?.id $asign $val\n"
		}else{
			str +="${p.name} $asign $val\n"
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

<% if(!isComposite){%>
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
<% }%>
	}
}
