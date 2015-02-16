package defpackage

import grails.transaction.Transactional
import grails.util.Holders
import grails.converters.JSON
import org.codehaus.groovy.grails.commons.GrailsApplication

@Transactional(readOnly = true)
class StatisticsController {

	static responseFormats = ['json']
	GrailsApplication grailsApplication

	def appInfo() {
		Map metadata = Holders.grailsApplication.metadata
		Map appInfo = ['version': metadata['app.version']]
		render appInfo as JSON
	}

	def lastInserted() {
		List lastInsertedDomainClasses = []
		for (domainClass in grailsApplication.domainClasses) {
			List items = domainClass.clazz.findAll(sort: 'id', order: 'desc', max: '5') {
				//Grails wants closure here
			}

			lastInsertedDomainClasses.addAll(items.collect {
				[
						'id'         : it.id,
						'name'       : domainClass.propertyName,
						'displayName': "${domainClass.naturalName}",
						'description': it.hasProperty('name') ?
								it.name : it[domainClass.persistentProperties.first().name].toString()
				]
			})
		}
		render lastInsertedDomainClasses.sort { it.id }.reverse() as JSON
	}

	def totalInserted() {
		List insertedDomainClasses = []
		for (domainClass in grailsApplication.domainClasses) {
			insertedDomainClasses << ['name'       : domainClass.propertyName,
									  'displayName': "${domainClass.naturalName}",
									  'count'      : domainClass.clazz.count()]
		}
		render insertedDomainClasses as JSON
	}

	def lastUpdated() {
		render[] as JSON
	}
}
