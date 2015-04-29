<%=packageName ? "package ${packageName}\n" : ''%>

import grails.validation.Validateable
import groovy.transform.ToString

<%

import grails.plugin.scaffold.angular.DomainHelper
import org.apache.commons.lang.ClassUtils

allProps = scaffoldingHelper.getProps(domainClass)
props = allProps.findAll{p->!p.oneToMany && !p.manyToMany}
importNames = allProps.findAll{p->p.referencedDomainClass}.collect{p->p.referencedDomainClass.fullName}.unique()
importNames += allProps.findAll{p->p.isEmbedded()}.collect{p-> p.component.fullName}.unique()
importNames += allProps.findAll{p->p.isEnum()}.collect{p->ClassUtils.getPackageName(p.type) + '.' + ClassUtils.getShortClassName(p.type)}.unique()

importNames.each{
	println "import ${it}"
}
/**
 *
 * @param p
 * @param parentProperty
 * @param embeddedPropName - when there is embedded-embedded autocomplete
 * @return
 */
private printPropertyDeclaration(def p, def parentProperty = null, embeddedPropName = '') {
	String propName = "${p.name}"
	if (parentProperty) {
		propName = "${parentProperty.name}${p.name.capitalize()}"
	}

	if (p.manyToOne || p.oneToOne) {
		println "\tLong ${propName}"
		println "\tList<Long> ${propName}s"
	}else if(p.embedded ){
		def embeddedProps = scaffoldingHelper.getProps(p.component).grep{it.cp?.display != false &&it.cp?.editable != false && it.name!= 'id'}
		embeddedProps.each{ep->
			printPropertyDeclaration(ep, p, embeddedPropName?:parentProperty?.name)
		}

	} else if(p.type.isPrimitive()){
		def wrapperClass = ClassUtils.primitiveToWrapper(p.type)

		if(p.cp.widget == 'autocomplete' || parentProperty?.cp?.widget == 'autocomplete'){
			println "\tList<${wrapperClass.simpleName}> ${propName}s"
		}
		println "\t${wrapperClass.simpleName} ${propName}"

	} else if(!"${p.type.name}".startsWith('java')){
		String typeName = p.type.name
		if("${p.type.name}" == "com.google.gson.internal.LinkedTreeMap" ){
			typeName = "String"
		}
		if(p.cp.widget == 'autocomplete' || parentProperty?.cp?.widget == 'autocomplete'){
			String propNameFull = DomainHelper.getPropertyFullName(p, parentProperty, '', true)
			if(embeddedPropName){
				propNameFull = embeddedPropName + propNameFull.capitalize()
			}
			println "\tList<${typeName}> ${propNameFull}s"
			println "\t${typeName} ${propNameFull}"
		}else{
			println "\t${typeName} ${propName}"
		}

	} else {
		String typeName = p.type.simpleName

		if(p.cp.widget == 'autocomplete' || parentProperty?.cp?.widget == 'autocomplete'){
			println "\tList<${typeName}> ${propName}s"
		}
		println "\t${typeName} ${propName}"
	}

}


private printPropertyConstraints(def p, def parentProperty = null, embeddedPropName = ''){
	String propName = "${p.name}"
	if(parentProperty){
		propName = "${parentProperty.name}${p.name.capitalize()}"
	}

	if (p.manyToOne || p.oneToOne) {
		println "\t\t${propName} nullable: true"
		println "\t\t${propName}s nullable: true"
	} else if(p.embedded){
		def embeddedProps = scaffoldingHelper.getProps(p.component).grep{it.cp?.display != false &&it.cp?.editable != false && it.name!= 'id'}
		embeddedProps.each{ep->
			printPropertyConstraints(ep, p, embeddedPropName?:parentProperty?.name)
		}
	} else {

		if(p.cp.widget == 'autocomplete' || parentProperty?.cp?.widget == 'autocomplete'){
			String propNameFull = DomainHelper.getPropertyFullName(p, parentProperty, '', true)
			if(embeddedPropName){
				propNameFull = embeddedPropName + propNameFull.capitalize()
			}
			println "\t\t${propNameFull}s nullable: true"
			println "\t\t${propNameFull} nullable: true"
		}else{
			println "\t\t${propName} nullable: true"
		}

	}
}

%>
@Validateable
@ToString
class ${className}SearchCommand {

	Long id
	String searchString
<%
	props.each { p ->
		printPropertyDeclaration(p)
	}
%>
	static constraints = {
<%
		println "\t\tid nullable: true"
		println "\t\tsearchString nullable: true"

		props.each { p ->
			printPropertyConstraints(p)
		}
%>
	}
}
