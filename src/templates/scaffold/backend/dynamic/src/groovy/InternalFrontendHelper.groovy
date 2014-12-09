
import groovy.json.JsonBuilder
import grails.util.Holders
import groovy.util.logging.Log4j

@Log4j
class InternalFrontendHelper{
	
	static Map domainPropertiesCache = [:]
	
	static void writeAngularConfig(){
		String filePath = "angular/client/config.json"
		Map config = [:]
		config.restUrl = Holders.config.grails.serverURL
		config.securityEnabled = (Holders.config.grails.plugin.springsecurity.active)?:false
		log.info "Writing json to file: config"
		File file = new File(filePath)
		file.write(new JsonBuilder(config).toPrettyString())
	}
}