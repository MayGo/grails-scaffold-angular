<%= packageName ? "package ${packageName}" : '' %>
<%
import grails.plugin.scaffold.core.ScaffoldingHelper
ScaffoldingHelper sh = new ScaffoldingHelper(domainClass, pluginManager, comparator, getClass().classLoader)
allProps = sh.getProps()
props = allProps.findAll{p->!p.embedded && !p.oneToMany && !p.manyToMany}


private void printSearchCriteria(){
	Map useDisplaynames = ScaffoldingHelper.getDomainClassDisplayNames(domainClass, config)
	if(!useDisplaynames) useDisplaynames = ["id":null]
	println "\t\t\tif (searchString) {"
	useDisplaynames.each{key, value->
		def property = allProps.find{it.name == key}
		String str = ""
		if(property) {
			if (property.type == String) {
				str += "like('$property.name', searchString + '%')"
			} else if (property.type == Integer) {
				str += "eq('$property.name', searchString.toInteger())"
			} else if (property.type == Long) {
				str += "eq('$property.name', searchString.toLong())"
			} else if (property.type == Double) {
				str += "eq('$property.name', searchString.toDouble())"
			}else if (property.type == Float) {
				str += "eq('$property.name', searchString.toFloat())"
			} else if (property.manyToOne || property.oneToOne) {
				str += "eq('${property.name}.id', searchString.toFloat())"
			} else {
				str += "// no type defined for $key "
			}

		} else if(key == "id"){
			str += "eq('id', searchString.toLong())"
		}else{
			str += "// no property $key found"
		}
		println "\t\t\t\t" + str
	}
	println "\t\t\t}"
}
%>
import grails.compiler.GrailsCompileStatic
import grails.converters.JSON
import grails.orm.HibernateCriteriaBuilder
import grails.orm.PagedResultList
import grails.transaction.Transactional
import org.codehaus.groovy.grails.web.json.JSONElement
import org.codehaus.groovy.grails.web.json.JSONObject

@GrailsCompileStatic
@Transactional(readOnly = true)
class ${className}SearchService {

	PagedResultList search(Map params) {

		HibernateCriteriaBuilder criteriaBuilder = (HibernateCriteriaBuilder) ${domainClass.name}.createCriteria()
		PagedResultList results = (PagedResultList) criteriaBuilder.list(
				offset: params.offset,
				max: params.max,
				order: params.order,
				sort: params.sort
		) {
			searchCriteria criteriaBuilder, params
			readOnly true
		}
		return results
	}

	private void searchCriteria(HibernateCriteriaBuilder builder, Map params) {
		String searchString = params.searchString
		JSONElement filter = params.filter ? JSON.parse(params.filter.toString()) : new JSONObject()

		builder.with {
<%
			println """
			if (filter['id']) {
				eq('id', filter['id'].toString().toLong())
			}
"""
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
				else if (p.type == Date || p.type == java.sql.Date || p.type == java.sql.Time || p.type == Calendar)
					str += """between('${p.name}', filter['${p.name}'], filter['${p.name}'])"""
				else if (p.type == URL)
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
