package grails.plugin.scaffold.angular

import grails.buildtestdata.DomainInstanceBuilder


class BuildTestDataHelper {

	def static originalMethod

	public static addCustomFunctionality() {



		originalMethod = DomainInstanceBuilder.metaClass.findRequiredPropertyNames
		DomainInstanceBuilder.metaClass.findRequiredPropertyNames = {domainArtefact->
			println "Overriden method................................................................................" +
					"............."
			def constrainedProperties = domainArtefact.constrainedProperties
			def propNames = domainArtefact.persistentProperties.findAll{p->!p.isAssociation()}*.name

			def allPropertyNames = constrainedProperties.keySet()
			return allPropertyNames.findAll { propName ->
				propNames.contains(propName) ||  !constrainedProperties."$propName".isNullable()
			}
		}

		/*
		def dClazz = domainClass.clazz
		originalMethod = dClazz.metaClass.'static'.buildWithoutSave
		dClazz.metaClass.'static'.buildWithoutSave = { ->
			println "Overriden method................................................................................" +
					"............."
			def domainInstanceBuilder = delegate.domainInstanceBuilders[domainClass]
			domainInstanceBuilder.metaClass.findRequiredPropertyNames = { domainArtefact ->
				def constrainedProperties = domainArtefact.constrainedProperties
				def propNames = domainArtefact.persistentProperties.findAll { p -> !p.isAssociation() }*.name
				def allPropertyNames = constrainedProperties.keySet()
				return allPropertyNames.findAll { propName ->
					propNames.contains(propName)
				}
			}
			domainInstanceBuilder.buildWithoutSave([:])
		}*/
	}

	public static removeCustomFunctionality() {
		//def dClazz = domainClass.clazz
		//dClazz.metaClass.'static'.buildWithoutSave = originalMethod
		DomainInstanceBuilder.metaClass.findRequiredPropertyNames = originalMethod
	}
}
