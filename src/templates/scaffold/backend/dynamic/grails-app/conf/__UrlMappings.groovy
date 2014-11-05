[
	/(.*mappings\s*\=\s*\{)/: {destFile->
		String linesToAdd = ""
		grailsApplication.domainClasses.each{domainClass->
				String shortName = domainClass.getShortName();
				String shortNameLower = shortName.toLowerCase();
				String line = "'/${shortNameLower}s'(resources:'$shortName')"

				if(!destFile.text.contains(line)) {
					linesToAdd += "\t\t" + line + "\n"
				}
		}
		String redirectLine = "'/'(redirect:'/spa/index.html')"
		if(!destFile.text.contains(redirectLine)) {
			linesToAdd += "\t\t" + redirectLine + "\n"
		}
		
		String spaLine = """
		"/spa/\$asset**" {
			controller = 'dirserve'
			action = 'index'
			dirserveBase = 'angular/app'
		}
		"""
		if(!destFile.text.contains(spaLine)) {
			linesToAdd += "\t\t" + spaLine + "\n"
		}
		
		return linesToAdd
	}
	
]