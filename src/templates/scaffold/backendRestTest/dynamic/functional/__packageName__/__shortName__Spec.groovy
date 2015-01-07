<%=packageName ? "package ${packageName}\n" : ''%>

import grails.plugins.rest.client.*
import spock.lang.Specification
import spock.lang.Shared
import spock.lang.Ignore
import static org.springframework.http.HttpStatus.*
import defpackage.AbstractRestSpec
import defpackage.RestQueries
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
		if (p.type && Number.isAssignableFrom(p.type) || (p.type?.isPrimitive() || p.type == boolean || p.type == Boolean)){
			if(p.type == boolean || p.type == Boolean) val = true
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



class ${className}Spec extends AbstractRestSpec implements RestQueries{
	
	String REST_URL = "\${baseUrl}/${shortNameLower}"
	
	@Shared
	Long domainId
	@Shared
	Long otherDomainId
	
	@Shared
	def authResponse
	
	@Shared
	def response
	
	def setupSpec() {
		authResponse = sendCorrectCredentials()
	}
	
	void "Test creating another ${className} instance."() {//This is for creating some data to test list sorting
		when: "Create ${propertyName}"
			response = sendCreateWithData(){
<%renderAll(false, 1)%>\
			}
			otherDomainId = response.json.id
			
		then: "Should create and return created values"
		
<%renderAll(true, 1)%>\
			response.status == CREATED.value()
	}

	void "Test creating ${className} instance."() {
		when: "Create ${propertyName}"
			response = sendCreateWithData(){
<%renderAll(false, 1)%>\
			}
			domainId = response.json.id
			
		then: "Should create and return created values"
<%renderAll(true, 1)%>\
			response.status == CREATED.value()
	}
	
	
			
		
<% if(!isComposite){%>
	void "Test reading ${className} instance."() {
		when: "Read ${propertyName}"
			response = readDomainItemWithParams(domainId.toString(), "")
		then: "Should return correct values"
<%renderAll(true, 1)%>\
			response.status == OK.value()
	}
	
	
	void "Test excluding fields from reading ${className} instance."() {
		when: "Read ${propertyName} id excluded"
			response = readDomainItemWithParams(domainId.toString(), "excludes=id")
		then: "Should not return id"
			response.json.id == null
			response.status == OK.value()
	}
	
	
	void "Test including fields from reading ${className} instance."() {
		when: "Read ${propertyName} id excluded and then included"
			response = readDomainItemWithParams(domainId.toString(), "excludes=id&includes=id")
		then: "Should return id"
			response.json.id != null
			response.status == OK.value()
	}
	
	
	void "Test reading unexisting ${className} instance."() {
		when:"Find unexisting ${propertyName}"
			response = readDomainItemWithParams("9999999999", "")
		then:"Should not find"
			response.status == NOT_FOUND.value()
		when:"Find unexisting ${propertyName} id not a number"
			response = readDomainItemWithParams("nonexistent", "")
		then:"Should not find"
			response.status == NOT_FOUND.value()
	}

	
	void "Test updating ${className} instance."() {
		when: "Update ${propertyName}"
			response = sendUpdateWithData(domainId.toString()){
<%renderAll(false, 2)%>
			}
		then: "Should return updated values"
<%renderAll(true, 2)%>
			response.status == OK.value()
	}

	void "Test updating unexisting ${className} instance."() {
		when: "Update unexisting ${propertyName}"
			response = sendUpdateWithData("9999999999"){
	<%renderAll(false, 2)%>
			}
		then:"Should not find"
			response.status == NOT_FOUND.value()
			
		when: "Update unexisting ${propertyName} id not a number"
			response = sendUpdateWithData("nonexistent"){
	<%renderAll(false, 2)%>
			}
		then:"Should not find"
			response.status == NOT_FOUND.value()
	}
	
	void "Test ${className} list sorting."() {
		when:"Get ${propertyName} sorted list DESC"
			response = queryListWithParams("order=desc&sort=id")

		then:"First item should be just inserted object"
			response.json[0].id == domainId
			response.status == OK.value()
		
		when:"Get ${propertyName} sorted list ASC"
			response = queryListWithParams("order=asc&sort=id")

		then:"First item should not be just inserted object"
			response.json[0].id != domainId
			response.status == OK.value()
	}
	
	
	void "Test ${className} list max property."() {
		when:"Get ${propertyName} list with max 2 items"
			response = queryListWithParams("max=2")

		then:"Should be only 2 items"
			response.json.size() == 2
	}
	
	@Ignore // have to have more then maxLimit items
	void "Test ${className} list max property."() {
		given:
			int maxLimit = 100// Set real max items limit
			
		when:"Get ${propertyName} list with maximum items"
			response = queryListWithParams("max=\$maxLimit")

		then:"Should contains maximum items"
			response.json.size() == maxLimit
			
		when:"Get ${propertyName} list with maximum + 1 items"
			response = queryListWithParams("max=\${maxLimit+1}")

		then:"Should contains maximum items"
			response.json.size() == maxLimit
	}
	
	
	void "Test excluding fields in ${className} list."() {
		when:"Get ${propertyName} sorted list"
			response = queryListWithParams("excludes=id")

		then:"First item should be just inserted object"
			response.json[0].id == null
	}
	
	
	void "Test including fields in ${className} list."() {
		when:"Get ${propertyName} sorted list"
			response = queryListWithParams("excludes=id&includes=id")

		then:"First item should be just inserted object"
			response.json[0].id != null
	}
	
	void "Test filtering in ${className} list."() {
		when:"Get ${propertyName} sorted list"
			response = queryListWithParams("order=desc&sort=id")

		then:"First item should be just inserted object"
			response.json[0].id == domainId
			response.status == OK.value()
	}
	
	
	void "Test deleting other ${className} instance."() {//This is for creating some data to test list sorting
		when: "Delete ${propertyName}"
			response = deleteDomainItem(otherDomainId.toString())
		then:
			response.status == NO_CONTENT.value()
	}
	
	
	void "Test deleting ${className} instance."() {
		when: "Delete ${propertyName}"
			response = deleteDomainItem(domainId.toString())
		then:
			response.status == NO_CONTENT.value()
	}
<% }%>
}
