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
		return linesToAdd
	}
	
]