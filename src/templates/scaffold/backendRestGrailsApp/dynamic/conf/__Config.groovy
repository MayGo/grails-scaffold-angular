[
		/(.*\s*$)/: {destFile->
			String linesToAdd = ""
			String appName = grailsApplication.metadata['app.name']
			String line0 = """
environments {
	development {
		grails.serverURL = "http://localhost:8080/${appName}"
	}
	test {
		grails.serverURL = "http://localhost:3333/${appName}"
	}
	production {
		grails.serverURL = "http://www.changeme.com"
	}
}
"""
			if(!destFile.text.contains('http://localhost:3333')) {
				linesToAdd += line0
			}



			String line1 = 'grails.resources.resourceLocatorEnabled = true'
			if(!destFile.text.contains('grails.resources.resourceLocatorEnabled')) {
				linesToAdd += line1
			}

			String line2 = """
/**
 * Rest Api doc config
 */

//generate api: grails rest-api-doc
//view api: http://.../restApiDoc/?doc_url=http://.../restApiDoc/api#
grails.plugins.restapidoc.outputFileGeneration = "web-app/WEB-INF/restapidoc.json"
grails.plugins.restapidoc.outputFileReading = "WEB-INF/restapidoc.json"

environments {
    development {
		grails.plugins.restapidoc.outputFileReading = "web-app/WEB-INF/restapidoc.json"
	}
}
		"""
			if(!destFile.text.contains('grails.plugins.restapidoc.outputFileGeneration')) {
				linesToAdd += line2
			}

			String line3 = """
/**
 * Spring Security Config
 */
			
grails.plugin.springsecurity.active = true
environments {
    development {
        grails.plugin.springsecurity.active = false
    }
}
	"""
			boolean serveFrontendFromGrails = (grailsApplication.config.grails.plugin.scaffold.angular.serveFrontendFromGrails)
			if (serveFrontendFromGrails) {
				line3 += """
grails.plugin.springsecurity.filterChain.chainMap = [
    '/ng/**': 'nonAuthFilter',
    '/static/**': 'nonAuthFilter',
    '/css/**': 'nonAuthFilter',
    '/js/**': 'nonAuthFilter',
    '/index.gsp': 'nonAuthFilter',
    '/index': 'nonAuthFilter',
    '/': 'nonAuthFilter',
    '/login/**': 'nonAuthFilter',
    '/restApiDoc/**': 'nonAuthFilter', //disable in production
    '/**/**': 'JOINED_FILTERS'
]
"""
			} else {
				line3 += """
grails.plugin.springsecurity.filterChain.chainMap = [
    '/': 'nonAuthFilter',
    '/login/**': 'nonAuthFilter',
    '/restApiDoc/**': 'nonAuthFilter', //disable in production
    '/**/**': 'JOINED_FILTERS'
]
"""
			}

			line3 += """
grails.plugin.springsecurity.securityConfigType = 'InterceptUrlMap'
grails.plugin.springsecurity.interceptUrlMap = [
      '/**':                  ['isFullyAuthenticated()']
]
			
			
/**
 * Spring Security Rest Config
 */


grails.plugin.springsecurity.rest.token.rendering.usernamePropertyName = 'login'
grails.plugin.springsecurity.rest.token.rendering.tokenPropertyName = 'access_token'
grails.plugin.springsecurity.rest.token.rendering.authoritiesPropertyName = 'permissions'

grails.plugin.springsecurity.rest.token.storage.useGrailsCache = true

grails.cache.config = {
    cache {
       name 'userTokens'
    }
}
grails.plugin.springsecurity.rest.token.storage.grailsCacheName = "userTokens"

grails.plugin.springsecurity.rest.login.active=true
grails.plugin.springsecurity.rest.login.useJsonCredentials = true
grails.plugin.springsecurity.rest.login.usernamePropertyName = "username"
grails.plugin.springsecurity.rest.login.passwordPropertyName = "password"

grails.plugin.springsecurity.rest.login.endpointUrl = "/api/login"
grails.plugin.springsecurity.rest.login.failureStatusCode = 401

grails.plugin.springsecurity.rest.token.validation.useBearerToken = true
grails.plugin.springsecurity.rest.token.validation.headerName = 'Authorization'
grails.plugin.springsecurity.rest.token.validation.active = true
grails.plugin.springsecurity.rest.token.validation.endpointUrl = "/api/validate"

/*----------------------------------------------------------------------*/
		"""
			if(!destFile.text.contains('grails.plugin.springsecurity.filterChain.chainMap')) {
				linesToAdd += line3
			}

			String line4 = '''
/**
 * Scaffold Angular plugin Config
 */

grails{
	plugin{
		scaffold{
			core{
				overwrite = true // false = Ask before replacing file
				ignoreStatic = true // Don't generate static files again
				ignoreFileNames = ['TestDataGeneratorService.groovy', 'TestDataConfig.groovy', 'config.json', '.gitignore']
				// don't generate files or menu for domains
				ignoreDomainNames = []
			}
		}
	}
}
'''
			if(!destFile.text.contains('ignoreFileNames')) {
				linesToAdd += line4
			}


			String line5 = 'grails.plugin.scaffold.core.'
			Map displayNames = [:]
			grailsApplication.domainClasses.each { domainClass ->
				allProps = scaffoldingHelper.getProps(domainClass)
				props = allProps.findAll{p->!p.isAssociation()}

				props = props.sort { a, b ->
					if(a.type == b.type) return 0
					if(a.type == String) return -1
					return 1
				}

				displayNames["'${domainClass.shortName}'"] = ["'id'"] + props.take(3).collect{"'${it.name}'"}
			}
			line5 += "displayNames = $displayNames"

			if(!destFile.text.contains('displayNames')) {
				linesToAdd += line5
			}

			return linesToAdd
		}

]