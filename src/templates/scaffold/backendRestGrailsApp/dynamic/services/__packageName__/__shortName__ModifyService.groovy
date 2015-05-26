<%= packageName ? "package ${packageName}" : '' %>

import grails.compiler.GrailsCompileStatic
import org.codehaus.groovy.grails.web.binding.GrailsWebDataBinder
import org.grails.databinding.SimpleMapDataBindingSource
import grails.transaction.Transactional
import defpackage.exceptions.ResourceNotFound

@GrailsCompileStatic
@Transactional
class ${className}ModifyService {
	GrailsWebDataBinder grailsWebDataBinder

	${className} create${className}(Map data) {
		${className} ${domainClass.propertyName} = ${className}.newInstance()
		return createOrUpdate(${domainClass.propertyName}, data)
	}

	${className} update${className}(Map data) {
		Long objId = (Long)data.id
		if (!objId || objId < 0) {
			throw new IllegalArgumentException('no.valid.id')
		}

		${className} ${domainClass.propertyName} = ${className}.where { id == objId }.find()

		if (!${domainClass.propertyName}) {
			throw new ResourceNotFound("No ${className} found with Id :[\$objId]")
		}

		return createOrUpdate(${domainClass.propertyName}, data)
	}

	${className} createOrUpdate(${className} ${domainClass.propertyName}, Map data) {
		if (!data) {
			throw new IllegalArgumentException('no.data')
		}

		grailsWebDataBinder.bind ${domainClass.propertyName}, data as SimpleMapDataBindingSource

		${domainClass.propertyName}.save failOnError: true

		return ${domainClass.propertyName}
	}

	void delete${className}(Long ${domainClass.propertyName}Id) {
		if (!${domainClass.propertyName}Id || ${domainClass.propertyName}Id < 0) {
			throw new IllegalArgumentException('no.valid.id')
		}
		${className} ${domainClass.propertyName} = ${className}.where { id == ${domainClass.propertyName}Id }.find()

		if (!${domainClass.propertyName}) {
			throw new ResourceNotFound("No ${className} found with Id:\$${domainClass.propertyName}Id")
		}

		${domainClass.propertyName}.delete()
	}
}

