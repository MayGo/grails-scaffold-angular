<%=packageName ? "package ${packageName}\n" : ''%>
import grails.transaction.Transactional
import org.restapidoc.annotation.RestApiMethod
import org.restapidoc.annotation.RestApiParam
import org.restapidoc.annotation.RestApiParams
import org.restapidoc.annotation.RestApi
import org.restapidoc.pojo.RestApiParamType
import defpackage.CustomRestfulController

@Transactional(readOnly = true)
@RestApi(name = '${className} services', description = 'Methods for managing ${className}s')
class ${className}Controller extends CustomRestfulController<${className}> {

	static responseFormats = ['json']

	${className}Service ${domainClass.propertyName}Service

	${className}Controller() {
		super(${className}, false /* read-only */)
	}

	@RestApiMethod(description = 'List all ${className}s', listing = true)
	@RestApiParams(params = [
		@RestApiParam(name = 'max', type='long', paramType = RestApiParamType.QUERY,
				description = 'Max number of ${className} to retrieve'),
		@RestApiParam(name = 'offset', type='long', paramType = RestApiParamType.QUERY,
				description = 'Retrieved ${className} list offset'),
		@RestApiParam(name = 'order', type='string', paramType = RestApiParamType.QUERY,
				description = 'Retrieved ${className} list order', allowedvalues=['asc', 'desc']),
		@RestApiParam(name = 'sort', type='string', paramType = RestApiParamType.QUERY,
				description = 'Retrieved ${className} list sort')
	])
	def index(final Integer max) {
		params.max = Math.min(max ?: 10, 100)
		// Parses params.query for dynamic search and uses params.offset/params.max for paging.
		// Returns results for paging grid.
		// This is here so running demo works right away. Should be replaced with own service,
		// eg: ${domainClass.propertyName}Service.list(params)
		List results = ${domainClass.propertyName}Service.parseParamsAndRetrieveListAndCount(params)
		header 'Access-Control-Expose-Headers', 'total'
		header 'total', results.totalCount

		respond results, [includes: includes, excludes: excludes]
	}

	@RestApiMethod(description='Get a ${className}')
	@RestApiParams(params=[
		@RestApiParam(name='id', type='long', paramType = RestApiParamType.PATH, description = 'The ${className} id')
	])
	def show() {
		// We pass which fields to be rendered with the includes attributes,
		// we exclude the class property for all responses.
		respond queryForResource(params.id), [includes: includes, excludes: excludes]
	}

	private getIncludes() {
		params.includes?.tokenize(',')
	}

	private getExcludes() {
		params.excludes?.tokenize(',')
	}

	@Override
	protected ${className} queryForResource(Serializable id) {
		if (id.isNumber()) {
			resource.get(id)
		} else {
			notFound()
		}
	}
}
