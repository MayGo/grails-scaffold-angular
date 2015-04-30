[
	/(.*beans\s*\=\s*\{)/: {destFile->

		String linesToAdd = ""

		String line1 = "customMarshallerRegistrar(defpackage.CustomMarshallerRegistrar)"
		if(!destFile.text.contains(line1)) {
			linesToAdd += "\t\t" + line1 + "\n"
		}
		
		String line2 = """
	for (domainClass in application.domainClasses) {
		"json\${domainClass.shortName}CollectionRenderer"(defpackage.CustomJsonCollectionRenderer, domainClass.clazz)
	}
		"""

		if(grailsApplication.metadata.getGrailsVersion() > "2.4.3"){
			line2 = "/* CollectionRenderer not working in grails version > 2.4.3\n" + line2 + "*/"
		}

		if(!destFile.text.contains('defpackage.CustomJsonCollectionRenderer')) {
			linesToAdd += "\t\t" + line2 + "\n"
		}
		
		String line3 = "nonAuthFilter(defpackage.NonAuthenticationFilter)"
		if(!destFile.text.contains(line3) ) {
			linesToAdd += "\t\t" + line3+ "\n"
		}
		String line4 = """
		if(grails.util.Environment.current == grails.util.Environment.TEST && !grails.util.Holders.config.functionalTest.userName) {
			userDetailsService(org.springframework.security.provisioning.InMemoryUserDetailsManager, [])
		}
"""
		if(!destFile.text.contains("userDetailsService")) {
			linesToAdd += "\t\t" + line4+ "\n"
		}

		return linesToAdd
	}
]