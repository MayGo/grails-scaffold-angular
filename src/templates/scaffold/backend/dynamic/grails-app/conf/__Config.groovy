[
	/(.*\s*$)/: {destFile->
		String linesToAdd = ""
		
		String line1 = 'grails.resources.resourceLocatorEnabled = true'
		if(!destFile.text.contains('grails.resources.resourceLocatorEnabled')) {
			linesToAdd += line1
		}
		return linesToAdd
	}
	
]