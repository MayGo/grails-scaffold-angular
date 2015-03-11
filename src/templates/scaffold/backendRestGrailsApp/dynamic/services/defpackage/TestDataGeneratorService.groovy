package defpackage

<%
import org.codehaus.groovy.grails.commons.DomainClassArtefactHandler
import org.codehaus.groovy.grails.commons.DefaultGrailsDomainClass

	allDomainClasses.each{
		println "import ${it.fullName}"
	}
	firstDomainClass = domainClasses.first().getName()

	private List findNotNullable(def dClass){
		def props = scaffoldingHelper.getProps(dClass)
		List notNullable = []
		props.each{ p->
			boolean hasHibernate = pluginManager?.hasGrailsPlugin('hibernate') || pluginManager?.hasGrailsPlugin('hibernate4')
			boolean required = false
			if (hasHibernate) {
				cp = dClass.constrainedProperties[p.name]?:[:]
				required = (cp ? !(cp.propertyType in [boolean, Boolean]) && !cp.nullable : false)
			}
			if(required) notNullable << p
		}
		return notNullable
	}

	private findNotNullableRelations(def dClass){
		return findNotNullable(dClass).findAll{p->DomainClassArtefactHandler.isDomainClass(p.type)}
	}
	
	private String findNotNullableRelationsAsString(dClass){
		
		return findNotNullableRelations(dClass).collect{ p ->
			p.name + ": " + new DefaultGrailsDomainClass(p.type).name + ".build()"
		}.join(", ")
	}
%>
class TestDataGeneratorService {

	static transactional = false

	def sessionFactory
	def propertyInstanceMap = org.codehaus.groovy.grails.plugins.DomainClassGrailsPlugin.PROPERTY_INSTANCE_MAP

	void generate() {
		log.info 'Generating test data.'
		boolean generateTestData = true

		${firstDomainClass}.withNewTransaction {
			generateTestData = (${firstDomainClass}.count() == 0)
		}
		if (!generateTestData) {
			log.info '${firstDomainClass} count is bigger than 0. Not generating test data.'
			return
		}

		(1..150).each { index ->
			${firstDomainClass}.withNewTransaction {
<% domainClasses.each { dClass ->%>
				${dClass.getName()}.build(${findNotNullableRelationsAsString(dClass)})\
<%}%>

				if (index % 20 == 0) {
					cleanUpGorm()
				}
			}
		}
		log.info 'Generated test data.'
	}

	def cleanUpGorm() {
		log.info 'Clean Up Gorm'
		def session = sessionFactory.currentSession
		session.flush()
		session.clear()
		propertyInstanceMap.get().clear()
	}
}
