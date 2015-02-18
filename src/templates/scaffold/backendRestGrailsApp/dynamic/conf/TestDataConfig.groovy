testDataConfig {
	sampleData {
<%
domainClasses.each{dClass->
	allProps = scaffoldingHelper.getProps(dClass)
	uniqueProps = []
	boolean hasHibernate = pluginManager?.hasGrailsPlugin('hibernate') || pluginManager?.hasGrailsPlugin('hibernate4')
	if (hasHibernate) {
		allProps.each{p->
			cp = dClass.constrainedProperties[p.name]
			//>println cp.dump()
			//println cp.appliedConstraints.collect { return it.name }
			def uniqueConstraint = cp?.appliedConstraints.find{it.name == 'unique'}
			if (uniqueConstraint) {
				uniqueProps << p
			}
		}

	}
	simpleProps = allProps - uniqueProps

	println """
		'${dClass.fullName}' {
			def i = 1
"""

	uniqueProps.each { p ->
		println """\t\t\t${p.name} = {->"${p.name}\${i++}"}"""
	}

	simpleProps.each { p ->
		if (p.type == Date || p.type == java.sql.Date || p.type == java.sql.Time || p.type == Calendar){
			println "\t\t\t${p.name} = {-> new Date().clearTime()}"
		}else{
			println "\t\t\t//${p.name} = {-> }"
		}

	}
	println "\t\t}"
}
%>
	}
}