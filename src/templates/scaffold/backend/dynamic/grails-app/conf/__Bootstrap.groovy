[
	/(.*init\s*\=\s*\{\sservletContext\s->)/: {destFile->//select entire line
		String linesToAdd = ""
		
		String line = "CustomMarshallerRegistrar.registerMarshallers()"
		if(!destFile.text.contains(line)) {
			linesToAdd += "\t\t" + line + "\n"
		}
		
		String line2 = "InternalFrontendHelper.writeAngularConfig()"
		if(!destFile.text.contains(line2)) {
			linesToAdd += "\t\t" + line2 + "\n"
		}
		return linesToAdd
	}
	
]