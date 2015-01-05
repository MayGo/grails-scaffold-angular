package defpackage
import groovy.json.JsonBuilder
import grails.util.Holders
import groovy.util.logging.Log4j

@Log4j
class InternalFrontendHelper{
		
	static void writeConfig(String dir){
		String filePath = dir + "config.json"
		Map config = [:]
		String appName = Holders.grailsApplication.metadata['app.name']
		config.restUrl = (Holders.config.grails.serverURL)?:"http://localhost:8080/\${appName}"
		
		
		config.securityEnabled = (Holders.config.grails.plugin.springsecurity.active)?:false
		log.info "Writing json to file: \$config"
		File file = new File(filePath)
		file.write(new JsonBuilder(config).toPrettyString())
	}
}