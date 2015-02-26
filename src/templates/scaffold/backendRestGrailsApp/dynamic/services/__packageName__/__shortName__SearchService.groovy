<%= packageName ? "package ${packageName}" : '' %>
<%
allProps = scaffoldingHelper.getProps(domainClass)
props = allProps.findAll{p->!p.embedded && !p.oneToMany && !p.manyToMany}


private void printSearchCriteria(){
	Map useDisplaynames = scaffoldingHelper.getDomainClassDisplayNames(domainClass)
	if(!useDisplaynames) useDisplaynames = ["id":null]
	println """
			if (searchString) {
				or {
					eq('id', -1L)"""

	useDisplaynames.each{key, value->
		def property = allProps.find{it.name == key}
		String str = "\t\t\t\t\t"
		if(property) {
			if (property.type == String) {
				str += "like('$property.name', searchString + '%')"
			} else if (property.type == Integer) {
				str = """
					if (searchString.isInteger()) {
						eq('$property.name', searchString.toInteger())
					}"""
			} else if (property.type == Long) {
				str = """
					if (searchString.isLong()) {
						eq('$property.name', searchString.toLong())
					}"""
			} else if (property.type == Double) {
				str = """
					if (searchString.isDouble()) {
						eq('$property.name', searchString.toDouble())
					}"""
			} else if (property.type == Float) {
				str = """
					if (searchString.isFloat()) {
						eq('$property.name', searchString.toFloat())
					}"""
			} else if (property.manyToOne || property.oneToOne) {
				str = """
					if (searchString.isFloat()) {
						eq('${property.name}.id', searchString.toFloat())
					}"""
			} else if (property.type == Boolean || property.type == boolean){
				str = """
					if (searchString.equalsIgnoreCase('false') || searchString.equalsIgnoreCase('true')) {
						eq('${property.name}', searchString.toBoolean())
					}"""
			}else{
				str += "// no type defined for $key "
			}

		} else if(key == "id"){
			str = """
					if (searchString.isLong()) {
						eq('id', searchString.toLong())
					}"""
		}else{
			str += "// no property $key found"
		}
		println str
	}
	println "\t\t\t\t}\n\t\t\t}"
}
%>
import grails.compiler.GrailsCompileStatic
import grails.gorm.PagedResultList
import grails.converters.JSON
import grails.transaction.Transactional
import org.codehaus.groovy.grails.web.json.JSONElement
import org.codehaus.groovy.grails.web.json.JSONObject
import org.grails.datastore.mapping.query.api.BuildableCriteria


//@GrailsCompileStatic
@Transactional(readOnly = true)
class ${className}SearchService {

	PagedResultList search(Map params) {

		BuildableCriteria criteriaBuilder = (BuildableCriteria) ${domainClass.name}.createCriteria()
		PagedResultList results = (PagedResultList) criteriaBuilder.list(
				offset: params.offset,
				max: params.max,
				order: params.order,
				sort: params.sort
		) {
			searchCriteria criteriaBuilder, params
		}
		return results
	}

	private void searchCriteria(BuildableCriteria builder, Map params) {
		String searchString = params.searchString
		JSONElement filter = params.filter ? JSON.parse(params.filter.toString()) : new JSONObject()

		builder.with {
			//readOnly true
<%
			println """
			if (filter['id']) {
				eq('id', filter['id'].toString().toLong())
			}"""
			//lets find property to be used in searchString
			printSearchCriteria()

			props.each { p ->
			boolean hasHibernate = pluginManager?.hasGrailsPlugin('hibernate') || pluginManager?.hasGrailsPlugin('hibernate4')
			boolean required = false
			if (hasHibernate) {
				cp = domainClass.constrainedProperties[p.name] ?: [:]
				required = (cp ? !(cp.propertyType in [boolean, Boolean]) && !cp.nullable : false)
				display = (cp ? cp.display : true)
			}
			// Find if property is actually joinTable property. e.g. UserRole
			def joinProperty
			if(p.referencedDomainClass)  {
				def persistentProperties = p.referencedDomainClass.persistentProperties
				joinProperty = persistentProperties.find{
					it != p &&
							persistentProperties.size() == 2 && it.referencedDomainClass
				}
			}

			if (display) {
				//System.out.println (p.type)
				String str = ""
				if (p.type == Boolean || p.type == boolean)
					str += """eq('${p.name}', filter['${p.name}'].toString().toBoolean())"""
				else if (cp && cp.inList)
					str += "//inList"
				else if (p.type && Number.isAssignableFrom(p.type) || (p.type?.isPrimitive() && p.type != boolean)) {
					if (p.type == Integer.class) {
						str += """eq('${p.name}', filter['${p.name}'].toString().toInteger())"""
					} else if (p.type == Long.class) {
						str += """eq('${p.name}', filter['${p.name}'].toString().toLong())"""
					} else if (p.type == Double.class || p.type == double) {
						str += """eq('${p.name}', filter['${p.name}'].toString().toDouble())"""
					} else if (p.type == Float.class || p.type == float) {
						str += """eq('${p.name}', filter['${p.name}'].toString().toFloat())"""
					} else {
						str += """eq('${p.name}', filter['${p.name}'])"""
					}
				}else if (p.type == String)
					str += """ilike('${p.name}', "\${filter['${p.name}']}%")"""
				else if (p.type == Date || p.type == java.sql.Date || p.type == java.sql.Time || p.type == Calendar) {
					println """
			if (filter['${p.name}']) {
				String inputFormat = "yyyy-MM-dd HH:mm:ss.SSSZ"
				Date d = Date.parse(inputFormat, filter['${p.name}'].toString())
				between('${p.name}', d, d)
			}"""
				}else if (p.type == URL)
					str += "//url"
				else if (p.type && p.isEnum())
					str += "//enum"
				else if (p.type == TimeZone)
					str += "//TimeZone"
				else if (p.type == Locale)
					str += "//Locale"
				else if (p.type == Currency)
					str += "//Currency"
				else if (p.type==([] as byte[]).class) //TODO: Bug in groovy means i have to do this :(
					str += "//byte"
				else if (p.manyToOne || p.oneToOne) {
					println """
			if (filter['${p.name}s']) {
				'in'('${p.name}.id', filter['${p.name}s'].collect { (long) it })
			}
			if (filter['${p.name}']) {
				eq('${p.name}.id', (long) filter['${p.name}'])
			}\
"""
				} else if ((p.oneToMany && !p.bidirectional) || p.manyToMany) {
					str += "//manyToMany"
				}
				else if (p.oneToMany)
					str += "//oneToMany"
				else if (joinProperty){
					str += "//joinProperty"
				}
				else
					str += "//No type for ${p.name}"

				if (str) println "\t\t\t" + "if (filter['${p.name}']) {\n\t\t\t\t" + str + "\n\t\t\t}"
			}
}%>\
		}
	}
}
