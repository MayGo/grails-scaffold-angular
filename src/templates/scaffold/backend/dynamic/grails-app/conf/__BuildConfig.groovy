[
	/(.*plugins\s*\{)/: {destFile->
		String linesToAdd = ""
		
		String pluginLine1 = 'runtime ":cors:1.1.6"'
		if(!destFile.text.contains('runtime ":cors:')) {
			linesToAdd += "\t\t" + pluginLine1 + "\n"
		}
		String pluginLine2 = 'compile ":dirserve:0.4"'
		if(!destFile.text.contains('compile ":dirserve:')) {
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
		if(!destFile.text.contains("grails.war.copyToWebApp")) {
			linesToAdd += line1
		}
		return linesToAdd
	}
]