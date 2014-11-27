import grails.converters.JSON
class CustomMarshallerRegistrar {
	
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
		for(d in domain.properties){
			if(excludes.containsKey(d.key) && !excludes["\${d.key}"]) continue
			if(excludes.containsKey(d.key) && excludes["\${d.key}"] && d.value){
				boolean isCollection = (d.value instanceof SortedMap
					|| d.value instanceof SortedSet
					|| d.value instanceof Set
					|| d.value instanceof Map
					|| d.value instanceof Collection)
				if(isCollection){
					List objList = []
					for(d2 in d.value){
						objList << filter(d2, excludes["\${d.key}"])
					}
					res << ["\${d.key}":objList]
				}else{
					res << ["\${d.key}":filter(d.value, excludes["\${d.key}"])]
				}
			}else if(d.value){
				if(d.value.class.isEnum()){
					res << ["\${d.key}": d.value.name()]
				}else{
					res << ["\${d.key}": d.value]
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