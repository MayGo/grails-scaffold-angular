package defpackage

import groovy.json.JsonBuilder
import grails.util.Holders
import groovy.util.logging.Log4j

@Log4j
class InternalFrontendHelper {

	static void writeConfig(String dir) {
		String filePath = dir + 'config.json'
		Map config = [:]
		String appName = Holders.grailsApplication.metadata['app.name']
		config.restUrl = (Holders.config.grails.serverURL) ?: "http://localhost:8080/\${appName}"
		if(Holders.config.security.casURL){
			config.loginUrl = Holders.config.security.casURL
		}else{
			config.loginUrl = (Holders.config.grails.plugin.springsecurity.rest.login.endpointUrl)?:"/api/login"
		}

		String endpointUrl = (Holders.config.grails.plugin.springsecurity.rest.logout.endpointUrl)?:"/api/logout"
		config.logoutUrl = "\${config.restUrl}\$endpointUrl"

		config.securityEnabled = (Holders.config.grails.plugin.springsecurity.active) ?: false
		log.info "Writing json to file: \$config"
		File file = new File(filePath)
		file.write(new JsonBuilder(config).toPrettyString())
	}
}
