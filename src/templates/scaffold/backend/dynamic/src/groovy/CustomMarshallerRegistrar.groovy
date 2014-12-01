import grails.converters.JSON
import org.codehaus.groovy.grails.commons.DefaultGrailsDomainClass
class CustomMarshallerRegistrar {
	
	static Map domainPropertiesCache = [:]
	
	static List getDomainProperties(Class domainClass){
		String name = domainClass.name
		if(domainPropertiesCache[name]) return domainPropertiesCache[name]
		def grailsDomainClass = new DefaultGrailsDomainClass(domainClass)
		domainPropertiesCache[name] = grailsDomainClass.getPersistentProperties()*.name
		return domainPropertiesCache[name]
	}
	
	static Map createMap(List excludesList = []){
		Map excludes = { [:].withDefault{ owner.call() } }()
		for(item in excludesList){
			List parts = item?.tokenize(".")
			if(parts?.size()>1 && parts.first() in excludesList) continue
			Map m = excludes
			parts.each{
				m = m["\$it"]
			}
		}
		return excludes
	}
	
	
	
	static Map filter( domain, Map excludes){
		if(!domain) return [:]
		Map res = [:]
		if(!excludes.containsKey("id"))res << [id: domain.id]
		for(key in getDomainProperties(domain.class)){
			def value = domain[key]
			if(excludes.containsKey(key) && !excludes["\${key}"]) continue
			if(excludes.containsKey(key) && excludes["\${key}"] && value){
				boolean isCollection = (value instanceof SortedMap
					|| value instanceof SortedSet
					|| value instanceof Set
					|| value instanceof Map
					|| value instanceof Collection)
				if(isCollection){
					List objList = []
					for(d2 in value){
						objList << filter(d2, excludes["\${key}"])
					}
					res << ["\${key}":objList]
				}else{
					res << ["\${key}":filter(value, excludes["\${key}"])]
				}
			}else if(value){
				if(value.class.isEnum()){
					res << ["\${key}": value.name()]
				}else{
					res << ["\${key}": value]
				}
			}
		}
		return res
	}
	
    @javax.annotation.PostConstruct
    static void registerMarshallers() {             
		<%
		import grails.plugin.scaffold.core.ScaffoldingHelper
		for(d in domainClasses){
			excludeProps = d.properties.findAll{p->p.oneToMany || p.manyToMany}*.getName()
			excludePropsStr = ""
			if(excludeProps) excludePropsStr = excludeProps.collect{"'"+grails.util.GrailsNameUtils.getShortName(it)+"'"}.join(", ")
		%>
		JSON.registerObjectMarshaller ${d.fullName}, {${d.fullName} instance, JSON json->
	<% 
		List defaultExcludes = []
		for(domainProperty in d.persistentProperties){ 
			//if(domainProperty.oneToMany || domainProperty.manyToMany) defaultExcludes << "'${domainProperty.name}'"
		
			if(domainProperty.isAssociation()){
				Map useDisplaynames = ScaffoldingHelper.getDomainClassDisplayNames(d, config, domainProperty)
				
				
				if(domainProperty.manyToOne || domainProperty.oneToOne){
					defaultExcludes << "'${domainProperty.name}Id'"
				}else{
					defaultExcludes << "'${domainProperty.name}'"
					continue
				}
				
				
				for(relationProp in domainProperty.getReferencedDomainClass().persistentProperties){
					defaultExcludes << "'${domainProperty.name}.${relationProp.name}'"
					if(relationProp.manyToOne || relationProp.oneToOne){
						defaultExcludes << "'${domainProperty.name}.${relationProp.name}Id'"
					}
				}
				useDisplaynames.each{displayKey, displayValue->
					defaultExcludes -= "'${domainProperty.name}.${displayKey}'"
					/*displayValue?.each{
						defaultExcludes -= "'${domainProperty.name}.${displayKey}.$it'"
					}*/
				}
			}
		}
	%>		Class cl = instance.getClass()
			List defaultExcludes = $defaultExcludes 
			Map excludes = createMap(defaultExcludes + json.getExcludes(cl) - json.getIncludes(cl))
			return filter(instance, excludes)
		}
	<%}%>
    }
}