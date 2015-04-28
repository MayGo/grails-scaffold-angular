<%=packageName ? "package ${packageName}\n" : ''%>

import grails.util.GrailsNameUtils
import grails.validation.Validateable
import groovy.transform.ToString

<%
import org.apache.commons.lang.ClassUtils

allProps = scaffoldingHelper.getProps(domainClass)
props = allProps.findAll{p->!p.oneToMany && !p.manyToMany}
importNames = allProps.findAll{p->p.referencedDomainClass}.collect{p->p.referencedDomainClass.fullName}.unique()
importNames += allProps.findAll{p->p.isEmbedded()}.collect{p-> GrailsNameUtils.getClassName()p.component.fullName}.unique()
importNames += allProps.findAll{p->p.isEnum()}.collect{p->ClassUtils.getPackageName(p.type) + '.' + ClassUtils.getShortClassName(p.type)}.unique()

importNames.each{
	println "import ${it}"
}
%>
@Validateable
@ToString
class ${className}SearchCommand {

	Long id
	String searchString
<%
	props.each { p ->
		if (p.manyToOne || p.oneToOne) {
			println "\tLong ${p.name}"
			println "\tList<Long> ${p.name}s"
		} else if(p.type.isPrimitive()){
			def wrapperClass = ClassUtils.primitiveToWrapper(p.type)
			println "\t${wrapperClass.simpleName} ${p.name}"
		} else {
			println "\t${p.type.simpleName} ${p.name}"
		}
	}
%>
	static constraints = {
<%
		println "\t\tid nullable: true"
		println "\t\tsearchString nullable: true"

		props.each { p ->
			if (p.manyToOne || p.oneToOne) {
				println "\t\t${p.name} nullable: true"
				println "\t\t${p.name}s nullable: true"
			} else {
				println "\t\t${p.name} nullable: true"
			}
		}
%>
	}
}
