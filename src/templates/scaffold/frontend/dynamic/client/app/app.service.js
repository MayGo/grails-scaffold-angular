'use strict';
<% 
    import grails.plugin.scaffold.core.ScaffoldingHelper

%>
angular.module('angularDemoApp')
  .factory('AutocompleteService', function(\$resource, appConfig){
  	var toLabel = function(model, labelProperties){
  		if(model){
  			var str = "";
			angular.forEach(labelProperties, function(label, i) {
				if(i > 0) str += " ";
				str += model[label];
			}, str);
			return str;
		}
	    return '';
  	};
  	var toAutocompleteObject = function(item, labelProperties){
  		var obj = {id:item.id};
   		angular.forEach(labelProperties, function(label, i) {
		  obj[label] = item[label];
		}, item);
        return obj;
  	};
  	var resourceQuery = function(val, urlPart, labelProperties, excludes){
  		var param = {limit: 15};
		param.query = val;
		param.excludes = excludes;
		var resource = \$resource(appConfig.restUrl + urlPart);
		return resource.query(param).\$promise.then(
	        function( response ){
		       	return response.map(function(item){
		       		return toAutocompleteObject(item, labelProperties);
			    });
	       	}
     	);
  	};
  	var service = {
	<%for(d in domainClasses){
  		//Lets find field to display in autocomplete 
		String useDisplaynamesStr = ScaffoldingHelper.getDomainClassDisplayNames(d, config).collect{key, value->"item." + key + ""}.join("+ ' ' +")
		if(!useDisplaynamesStr) useDisplaynamesStr = "item.id"
		ScaffoldingHelper sh = new ScaffoldingHelper(d, pluginManager, comparator, getClass().classLoader)
		excludes = sh.getProps().findAll{it.isAssociation()}
		enums = sh.getProps().findAll{it.type && it.isEnum()}
		enums.each{p->
			println "\t${p.getTypePropertyName().replace(".", "")}List: ${(p.type.values()*.name()).collect{"'$it'"}},"
		}
  		%>
  		${d.propertyName}Query : function(val, labelProperties){
  			return resourceQuery(val, '${d.propertyName.toLowerCase()}s', labelProperties, "${excludes*.name.join(",")}");
	    },
	    ${d.propertyName}FormatLabel : function(model, labelProperties) {
		    return toLabel(model, labelProperties);
		},
    <%}%>
    };
    return service;
  });
