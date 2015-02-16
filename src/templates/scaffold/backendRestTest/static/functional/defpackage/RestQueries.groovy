package defpackage

import grails.plugins.rest.client.RestBuilder
import grails.util.Holders
import org.springframework.util.LinkedMultiValueMap
import grails.plugins.rest.client.RestResponse

trait RestQueries {

	final RestBuilder restBuilder = new RestBuilder()

	static final String APP_URL = Holders.config.grails.serverURL
	static final String CAS_URL = Holders.config.security.casURL

	static final String USERNAME = Holders.config.functionalTest.userName
	static final String PASSWORD = Holders.config.functionalTest.password

	String loginToCas(String serviceUrl, String username, String password) {

		def form = new LinkedMultiValueMap<String, String>()
		form.add('service', serviceUrl)
		form.add('username', username)
		form.add('password', password)


		def response = restBuilder.post(CAS_URL + '/v1/tickets/') {
			contentType('application/x-www-form-urlencoded')
			body(form)
		}

		String ticketGrantingTicketResource = response.responseEntity.headers.Location[0]
		def serviceBody = new LinkedMultiValueMap<String, String>()
		serviceBody.add('service', APP_URL)

		response = restBuilder.post(ticketGrantingTicketResource) {
			contentType('application/x-www-form-urlencoded')
			body(serviceBody)
		}
		String ticket = response.responseEntity.body

		return ticket
	}
	
	RestResponse loginToApp(String serviceUrl, String username, String password){
		String ticketValue = loginToCas(serviceUrl, username, password)
		LinkedMultiValueMap<String, String> form = new LinkedMultiValueMap<String, String>()
		form.add("ticket", ticketValue)
		return restBuilder.post("${APP_URL}/login") {
			json {
				ticket = ticketValue
			}
		}
	}
	
	String loginToCasWithCorrectCredentials(String serviceUrlToBeSentToCas) {
		return loginToCas(serviceUrlToBeSentToCas, "${USERNAME}", "${PASSWORD}")
	}

	RestResponse sendWrongCredentials() {
	println "asdfasdsadasdsadas"
		return loginToApp(this.APP_URL, 'foo', 'bar')
	}
	
	RestResponse sendCorrectCredentials(String serviceUrlToBeSentToCas) {
		return loginToApp(serviceUrlToBeSentToCas, "${USERNAME}", "${PASSWORD}")
	}

	RestResponse queryListWithParams(String paramsStr){
		return restBuilder.get("${REST_URL}.json?$paramsStr") {
			header 'Authorization', 'Bearer '+authResponse.json.access_token
			accept 'application/json'
		}
	}
	
	RestResponse queryListWithUrlVariables(String paramsStr, Map urlVariables){
		//Using urlvariables because in url cannot be filter={id:1}
		return restBuilder.get("${REST_URL}.json?$paramsStr", urlVariables) {
			header 'Authorization', 'Bearer '+authResponse.json.access_token
			accept 'application/json'
		}
	}


	RestResponse readDomainItemWithParams(String itemId, String paramsStr){
		return response = restBuilder.get("${REST_URL}/${itemId}?$paramsStr") {
			header 'Authorization', 'Bearer '+authResponse.json.access_token
			accept 'application/json'
		}
	}
	RestResponse deleteDomainItem(String itemId){
		return response = restBuilder.delete("${REST_URL}/${itemId}") {
			header 'Authorization', 'Bearer '+authResponse.json.access_token
			accept 'application/json'
		}
	}


	RestResponse sendCreateWithData(Closure data){
		return restBuilder.post("${REST_URL}") {
			header 'Authorization', 'Bearer '+authResponse.json.access_token
			accept 'application/json'
			"json" data
		}
	}
	RestResponse sendUpdateWithData(String itemId,Closure data){
		return restBuilder.put("${REST_URL}/${itemId}") {
			header 'Authorization', 'Bearer '+authResponse.json.access_token
			accept 'application/json'
			"json" data
		}
	}

}