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
		
		
		
		
		return linesToAdd
	}
	
]