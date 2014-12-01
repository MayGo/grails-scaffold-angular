[
	/(.*beans\s*\=\s*\{)/: {destFile->

		String linesToAdd = ""

		String line1 = "customMarshallerRegistrar(CustomMarshallerRegistrar)"
		if(!destFile.text.contains(line1)) {
			linesToAdd += "\t\t" + line1 + "\n"
		}
		
		String line2 = """
	 for (domainClass in application.domainClasses) {
	     "json\${domainClass.shortName}CollectionRenderer"(CustomJsonCollectionRenderer, domainClass.clazz)
	 }
		"""
		if(!destFile.text.contains(line2)) {
			linesToAdd += "\t\t" + line2 + "\n"
		}
		
		return linesToAdd
	}
]