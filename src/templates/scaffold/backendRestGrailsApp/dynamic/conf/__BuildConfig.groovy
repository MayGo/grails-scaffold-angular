[
	/(.*plugins\s*\{)/: {destFile->
		String linesToAdd = ""
		boolean serveFrontendFromGrails = (grailsApplication.config.grails.plugin.scaffold.angular.serveFrontendFromGrails)
		String pluginLine2 = 'compile ":dirserve:0.4"'
		if(serveFrontendFromGrails && !destFile.text.contains('compile ":dirserve:')) {
			linesToAdd += "\t\t" + pluginLine2 + "\n"
		}
		
		String pluginLine3 = 'compile ":rest-api-doc:0.5"'
		if(!destFile.text.contains('compile ":rest-api-doc')) {
			linesToAdd += "\t\t" + pluginLine3 + "\n"
		}
		String pluginLine4 = 'runtime ":resources:1.2.13"//needed for rest-api-doc'
		if(!destFile.text.contains('runtime ":resources')) {
			linesToAdd += "\t\t" + pluginLine4 + "\n"
		}
		

		String pluginLine5 = 'compile ":build-test-data:2.4.0"'
		if(!destFile.text.contains('build-test-data')) {
			linesToAdd += "\t\t" + pluginLine5 + "\n"
		}
		
		String pluginLine6 = 'test ":geb:0.9.2"'
		if(!destFile.text.contains(':geb:')) {
			linesToAdd += "\t\t" + pluginLine6 + "\n"
		}
		
		String pluginLine7 = 'compile ":rest-client-builder:2.1.1"'
		if(!destFile.text.contains('rest-client-builder')) {
			linesToAdd += "\t\t" + pluginLine7 + "\n"
		}
		
		String pluginLine9 = """
			compile ':spring-security-core:2.0-RC4'
			compile ':spring-security-rest:1.5.1', {
				excludes: 'spring-security-core'
			}
		"""
		if(!destFile.text.contains('spring-security-rest')) {
			linesToAdd += "\t\t" + pluginLine9 + "\n"
		}
		
		String pluginLine10 = "compile ':cache:1.1.8'"
		if(!destFile.text.contains(':cache:')) {
			linesToAdd += "\t\t" + pluginLine10 + "\n"
		}
		
		
		return linesToAdd
	},
	/(.*dependencies\s*\{)/: {destFile->
		String linesToAdd = ""
		
		String pluginLine1 = 'test "org.gebish:geb-spock:0.9.2"'
		if(!destFile.text.contains('org.gebish:geb-spock:')) {
			linesToAdd += "\t\t" + pluginLine1 + "\n"
		}
		
		return linesToAdd
	},
	/(.*\s*\}\s*$)/: {destFile->
		String linesToAdd = ""
		
		String line1 = """
		grails.war.copyToWebApp = { args ->
			fileset(dir:"") {
				include(name: "angular/client/**")
			}
			fileset(dir:"web-app") {
		        include(name: "restapidoc.json")
				include(name: "WEB-INF/**")
			}
		}
		"""

		boolean serveFrontendFromGrails = (grailsApplication.config.grails.plugin.scaffold.angular.serveFrontendFromGrails)
		if(serveFrontendFromGrails && !destFile.text.contains("grails.war.copyToWebApp")) {
			linesToAdd += line1
		}
		return linesToAdd
	}
]