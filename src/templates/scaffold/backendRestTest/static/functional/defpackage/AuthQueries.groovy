package defpackage

import grails.plugins.rest.client.RestBuilder
import grails.plugins.rest.client.RestResponse
import grails.util.Holders

trait AuthQueries {

	final RestBuilder restBuilder = new RestBuilder()

	static final String APP_URL = Holders.config.grails.serverURL

	static final String USERNAME = (Holders.config.functionalTest.userName) ?: 'john'
	static final String PASSWORD = (Holders.config.functionalTest.password) ?: 'john'

	RestResponse loginToApp(String serviceUrl, String passwordStr, String usernameStr) {
		restBuilder.post("${serviceUrl}/api/login") {
			json {
				username = usernameStr
				password = passwordStr
			}
		}
	}

	RestResponse sendWrongCredentials() {
		return loginToApp(this.APP_URL, 'foo', 'bar')
	}

	RestResponse sendCorrectCredentials(String serviceUrl) {
		return loginToApp(serviceUrl, "${USERNAME}", "${PASSWORD}")
	}
}