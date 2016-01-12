package defpackage

import grails.util.Holders
import groovy.json.JsonBuilder
import groovy.util.logging.Log4j
import grails.converters.JSON

@Log4j
class InternalFrontendHelper {

	static void writeConfig(String dir) {
		String filePath = dir + 'config.json'
		def config = [:]
		File file = new File(filePath)
		if(file.exists()){
			config = JSON.parse(file.text)
		}
		String appName = Holders.grailsApplication.metadata['app.name']
		config.restUrl = (Holders.config.grails.serverURL) ?: "http://localhost:8080/${appName}"

		String restLoginUrl = (Holders.config.grails.plugin.springsecurity.rest.login.endpointUrl) ?: '/api/login'
		config.loginUrl = (Holders.config.security.casURL) ?: "${config.restUrl}${restLoginUrl}"

		String endpointUrl = (Holders.config.grails.plugin.springsecurity.rest.logout.endpointUrl) ?: '/api/logout'
		config.logoutUrl = "${config.restUrl}$endpointUrl"

		config.securityEnabled = (Holders.config.grails.plugin.springsecurity.active)
		log.info "Writing json to file: $config"

		file.write(new JsonBuilder(config).toPrettyString())
	}
}
