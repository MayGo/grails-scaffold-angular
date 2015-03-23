package defpackage

import grails.converters.JSON
import org.codehaus.groovy.grails.commons.DefaultGrailsDomainClass
<%
allDomainClasses.each{
	println "import ${it.fullName}"
}
%>
class CustomMarshallerRegistrar {

	static Map domainPropertiesCache = [:]

	static List getDomainProperties(Class domainClass) {
		String name = domainClass.name

		if (domainPropertiesCache[name]) {
			return domainPropertiesCache[name]
		}

		def grailsDomainClass = new DefaultGrailsDomainClass(domainClass)

		domainPropertiesCache[name] = grailsDomainClass.persistentProperties*.name

		return domainPropertiesCache[name]
	}

	static Map createMap(List excludesList = []) {
		Map excludes = { [:].withDefault { owner.call() } } ()

		for (item in excludesList) {
			List parts = item?.tokenize('.')

			if (parts?.size() > 1 && parts.first() in excludesList) {
				continue
			}

			Map m = excludes
			parts.each {
				m = m[it.toString()]
			}
		}
		return excludes
	}

	static Map filter(domain, Map excludes) {
		if (!domain) {
			return [:]
		}

		Map res = [:]

		if (!excludes.containsKey('id')) {
			res << [id: domain.id]
		}
		if (!excludes.containsKey('version')) {
			res << [version: domain.version]
		}
		for (String key in getDomainProperties(domain.class)) {
			def value = domain[key]
			if (excludes.containsKey(key) && !excludes[key]) {
				continue
			}
			if (excludes.containsKey(key) && excludes[key] && value) {
				boolean isCollection = (value instanceof SortedMap
						|| value instanceof SortedSet
						|| value instanceof Set
						|| value instanceof Map
						|| value instanceof Collection)
				if (isCollection) {
					List objList = []
					for (d2 in value) {
						objList << filter(d2, excludes[key])
					}
					res[key] = objList
				} else {
					res[key] = filter(value, excludes[key])
				}
			} else if (value != null && value != '') {
				if (value.class?.isEnum()) {
					res[key] = value.name()
				} else {
					res[key] = value
				}
			}
		}
		return res
	}

	@javax.annotation.PostConstruct
    static void registerMarshallers() {
		int priority = 10
		JSON.registerObjectMarshaller(Date) {
			return it?.time
		}
<%



	for(d in allDomainClasses){

		%>
		JSON.registerObjectMarshaller ${d.name}, priority, { ${d.name} instance, JSON json ->
<%
		List defaultExcludes = []
		for(domainProperty in d.persistentProperties){
			//if(domainProperty.oneToMany || domainProperty.manyToMany) defaultExcludes << "'${domainProperty.name}'"

			if(domainProperty.isAssociation() && !domainProperty.embedded){
				Map useDisplaynames = scaffoldingHelper.getDomainClassDisplayNames(d, domainProperty)

				if(domainProperty.manyToOne || domainProperty.oneToOne){
					defaultExcludes << "\n'${domainProperty.name}Id'"
				}else if(domainProperty.bidirectional){
					defaultExcludes << "\n'${domainProperty.name}'"
					continue
				}

				for(relationProp in domainProperty.getReferencedDomainClass().persistentProperties){
					defaultExcludes << "\n'${domainProperty.name}.${relationProp.name}'"
					if(relationProp.manyToOne || relationProp.oneToOne){
						defaultExcludes << "\n'${domainProperty.name}.${relationProp.name}Id'"
					}
				}
				useDisplaynames.each{ displayKey, displayValue ->
					defaultExcludes -= "\n'${domainProperty.name}.${displayKey}'"
					/*displayValue?.each{
						defaultExcludes -= "'${domainProperty.name}.${displayKey}.$it'"
					}*/
				}
			}
		}%>\
			Class cl = instance.getClass()
			List defaultExcludes = ${defaultExcludes.toString().replaceAll(' ','')}
			Map excludes = createMap(defaultExcludes + json.getExcludes(cl) - json.getIncludes(cl))
			return filter(instance, excludes)
		}\
<%}%>
    }
}
