[
	/(.*InternalFrontendHelper.*)/: {destFile->

		// Not replacing anything
		List filePaths = []

		boolean serveFrontendFromGrails = (grailsApplication.config.grails.plugin.scaffold.angular.serveFrontendFromGrails)
		if(!serveFrontendFromGrails) {
			filePaths << 'src/groovy/defpackage/InternalFrontendHelper.groovy'
		}

		filePaths.each{String filePath->
			File fileToRemove = new File(filePath)

			if(fileToRemove.exists()){
				if(fileToRemove.isDirectory()){
					fileToRemove.deleteDir()
				}else{
					fileToRemove.delete()
				}

				println "Remove file/dir: $filePath"
			}else{
				println "Error deleting! File does not exist: $filePath"
			}
		}

		return ""
	}
]