<%=packageName ? "package ${packageName}\n" : ''%>


import grails.transaction.Transactional
import groovy.json.*
import org.codehaus.groovy.grails.commons.DefaultGrailsDomainClass
import grails.converters.JSON

@Transactional
class ${className}Service{

  static List parseParamsAndRetrieveListAndCount(def resource, Map param){

		//Search relation queries e.g: user.id=1
		Map relations = param.findAll{k, v->
			k.endsWith('.id')
		}

		
		def searchString = param.query


		def persistentProperties = new DefaultGrailsDomainClass(resource).persistentProperties

		def persistentPropertiesMap = [:] as HashMap
		persistentProperties.each {
			persistentPropertiesMap.put(it.name, it)
		}
		def	results = resource.createCriteria().list(offset:param.offset, max:param.max, order:param.order, sort:param.sort) {

			//make relation query
			relations.each{k, v->
				eq(k, v.toLong())
			}

			//Filters
			if(param.filter)param.filter = JSON.parse(param.filter)
			param.filter.each{k,v->
				def property = persistentPropertiesMap[k]
				def value = v

				
				if(k.endsWith('.id')) {//Search for relation
					eq(k, value.toLong())
				}else if(property && value) {
					log.info "Searching \$property => \$value"
					if (property.type == String) {
						ilike ("\$property.name",  value+'%')
					} else if(property.type == Integer){
						eq("\$property.name", value.toInteger())
					} else if(property.type == Long){
						eq("\$property.name", value.toLong())
					} else if(property.type == Double){
						eq("\$property.name", value.toDouble())
					} else if( property.type == Float){
						eq("\$property.name", value.toFloat())
					}  else if( property.manyToOne || property.oneToOne){
						if(value instanceof String[]){//eg: user
							'in'("\${property.name}.id", value.collect{it.toLong()})
						}else if(value instanceof List){//eg: user
							'in'("\${property.name}.id", value.collect{it.toLong()})
						}else if(value.toString().isNumber()) {
							eq("\${property.name}.id", value.toString().toLong())
						}
					} else if( property.oneToMany || property.manyToMany){// eg: roles
			
						"\${property.name}"{
							if(value instanceof String[]) {
								'in'("id", value.collect{it.toLong()})
							}else if(value instanceof List) {
								'in'("id", value.collect{it.toLong()})
							}else if(value.toString().isNumber()) {
								eq("id", value.toString().toLong())
							}
						}
					}
				}
			}


			//Search from all String and Numeric fields
			if(searchString) {
				List intNumbers = searchString.findAll( /\\d+/ )
				List floatNumbers = searchString.findAll(  /-?\\d+\\.\\d*|-?\\d*\\.\\d+|-?\\d+/ )
				or{
					persistentProperties.each {property->
						if (property.type == String) {
							ilike ("\$property.name",  searchString+'%')
						} else if(property.type == Integer){
							intNumbers*.toInteger().each{
								eq("\$property.name", it)
							}
						} else if(property.type == Long){
							intNumbers*.toLong().each{
								eq("\$property.name", it)
							}

						} else if(property.type == Double){
							floatNumbers*.toDouble().each{
								eq("\$property.name", it)
							}

						} else if( property.type == Float){
							floatNumbers*.toFloat().each{
								eq("\$property.name", it)
							}

						}  else if( property.manyToOne || property.oneToOne){
							intNumbers*.toLong().each{
								eq("\${property.name}.id", it)
							}
						}
						intNumbers*.toLong().each{ eq("id", it) }
					}
				}
			}
		}

		return results
	}
}
