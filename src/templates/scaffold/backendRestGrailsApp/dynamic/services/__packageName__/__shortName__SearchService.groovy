<%= packageName ? "package ${packageName}" : '' %>
<%
allProps = scaffoldingHelper.getProps(domainClass)
props = allProps.findAll{p->!p.oneToMany && !p.manyToMany}


private renderSearchRow(p, parentProperty = null){
	String parentPropName = (parentProperty?.component) ? parentProperty?.name + '?.' : ''
	if (p.cp.display != false) {
		String str = ""
		if (p.cp && p.cp.inList)
			str += "//inList - ${parentPropName}${p.name}"
		else if (p.type && Number.isAssignableFrom(p.type) ||
				(p.type?.isPrimitive() && p.type != boolean) ||
				p.type == Boolean ||
				p.type == boolean) {
			str += """eq('${parentPropName}${p.name}', cmd.${parentPropName}${p.name})"""
		} else if (p.type == String){
			println """\
			if (cmd.${parentPropName}${p.name}){
				ilike('${parentPropName}${p.name}', cmd.${parentPropName}${p.name} + '%')
			}\
"""
			return
		}else if (p.type == Date || p.type == java.sql.Date || p.type == java.sql.Time || p.type == Calendar) {
			str += """\
Date d = cmd.${parentPropName}${p.name}
				between('${parentPropName}${p.name}', d, d + 1)\
"""

		}else if (p.type == URL)
			str += "//url - ${parentPropName}${p.name}"
		else if (p.type && p.isEnum())
			str += "//enum - ${parentPropName}${p.name}"
		else if (p.type == TimeZone)
			str += "//TimeZone - ${parentPropName}${p.name}"
		else if (p.type == Locale)
			str += "//Locale - ${parentPropName}${p.name}"
		else if (p.type == Currency)
			str += "//Currency - ${parentPropName}${p.name}"
		else if (p.type==([] as byte[]).class) //TODO: Bug in groovy means i have to do this :(
			str += "//byte - ${parentPropName}${p.name}"
		else if (p.manyToOne || p.oneToOne) {
			println """\
			if (cmd.${parentPropName}${p.name}s) {
				'in'('${parentPropName}${p.name}.id', cmd.${parentPropName}${p.name}s.collect { (long) it })
			}
			if (cmd.${parentPropName}${p.name} != null) {
				eq('${parentPropName}${p.name}.id', cmd.${parentPropName}${p.name})
			}\
"""
			return
		} else if ((p.oneToMany && !p.bidirectional) || p.manyToMany) {
			str += "//manyToMany - ${parentPropName}${p.name}"
		} else if (p.oneToMany)
			str += "//oneToMany - ${parentPropName}${p.name}"
		else if (p.joinProperty){
			str += "//joinProperty - ${parentPropName}${p.name}"
		} else if(p.type == Map || "${p.type.name}" == "com.google.gson.internal.LinkedTreeMap"){
			str += """eq('${parentPropName}${p.name}', cmd.${parentPropName}${p.name})"""
		} else {
			str += "//No type for  - ${parentPropName}${p.name}"
		}

		println "\t\t\t" + "if (cmd.${parentPropName}${p.name} != null) {\n\t\t\t\t" + str + "\n\t\t\t}"
	}
}

private void printSearchCriteria(){
	Map useDisplaynames = scaffoldingHelper.getDomainClassDisplayNames(domainClass)
	if(!useDisplaynames) useDisplaynames = ["id":null]
	println """\
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
import grails.transaction.Transactional
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

	PagedResultList search(${className}SearchCommand cmd, Map pagingParams) {

		BuildableCriteria criteriaBuilder = (BuildableCriteria) ${domainClass.name}.createCriteria()
		PagedResultList results = (PagedResultList) criteriaBuilder.list(
				offset: pagingParams.offset,
				max: pagingParams.max,
				order: pagingParams.order,
				sort: pagingParams.sort
		) {
			searchCriteria criteriaBuilder, cmd
		}
		return results
	}

	private void searchCriteria(BuildableCriteria builder, ${className}SearchCommand cmd) {
		String searchString = cmd.searchString

		builder.with {
			//readOnly true
<%
			println """\
			if (cmd.id) {
				eq('id', cmd.id)
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
