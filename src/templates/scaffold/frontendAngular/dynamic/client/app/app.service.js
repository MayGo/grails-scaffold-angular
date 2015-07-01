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
  		var param = {max: 15};
		param.searchString = val;
		param.excludes = excludes;
		var resource = \$resource(appConfig.restUrl + '/' + urlPart);
		return resource.query(param).\$promise.then(
	        function( response ){
		       	return response.map(function(item){
		       		return toAutocompleteObject(item, labelProperties, tagsOutput);
			    });
	       	}
     	);
  	};

	var autocompleteObjToString = function(model){
		var str = '';
		var stringify = function(obj){
			_.forIn(obj, function(value) {
				if(_.isObject(value)){
					stringify(value);
				} else {
					if(str !== ''){
						str += ' ';
					}
					str += value;
				}
			});
		};
		stringify(model);
		//console.log(str)
		return str;
	};

  	var service = {
  		promiseToLabel:function(model, labelProperties){
			model.\$promise.then(function() {
				model.name = toLabel(model, labelProperties);
			});
			return model;
		},
	<%
	List allAutocompleteProps = []
	for(d in domainClasses) {

		scaffoldingHelper.getProps(d).each{
			if(it.cp.widget == 'autocomplete'){
				allAutocompleteProps << it
			}

			if(it.embedded){
				scaffoldingHelper.getProps(it.component).each{
					if(it.cp.widget == 'autocomplete'){
						allAutocompleteProps << it
					}
				}
			}
		}
	}


	allAutocompleteProps.collectEntries {a->
			String acFunctionName = (a.cp.format)?: a.name
			[(acFunctionName): a]
	}.each{acFunctionName, a->
		%>
		${acFunctionName}SimpleQuery : function(val, tagsOutput){
			var urlVar = '${acFunctionName}Url';
			var url = appConfig[urlVar];
			if(url === undefined){
				console.error('Define ' + urlVar + ' in config.json.');
				url = 'http://localhost:8080/' + urlVar; // for karma tests
			}
			var param = {max: 15};
			param.searchString = val;
			var resource = \$resource(url);
			return resource.query(param).\$promise.then(
				function( response ){
					return response.map(function(item){
						var obj = item;
						if(tagsOutput){
							obj = {id: item.id, name: autocompleteObjToString(item)};
						}else{
							item.label = autocompleteObjToString(item);
						}
						// postgres json can only save objects at the moment
						return obj;
					});
				}
			);
		},
		${acFunctionName}SimpleFormatLabel : function(model) {
			if(model === undefined){
				return '';
			}
			if(model.item !== undefined && model.item.label !== undefined){
				return model.item.label;
			}
			return autocompleteObjToString(model);
		},
	<%}%>

	<%
	List allEnums = []
	for(d in domainClasses){
  		//Lets find field to display in autocomplete

		String useDisplaynamesStr = scaffoldingHelper.getDomainClassDisplayNames(d).collect{key, value->"item." + key + ""}.join("+ ' ' +")
		if(!useDisplaynamesStr) useDisplaynamesStr = "item.id"

		excludes = scaffoldingHelper.getProps(d).findAll{it.isAssociation()}
		enums = scaffoldingHelper.getProps(d).findAll{it.type && it.isEnum()}
		allEnums +=enums
	
	%>
  		${d.propertyName}Query : function(val, labelProperties, tagsOutput){
  			return resourceQuery(val, '${d.propertyName.toLowerCase()}s/v1', labelProperties, '${excludes*.name.join(",")}', tagsOutput);
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
