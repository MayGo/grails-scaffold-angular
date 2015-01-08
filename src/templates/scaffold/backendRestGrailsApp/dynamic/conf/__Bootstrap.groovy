[
	/(.*init\s*\=\s*\{\sservletContext\s->)/: {destFile->//select entire line
		String linesToAdd = ""
		
		String line = "defpackage.CustomMarshallerRegistrar.registerMarshallers()"
		if(!destFile.text.contains(line)) {
			linesToAdd += "\t\t" + line + "\n"
		}
		
		String line2 = "defpackage.InternalFrontendHelper.writeConfig('angular/client/')"
		if(!destFile.text.contains(line2)) {
			linesToAdd += "\t\t" + line2 + "\n"
		}
	
		
		String line3 = "testUserGeneratorService.generate()"
		if(!destFile.text.contains(line3)) {
			linesToAdd += "\t\t" + line3 + "\n"
		}
		
		String line4 = "testDataGeneratorService.generate()"
		grailsApplication.domainClasses.first().getClazz().withTransaction{
			if(!destFile.text.contains(line4) && grailsApplication.domainClasses.first().getClazz().count()== 0) {
				linesToAdd += "\t\t" + line4 + "\n"
			}
		}
		
		
		return linesToAdd
	},
	/(.*class\s*BootStrap\s*\{)/: {destFile->//select entire line
		String linesToAdd = ""
		
		String line = "def testUserGeneratorService"
		if(!destFile.text.contains(line)) {
			linesToAdd += "\t" + line + "\n"
		}
		
		String line2 = "def testDataGeneratorService"
		grailsApplication.domainClasses.first().getClazz().withTransaction{
			if(!destFile.text.contains(line2) && grailsApplication.domainClasses.first().getClazz().count()== 0) {
				linesToAdd += "\t" + line2 + "\n"
			}
		}
		
		return linesToAdd
	}
]