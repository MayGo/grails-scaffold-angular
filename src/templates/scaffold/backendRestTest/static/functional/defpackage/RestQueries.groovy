package defpackage

import grails.plugins.rest.client.RestResponse

trait RestQueries {

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
		return restBuilder.get("${REST_URL}/${itemId}?$paramsStr") {
			header 'Authorization', 'Bearer '+authResponse.json.access_token
			accept 'application/json'
		}
	}

	RestResponse deleteDomainItem(String itemId){
		return restBuilder.delete("${REST_URL}/${itemId}") {
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