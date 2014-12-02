[
	/(.*plugins\s*\{)/: {destFile->
		String linesToAdd = ""
		
		String pluginLine1 = 'runtime ":cors:1.1.6"'
		if(!destFile.text.contains(pluginLine1)) {
			linesToAdd += "\t\t" + pluginLine1 + "\n"
		}
		String pluginLine2 = 'compile ":dirserve:0.4"'
		if(!destFile.text.contains(pluginLine2)) {
			linesToAdd += "\t\t" + pluginLine2 + "\n"
		}
		
		String pluginLine3 = 'compile ":rest-api-doc:0.4.1"'
		if(!destFile.text.contains(pluginLine3)) {
			linesToAdd += "\t\t" + pluginLine3 + "\n"
		}

		return linesToAdd
	}
	
]