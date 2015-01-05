package defpackage

import grails.plugins.rest.client.RestBuilder
import spock.lang.Shared
import spock.lang.Specification
import grails.util.Holders
import static org.springframework.http.HttpStatus.*

abstract class AbstractRestSpec extends Specification {


    @Shared
    ConfigObject config = new ConfigSlurper().parse(new File('grails-app/conf/Config.groovy').toURL())

    @Shared
    RestBuilder restBuilder = new RestBuilder()

    @Shared
	
    String baseUrl = "http://localhost:3333/\${Holders.grailsApplication.metadata['app.name']}"

    def sendWrongCredentials() {
            restBuilder.post("\${baseUrl}/api/login") {
                json {
                    username = 'foo'
                    password = 'bar'
                }
            }
    }

    def sendCorrectCredentials() {
            restBuilder.post("\${baseUrl}/api/login") {
                json {
					username = (Holders.config.functionalTest.userName)?:"john"
					password = (Holders.config.functionalTest.password)?:"john"
				}
            }
    }
	


}
