<%=packageName ? "package ${packageName}" : ''%>

import spock.lang.Shared
import spock.lang.Ignore
import org.springframework.http.HttpStatus
import defpackage.RestQueries
import defpackage.AuthQueries
import spock.lang.Specification
<%
import grails.plugin.scaffold.angular.DomainHelper


import java.text.SimpleDateFormat

import org.codehaus.groovy.grails.commons.DomainClassArtefactHandler
import org.codehaus.groovy.grails.commons.DefaultGrailsDomainClass
import grails.converters.JSON

String propertyName = domainClass.propertyName;
String shortNameLower = propertyName.toLowerCase()+"s";

allProps = scaffoldingHelper.getProps(domainClass)
simpleProps = allProps.findAll{ p -> !p.embedded && !p.oneToMany && !p.manyToMany}

private String getSearchString(){
	Map useDisplaynames = scaffoldingHelper.getDomainClassDisplayNames(domainClass)

	String searchField = useDisplaynames.grep{it.key != "id"}.find{true}?.key
	def inst = DomainHelper.createOrGetInst(domainClass, 2)

	return (inst && searchField && inst[searchField]!=null) ? inst[searchField] : "INSERT SOMETHING SEARCHABLE"
}

// get grails domain class mapping to check if id is composite. When composite then don't render alla tests
isComposite = DomainHelper.isComposite(domainClass)

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

private renderAll(def dClass, boolean isResp = false, int groupId){
	
	String resp = ""
	def inst = DomainHelper.createOrGetInst(dClass, groupId)
	if(inst) resp += createDomainInstanceJson(dClass, isResp, inst)

	println resp
}

private String createDomainInstanceJson(def dClass, boolean isResp, def inst, List alreadyCreatedClasses = []){
	alreadyCreatedClasses << dClass.name
	
	String respStr = ""
	def properties = scaffoldingHelper.getProps(dClass).findAll{p->!p.isManyToMany() && !p.isOneToMany()}
	
	
	properties.each{p->
		String str = (isResp)?"\t\t\tresponse.json.":"\t\t\t\t"
		String asign = (isResp)?"==":"="
		
		if(DomainClassArtefactHandler.isDomainClass(p.type) ){
			def refClass = new DefaultGrailsDomainClass(p.type)
			/*if(!alreadyCreatedClasses.contains(refClass.name)){
				alreadyCreatedClasses << refClass.name
				//def refClass = (p.referencedDomainClass)?p.referencedDomainClass:p.getReferencedPropertyType()
				
				//check if composite id
				
				if(isResp){
					//str +="${p.name}?.id $asign $val\n"
				}else{
					str +="${p.name}{\n\t"
					str += createDomainInstanceJson(refClass, isResp, DomainHelper.createOrGetInst(refClass, 10), alreadyCreatedClasses)
					str +="\t\t\t\t}\n"
					respStr += str
				}
			}*/
			def val
			refClass.getClazz().withNewTransaction{status ->
				try {
					val = refClass.getClazz().first(sort: 'id')?.id

				} catch (Exception ex) {
					println ex.message
				}
			}

			
			if(isResp){
				str +="${p.name}?.id $asign $val\n"
			}else{
				str +="${p.name} $asign $val\n"
			}
			respStr += str
			
		} else {

			def val = inst."${p.name}"
			if (p.type && Number.isAssignableFrom(p.type) || (p.type?.isPrimitive() || p.type == boolean || p.type == Boolean)){
				if(p.type == boolean || p.type == Boolean) val = true
				str +="${p.name} $asign $val\n"
			}else if(p.type == Date || p.type == java.sql.Date || p.type == java.sql.Time || p.type == Calendar){
				def inputFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSSZ")
				def outputFormat = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss'Z'")
				outputFormat.timeZone = java.util.TimeZone.getTimeZone( 'GMT' )
				val?.clearTime()
				String dateStr = (val)?inputFormat.format(val):''
				
				if(isResp){//format input differently then comparison
					dateStr = (val)? outputFormat.format(val):''
				}
				str +="${p.name} $asign '$dateStr'\n"
			}else{
				str +="${p.name} $asign '$val'\n"
			}
			respStr += str
		}
		
	}
	return respStr
}
%>
class ${className}Spec extends Specification implements RestQueries, AuthQueries{

	String REST_URL = "\${APP_URL}/${shortNameLower}"
	
	@Shared
	Long domainId
	@Shared
	Long otherDomainId
	
	@Shared
	def authResponse
	
