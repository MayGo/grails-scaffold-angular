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
		String redirectLine = "'/'(redirect:'/extapp/client/index.html')"
		if(!destFile.text.contains(redirectLine)) {
			linesToAdd += "\t\t" + redirectLine + "\n"
		}
		return linesToAdd
	}
]