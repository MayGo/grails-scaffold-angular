package defpackage

import grails.plugins.rest.client.RestBuilder
import grails.plugins.rest.client.RestResponse

class RestQueries extends AuthQueries {

	static String REST_URL
	static String ACCESS_TOKEN


	RestResponse queryListWithParams(String paramsStr) {
		return restBuilder.get("${REST_URL}.json?$paramsStr") {
			header 'Authorization', 'Bearer ' + ACCESS_TOKEN
			accept 'application/json'
		}
	}

	RestResponse queryListWithMap(Map urlVariables) {
		//Using urlvariables because in url cannot be filter={id:1}
		String paramsStr = urlVariables.inject([]) { result, entry ->
			result << "${entry.key}=${entry.value.toString()}"
		}.join('&')

		return restBuilder.get("${REST_URL}.json?$paramsStr") {
			header 'Authorization', 'Bearer ' + ACCESS_TOKEN
			accept 'application/json'
		}
	}

	RestResponse readDomainItemWithParams(String itemId, String paramsStr) {
		return restBuilder.get("${REST_URL}/${itemId}?$paramsStr") {
			header 'Authorization', 'Bearer ' + ACCESS_TOKEN
			accept 'application/json'
		}
	}

	RestResponse deleteDomainItem(String itemId) {
		return restBuilder.delete("${REST_URL}/${itemId}") {
			header 'Authorization', 'Bearer ' + ACCESS_TOKEN
			accept 'application/json'
		}
	}

	RestResponse sendCreateWithData(Closure data) {
		return restBuilder.post("${REST_URL}") {
			header 'Authorization', 'Bearer ' + ACCESS_TOKEN
			accept 'application/json'
			"json" data
		}
	}

	RestResponse sendUpdateWithData(String itemId, Closure data) {
		return restBuilder.put("${REST_URL}/${itemId}") {
			header 'Authorization', 'Bearer ' + ACCESS_TOKEN
			accept 'application/json'
			"json" data
		}
	}
}