	@Shared
	def response
	
	def setupSpec() {
		authResponse = sendCorrectCredentials(APP_URL)
	}
<% if(!isComposite){%>
	void 'Test creating another ${className} instance.'() {//This is for creating some data to test list sorting
		when: 'Create ${propertyName}'
			response = sendCreateWithData(){
<%renderAll(domainClass, false, 3)%>\
			}
			<%if(!isComposite){%>
			otherDomainId = response.json.id
			<%}%>
			
		then: 'Should create and return created values'
<%renderAll(domainClass, true, 3)%>\
			response.status == HttpStatus.CREATED.value()
	}

	void 'Test creating ${className} instance.'() {
		when: 'Create ${propertyName}'
			response = sendCreateWithData(){
<%renderAll(domainClass, false, 1)%>\
			}
			<%if(!isComposite){%>
			domainId = response.json.id
			<%}%>
			
		then: 'Should create and return created values'
			
<%renderAll(domainClass, true, 1)%>\
			response.status == HttpStatus.CREATED.value()
	}
	
	
			
		

	void 'Test reading ${className} instance.'() {
		when: 'Read ${propertyName}'
			response = readDomainItemWithParams(domainId.toString(), "")
		then: 'Should return correct values'
			
<%renderAll(domainClass, true, 1)%>\
			response.status == HttpStatus.OK.value()
	}
	
	
	void 'Test excluding fields from reading ${className} instance.'() {
		when: 'Read ${propertyName} id excluded'
			response = readDomainItemWithParams(domainId.toString(), 'excludes=id')
		then: 'Should not return id'
			response.json.id == null
			response.status == HttpStatus.OK.value()
	}
	
	
	void 'Test including fields from reading ${className} instance.'() {
		when: 'Read ${propertyName} id excluded and then included'
			response = readDomainItemWithParams(domainId.toString(), 'excludes=id&includes=id')
		then: 'Should return id'
			response.json.id != null
			response.status == HttpStatus.OK.value()
	}
	
	
	void 'Test reading unexisting ${className} instance.'() {
		when: 'Find unexisting ${propertyName}'
			response = readDomainItemWithParams('9999999999', '')
		then: 'Should not find'
			response.status == HttpStatus.NOT_FOUND.value()
		when: 'Find unexisting ${propertyName} id not a number'
			response = readDomainItemWithParams('nonexistent', '')
		then: 'Should not find'
			response.status == HttpStatus.NOT_FOUND.value()
	}

	
	void 'Test updating ${className} instance.'() {
		when: 'Update ${propertyName}'
			response = sendUpdateWithData(domainId.toString()){
<%renderAll(domainClass, false, 2)%>
			}
		then: 'Should return updated values'
<%renderAll(domainClass, true, 2)%>
			response.status == HttpStatus.OK.value()
	}

	void 'Test updating unexisting ${className} instance.'() {
		when: 'Update unexisting ${propertyName}'
			response = sendUpdateWithData('9999999999'){
	<%renderAll(domainClass, false, 2)%>
			}
		then: 'Should not find'
			response.status == HttpStatus.NOT_FOUND.value()
			
		when: 'Update unexisting ${propertyName} id not a number'
			response = sendUpdateWithData('nonexistent'){
	<%renderAll(domainClass, false, 2)%>
			}
		then: 'Should not find'
			response.status == HttpStatus.NOT_FOUND.value()
	}
	
	void 'Test ${className} list sorting.'() {
		when: 'Get ${propertyName} sorted list DESC'
			response = queryListWithParams('order=desc&sort=id')

		then: 'First item should be just inserted object'
			response.json[0].id == domainId
			response.status == HttpStatus.OK.value()
		
		when: 'Get ${propertyName} sorted list ASC'
			response = queryListWithParams('order=asc&sort=id')

		then: 'First item should not be just inserted object'
			response.json[0].id != domainId
			response.status == HttpStatus.OK.value()
	}
	
	
	void 'Test ${className} list max property query 2 items.'() {
		when: 'Get ${propertyName} list with max 2 items'
			response = queryListWithParams('max=2')

		then: 'Should be only 2 items'
			response.json.size() == 2
	}
	
	
	<%
	domainClasses.first().getClazz().withTransaction{
	if(domainClasses.first().getClazz().count()<= 100){%>@Ignore<%}}%> // have to have more then maxLimit items
	void 'Test ${className} list max property.'() {
		given:
			int maxLimit = 100// Set real max items limit
			
		when: 'Get ${propertyName} list without max param'
			response = queryListWithParams('')

		then: 'Should return default maximum items'
			response.json.size() == 10
			
		when: 'Get ${propertyName} list with maximum items'
			response = queryListWithParams("max=\$maxLimit")

		then: 'Should contains maximum items'
			response.json.size() == maxLimit
			
		when: 'Get ${propertyName} list with maximum + 1 items'
			response = queryListWithParams("max=\${maxLimit+1}")

		then: 'Should contains maximum items'
			response.json.size() == maxLimit
	}
	
	
	void 'Test excluding fields in ${className} list.'() {
		when: 'Get ${propertyName} sorted list'
			response = queryListWithParams('excludes=id')

		then: 'First item should be just inserted object'
			response.json[0].id == null
	}
	
	
	void 'Test including fields in ${className} list.'() {
		when: 'Get ${propertyName} sorted list'
			response = queryListWithParams('excludes=id&includes=id')

		then: 'First item should be just inserted object'
			response.json[0].id != null
	}

	void 'Test querying in ${className} list by dummy searchString.'() {
		when: 'Get ${propertyName} list by searchString'
			response = queryListWithUrlVariables('searchString={searchString}', [searchString: "999999999999999"])

		then: 'Should be with size 0'
			response.json.size() == 0
			response.status == HttpStatus.OK.value()
	}

	void 'Test querying in ${className} list by real searchString.'() {
		when: 'Get ${propertyName} list by searchString'
			response = queryListWithUrlVariables('order=desc&sort=id&searchString={searchString}',
					[searchString: "${getSearchString()}"])

		then: 'Should at least last inserted item'
			response.json[0].id == domainId
			response.json.size() > 0
			response.status == HttpStatus.OK.value()
	}

	void 'Test filtering in ${className} list by id.'() {
		when: 'Get ${propertyName} list filtered by id'

			response = queryListWithUrlVariables('filter={filter}', [filter:"{id:\${domainId}}"])

		then: 'Should contains one item, just inserted item.'
			response.json[0].id == domainId
			response.json.size() == 1
			response.status == HttpStatus.OK.value()
	}
	
	void 'Test filtering in ${className} list by all properties.'() {
		given:
			response = queryListWithUrlVariables('filter={filter}', [filter:"\${jsonVal}"])
			<%
			def instBefore = DomainHelper.createOrGetInst(domainClass, 1)//comparing instBefore and inst variables decides if test results 1 or 10 items in output
			def inst = DomainHelper.createOrGetInst(domainClass, 2)
			%>
			
		expect:
			response.json.size() == respSize
		where:
			jsonVal 	        || respSize
			'{}'                || 10
<% if(instBefore && inst)simpleProps.each{p->
		def hasChanged = !(instBefore."${p.name}" == inst."${p.name}")
		if(p.type == Date || p.type == java.sql.Date || p.type == java.sql.Time || p.type == Calendar){
			hasChanged = false
		}
		def val = inst."${p.name}"
		def realVal = DomainHelper.getRealValue(p, val)
		def jsonVal
		if(p.referencedDomainClass?.hasProperty('id')){
			def refClass = new DefaultGrailsDomainClass(p.type)

			refClass.getClazz().withNewTransaction{status ->
				try {
					realVal = refClass.getClazz().first(sort: 'id')?.id
				} catch (Exception ex) {
					println ex.message;
				}
			}

			jsonVal = (["${p.name}":realVal] as JSON).toString()
			println "\t\t\t'$jsonVal' || 2 "

			jsonVal = (["${p.name}s":[realVal]] as JSON).toString()
			println "\t\t\t'$jsonVal' || 2 "
		}else{
			jsonVal = (["${p.name}":realVal] as JSON).toString()
			if(hasChanged && jsonVal.matches(".*\\s+.*")){
				print "//Can't predict 'size'"
			}
			def nr = hasChanged? 1: 10
			println "\t\t\t'$jsonVal' || $nr "
		}
}%>
	}
	
	
	
	
	void "Test deleting other ${className} instance."() {//This is for creating some data to test list sorting
		when: "Delete ${propertyName}"
			response = deleteDomainItem(otherDomainId.toString())
		then:
			response.status == HttpStatus.NO_CONTENT.value()
	}
	
	
	void "Test deleting ${className} instance."() {
		when: "Delete ${propertyName}"
			response = deleteDomainItem(domainId.toString())
		then:
			response.status == HttpStatus.NO_CONTENT.value()
	}
<% }%>
}
