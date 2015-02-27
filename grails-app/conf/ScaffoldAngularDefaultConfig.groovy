grails{
	plugin{
		scaffold{
			angular {
				serveFrontendFromGrails = true
			}
			core{
				folders = [
				'backendRestGrailsApp':'grails-app/',
				'backendRestSrc':'src/',
				'backendRestTest':'test/',
				'frontendAngular':'angular/'
				]
			}
		}
	}
}
