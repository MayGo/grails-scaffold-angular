package defpackage

trait RestQueries {
	
	def queryListWithParams(String paramsStr){
		return restBuilder.get("\${REST_URL}.json?\$paramsStr") {
			header 'Authorization', 'Bearer '+authResponse.json.access_token
			accept "application/json"
		}
	}
	def queryListWithUrlVariables(String paramsStr, Map urlVariables){
		//Using urlvariables because in url cannot be filter={id:1}
		return restBuilder.get("\${REST_URL}.json?\$paramsStr", urlVariables) {
			header 'Authorization', 'Bearer '+authResponse.json.access_token
			accept "application/json"
		}
	}

	
	def readDomainItemWithParams(String itemId, String paramsStr){
		return response = restBuilder.get("\${REST_URL}/\${itemId}?\$paramsStr") {
				header 'Authorization', 'Bearer '+authResponse.json.access_token
				accept "application/json"
		}
	}
	def deleteDomainItem(String itemId){
		return response = restBuilder.delete("\${REST_URL}/\${itemId}") {
				header 'Authorization', 'Bearer '+authResponse.json.access_token
				accept "application/json"
		}
	}
	
	
	def sendCreateWithData(Closure data){
		return restBuilder.post("\${REST_URL}") {
			header 'Authorization', 'Bearer '+authResponse.json.access_token
			accept "application/json"
			"json" data
		}
	}
	def sendUpdateWithData(String itemId,Closure data){
		return restBuilder.put("\${REST_URL}/\${itemId}") {
			header 'Authorization', 'Bearer '+authResponse.json.access_token
			accept "application/json"
			"json" data
		}
	}
	
}