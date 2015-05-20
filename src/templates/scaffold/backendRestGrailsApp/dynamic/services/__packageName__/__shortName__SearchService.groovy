<%= packageName ? "package ${packageName}" : '' %>
<%
allProps = scaffoldingHelper.getProps(domainClass)
props = allProps.findAll{p->!p.oneToMany && !p.manyToMany}


private renderSearchRow(p, parentProperty = null){
	String sqlName = p.name
	if(parentProperty?.name){
		sqlName = parentProperty?.name + '.' +p.name
	}

	String propName = "${p.name}"
	if(parentProperty){
		propName = "${parentProperty.name}${p.name.capitalize()}"
	}

	if (p.cp.display != false) {
		if (p.cp && p.cp.inList)
			println "//inList - ${propName}"
		else if (p.type && Number.isAssignableFrom(p.type) ||
				(p.type?.isPrimitive() && p.type != boolean) ||
				p.type == Boolean ||
				p.type == boolean) {
			println """\
			if (cmd.${propName} != null) {
				eq('${sqlName}', cmd.${propName})
			}\
"""
		} else if (p.type == String){
			println """\
			if (cmd.${propName}) {
				ilike('${sqlName}', cmd.${propName} + '%')
			}\
"""
			return
		}else if (p.type == Date || p.type == java.sql.Date || p.type == java.sql.Time || p.type == Calendar) {
			println """\
			if (cmd.${propName} != null) {
				Date d = cmd.${propName}
				between('${sqlName}', d, d + 1)
			}\
"""

		}else if (p.type == URL)
			println "//url - ${propName}"
		else if (p.type && p.isEnum())
			println "//enum - ${propName}"
		else if (p.type == TimeZone)
			println "//TimeZone - ${propName}"
		else if (p.type == Locale)
			println "//Locale - ${propName}"
		else if (p.type == Currency)
			println "//Currency - ${propName}"
		else if (p.type==([] as byte[]).class) //TODO: Bug in groovy means i have to do this :(
			println "//byte - ${propName}"
		else if (p.manyToOne || p.oneToOne) {
			println """\
			if (cmd.${propName}s) {
				'in'('${sqlName}.id', cmd.${propName}s.collect { (long) it })
			}
			if (cmd.${propName} != null) {
				eq('${sqlName}.id', cmd.${propName})
			}\
"""
			return
		} else if ((p.oneToMany && !p.bidirectional) || p.manyToMany) {
			println "//manyToMany - ${propName}"
		} else if (p.oneToMany)
			println "//oneToMany - ${propName}"
		else if (p.joinProperty){
			println "//joinProperty - ${propName}"
		} else if(p.type == Map){
			println """\
			if (cmd.${propName} != null) {
				eq('${sqlName}', cmd.${propName})
			}\
"""
		} else if ( "${p.type.name}" == "com.google.gson.internal.LinkedTreeMap"){
			println """\
			if (cmd.${propName} != null) {
 				pgJsonHasFieldValue '${sqlName}', 'item', cmd.${propName}
			}\
"""
		} else if(p.cp.widget == 'autocomplete' || parentProperty?.cp?.widget == 'autocomplete'){
			if ( "${p.type.name}" == "com.google.gson.internal.LinkedTreeMap"){
				println """\
			if (cmd.${propName}s != null) {
				cmd.${propName}s.each {
 					pgJsonHasFieldValue '${sqlName}', 'item', cmd.${propName}
				}
			}\
"""
			}else {
				println """\
			if (cmd.${propName}s != null) {
				'in'('${sqlName}', cmd.${propName}s)
			}\
"""
			}
		} else {
			println "//No type for  - ${propName}"
		}


	}
}

private void printSearchCriteria(){
	Map useDisplaynames = scaffoldingHelper.getDomainClassDisplayNames(domainClass)
	if(!useDisplaynames) useDisplaynames = ["id":null]
	println """\
			if (searchString) {
				or {
					eq('id', -1L)"""

	useDisplaynames.each {key, value->
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

	// TODO: Refactor and cleanup code so Codenarc check passes
	@SuppressWarnings(['AbcMetric', 'CyclomaticComplexity', 'MethodSize'])
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
					embeddedProps.each {ep->
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
