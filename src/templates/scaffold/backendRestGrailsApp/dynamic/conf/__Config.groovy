[
	/(.*\s*$)/: {destFile->
		String linesToAdd = ""
		
		String line1 = 'grails.resources.resourceLocatorEnabled = true'
		if(!destFile.text.contains('grails.resources.resourceLocatorEnabled')) {
			linesToAdd += line1
		}
		
		String line2 = """
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
			/*-----------------------------*/
			
			grails.plugin.springsecurity.active = true
			environments {
			    development {
			        grails.plugin.springsecurity.active = false
			    }
			}
			
			/*--------- Added by the Spring Security Core plugin------*/
			
			grails.plugin.springsecurity.filterChain.chainMap = [
			    '/ng/**': 'nonAuthFilter',
			    '/static/**': 'nonAuthFilter',
			    '/css/**': 'nonAuthFilter',
			    '/js/**': 'nonAuthFilter',
			    '/index.gsp': 'nonAuthFilter',
			    '/index': 'nonAuthFilter',
			    '/': 'nonAuthFilter',
		        '/userInfo/**': 'nonAuthFilter',
			    '/restApiDoc/**': 'nonAuthFilter', //disable in production
			    '/**/**': 'JOINED_FILTERS'
			]
			
			grails.plugin.springsecurity.securityConfigType = 'InterceptUrlMap'
			grails.plugin.springsecurity.interceptUrlMap = [
			      '/**':                  ['isFullyAuthenticated()']
			]
			
			
			/*----------- Added by the Spring Security Rest plugin------------------*/


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
			
			
			/*-----------------------------*/

		"""
		if(!destFile.text.contains('grails.plugin.springsecurity.filterChain.chainMap')) {
			linesToAdd += line3
		}
		
		
		
		
		return linesToAdd
	}
	
]