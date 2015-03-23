<%= packageName ? "package ${packageName}" : '' %>
<%
allProps = scaffoldingHelper.getProps(domainClass)
props = allProps.findAll{p->!p.oneToMany && !p.manyToMany}


private renderSearchRow(p, parentProperty = null){
	String parentPropName = (parentProperty?.component) ? parentProperty?.name + '.' : ''
	if (p.cp.display != false) {
		//System.out.println (p.type)
		String str = ""
		if (p.type == Boolean || p.type == boolean)
			str += """eq('${parentPropName}${p.name}', filter['${parentPropName}${p.name}'].toString().toBoolean())"""
		else if (p.cp && p.cp.inList)
			str += "//inList"
		else if (p.type && Number.isAssignableFrom(p.type) || (p.type?.isPrimitive() && p.type != boolean)) {
			if (p.type == Integer.class) {
				str += """eq('${parentPropName}${p.name}', filter['${parentPropName}${p.name}'].toString().toInteger())"""
			} else if (p.type == Long.class || p.type == long) {
				str += """eq('${parentPropName}${p.name}', filter['${parentPropName}${p.name}'].toString().toLong())"""
			} else if (p.type == Double.class || p.type == double) {
				str += """eq('${parentPropName}${p.name}', filter['${parentPropName}${p.name}'].toString().toDouble())"""
			} else if (p.type == Float.class || p.type == float) {
				str += """eq('${parentPropName}${p.name}', filter['${parentPropName}${p.name}'].toString().toFloat())"""
			} else {
				str += """eq('${parentPropName}${p.name}', filter['${parentPropName}${p.name}'])"""
			}
		}else if (p.type == String)
			str += """ilike('${parentPropName}${p.name}', "\${filter['${parentPropName}${p.name}']}%")"""
		else if (p.type == Date || p.type == java.sql.Date || p.type == java.sql.Time || p.type == Calendar) {
			println """
			if (filter['${parentPropName}${p.name}']) {
				Date d
				if(filter['${parentPropName}${p.name}'].toString().isNumber()){
					d = new Date(filter['${parentPropName}${p.name}'].toString().toLong())
				}else{
					String inputFormat = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"
					d = Date.parse(inputFormat, filter['${parentPropName}${p.name}'].toString())
				}

				between('${parentPropName}${p.name}', d, d+1)
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
			if (filter['${parentPropName}${p.name}s']) {
				'in'('${parentPropName}${p.name}.id', filter['${parentPropName}${p.name}s'].collect { (long) it })
			}
			if (filter['${parentPropName}${p.name}']) {
				eq('${parentPropName}${p.name}.id', (long) filter['${parentPropName}${p.name}'])
			}\
"""
		} else if ((p.oneToMany && !p.bidirectional) || p.manyToMany) {
			str += "//manyToMany"
		}
		else if (p.oneToMany)
			str += "//oneToMany"
		else if (p.joinProperty){
			str += "//joinProperty"
		}
		else
			str += "//No type for ${p.name}"

		if (str) println "\t\t\t" + "if (filter['${parentPropName}${p.name}']) {\n\t\t\t\t" + str + "\n\t\t\t}"
	}
}

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
import defpackage.exceptions.ResourceNotFound

//@GrailsCompileStatic
@Transactional(readOnly = true)
class ${className}SearchService {

	${className} queryFor${className}(Long ${domainClass.propertyName}Id) {
		if (!${domainClass.propertyName}Id || ${domainClass.propertyName}Id < 0) {
			throw new IllegalArgumentException('no.valid.id')
		}
		${className} ${domainClass.propertyName} = ${className}.where { id == ${domainClass.propertyName}Id }.find()
		if (!${domainClass.propertyName}) {
			throw new ResourceNotFound("No ${className} found with Id :[\$${domainClass.propertyName}Id]")
		}
		return ${domainClass.propertyName}
	}

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
				if(p.embedded){
					def embeddedProps = scaffoldingHelper.getProps(p.component).grep{it.name!= 'id'}
					embeddedProps.each{ep->
						renderSearchRow(ep, p)
					}
				}else{
					renderSearchRow(p)
				}

			}
			%>\
		}
	}
}
