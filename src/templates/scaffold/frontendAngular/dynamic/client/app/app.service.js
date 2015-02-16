'use strict';
angular.module('angularDemoApp')
  .factory('AutocompleteService', function(\$resource, appConfig){
  	var toLabel = function(model, labelProperties){
  		if(model){
  			var str = '';
			angular.forEach(labelProperties, function(label, i) {
				if(i > 0){
					str += ' ';
				}
				str += model[label];
			}, str);
			return str;
		}
	    return '';
  	};
  	var toAutocompleteObject = function(item, labelProperties, tagsOutput){
  		var obj = {id:item.id};
  		if(tagsOutput){
  			obj.name = _.map(labelProperties, function(label) { return item[label];  }).join(', ');
		}else{
			angular.forEach(labelProperties, function(label) {
			  obj[label] = item[label];
			}, item);
		}
        return obj;
  	};
  	
  	var resourceQuery = function(val, urlPart, labelProperties, excludes, tagsOutput){
  		var param = {limit: 15};
		param.searchString = val;
		param.excludes = excludes;
		var resource = \$resource(appConfig.restUrl + "/" +urlPart);
		return resource.query(param).\$promise.then(
	        function( response ){
		       	return response.map(function(item){
		       		return toAutocompleteObject(item, labelProperties, tagsOutput);
			    });
	       	}
     	);
  	};
  	var service = {
  		promiseToLabel:function(model, labelProperties){
			model.\$promise.then(function(user) {
				model.name = toLabel(model, labelProperties);
			});
			return model;
		},
	
	<%
	List allEnums = []
	for(d in domainClasses){
  		//Lets find field to display in autocomplete 
		String useDisplaynamesStr = scaffoldingHelper.getDomainClassDisplayNames(d).collect{key, value->"item." + key + ""}.join("+ ' ' +")
		if(!useDisplaynamesStr) useDisplaynamesStr = "item.id"

		excludes = scaffoldingHelper.getProps(d).findAll{it.isAssociation()}
		enums = sh.getProps().findAll{it.type && it.isEnum()}
		allEnums +=enums
	
  		%>
  		${d.propertyName}Query : function(val, labelProperties, tagsOutput){
  			return resourceQuery(val, '${d.propertyName.toLowerCase()}s', labelProperties, '${excludes*.name.join(",")}', tagsOutput);
	    },
	    ${d.propertyName}FormatLabel : function(model, labelProperties) {
		    return toLabel(model, labelProperties);
		},
    <%}
	allEnums.unique{it.getTypePropertyName()}.each{p->
		println "\t${p.getTypePropertyName().replace(".", "")}List: ${(p.type.values()*.name()).collect{"'$it'"}},"
	}
	%>
    };
    return service;
  });
