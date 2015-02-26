<%= packageName ? "package ${packageName}" : '' %>

import grails.compiler.GrailsCompileStatic
import org.grails.databinding.SimpleMapDataBindingSource
import grails.transaction.Transactional
import defpackage.exceptions.ResourceNotFound

//@GrailsCompileStatic
@Transactional
class ${className}ModifyService {
	def grailsWebDataBinder

	${className} create${className}(Map data){
		${className} ${domainClass.propertyName} = ${className}.newInstance()
		return createOrUpdate(${domainClass.propertyName}, data)
	}

	${className} update${className}(Map data){
		if(!data.id || data.id < 0){
			throw new IllegalArgumentException("There is no valid 'id'")
		}
		${className} ${domainClass.propertyName} = queryFor${className}(data.id)

		if(!${domainClass.propertyName}){
			throw new ResourceNotFound("No ${className} found with Id :[\${data.id}]")
		}

		return createOrUpdate(${domainClass.propertyName}, data)
	}

	${className} createOrUpdate(${className} ${domainClass.propertyName}, Map data){
		if(!data){
			throw new IllegalArgumentException("Data map is empty.")
		}

		grailsWebDataBinder.bind ${domainClass.propertyName}, data as SimpleMapDataBindingSource

		${domainClass.propertyName}.save flush: true, failOnError: true

		return ${domainClass.propertyName}
	}

	${className} queryFor${className}(long id){
		return ${className}.get(id)
	}
}
