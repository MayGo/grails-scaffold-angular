[
	/(.*mappings\s*\=\s*\{)/: {destFile->
		String linesToAdd = ""
		grailsApplication.domainClasses.each{domainClass->
				String shortName = domainClass.getShortName();
				String shortNameLower = shortName.toLowerCase();
				String line = "'/${shortNameLower}s/v1'(resources: '$shortName', namespace: 'v1')"

				if(!destFile.text.contains(line)) {
					linesToAdd += "\t\t" + line + "\n"
				}
		}
		boolean serveFrontendFromGrails = (grailsApplication.config.grails.plugin.scaffold.angular.serveFrontendFromGrails)
			
		String redirectLine = "'/'(redirect:'/ng/index.html')"
		if(serveFrontendFromGrails && !destFile.text.contains(redirectLine)) {
			linesToAdd += "\t\t" + redirectLine + "\n"
		}
		
		String spaLine = """
		"/ng/\$asset**" {
			controller = 'dirserve'
			action = 'index'
			dirserveBase = 'angular/client'
		}
		"""

		if(serveFrontendFromGrails && !destFile.text.contains("/ng/\$asset**")) {
			linesToAdd += "\t\t" + spaLine + "\n"
		}
		
		return linesToAdd
	},
	/(.*mappings.*)/: {destFile->

		def fileText = destFile.text
		fileText = fileText.replace("\"/\"(view:\"/index\")", "")
		fileText = fileText.replace("\"500\"(view:'/error')", "")
		destFile.write(fileText);
		return ""
	}
	
]