[
	/(.*beans\s*\=\s*\{)/: {destFile->
		String linesToAdd = """
	 for (domainClass in application.domainClasses) {
	     "json\${domainClass.shortName}CollectionRenderer(grails.rest.render.json.JsonCollectionRenderer.JsonCollectionRenderer, domainClass.clazz)"
	 }
		"""
		
		if(destFile.text.contains(linesToAdd)) {
			return ""
		}
		return linesToAdd
	}
]