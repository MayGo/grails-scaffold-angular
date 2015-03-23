'use strict';
<%
    allProps = scaffoldingHelper.getProps(domainClass)
    props = allProps.findAll{p->!p.embedded} 
    
    includeAngularServices = allProps.findAll{p->(p.oneToMany || p.manyToMany) && p.referencedPropertyName}*.getReferencedPropertyType()

    includeAngularServices -= domainClass.clazz
   
    includeAngularServicesStr=""
    if(includeAngularServices) includeAngularServicesStr=", "+ includeAngularServices.collect{grails.util.GrailsNameUtils.getShortName(it) + "Service"}.unique().join(", ")
%>
<%
private String renderFieldLogic(p, owningClass){
	boolean hasHibernate = pluginManager?.hasGrailsPlugin('hibernate') || pluginManager?.hasGrailsPlugin('hibernate4')
	boolean required = false
	if (hasHibernate) {
		cp = owningClass.constrainedProperties[p.name]?:[:]
		required = (cp ? !(cp.propertyType in [boolean, Boolean]) && !cp.nullable : false)
	}
	
    
     if(p.type && p.isEnum()){
    	return renderEnum(owningClass, p, cp)
    }else if (p.manyToOne || p.oneToOne)
	    return renderManyToOne(owningClass, p, cp)
	else if ((p.oneToMany && !p.bidirectional) || p.manyToMany) {
	    return renderOneToMany(owningClass, p, cp)
	}
	else if (p.oneToMany)
	    return renderOneToMany(owningClass, p, cp)
    return  ""
}

private String renderEnum(owningClass, p, cp) {
      return """"""
}

private String renderManyToOne(owningClass, p, cp) {

     String str =  """"""

}

private String renderManyToMany(owningClass, p, cp) {
     String str =  """"""
     return str;
}

private String renderOneToMany(owningClass, p, cp) {
    //Lets find field to display in autocomplete 
	String useDisplaynamesStr = scaffoldingHelper.getDomainClassDisplayNames(owningClass, p).collect{key, value->"item." + key + ""}.join("+ ', ' +")
	if(!useDisplaynamesStr) useDisplaynamesStr = "item.id"
	excludes = scaffoldingHelper.getProps(p.referencedDomainClass).findAll{it.isAssociation()}
	
    String str =  """
	     if(\$scope.isEditForm){
			${p.referencedDomainClass.shortName}Service.query({max:50, filter:{${(p.referencedPropertyName)?:p.otherSide?.name}:\$stateParams.id}, excludes:'${excludes*.name.join(",")}'}).\$promise.then(
		        function( response ){
	     			\$scope.${domainClass.propertyName}.${p.name} = response.map(function(item){
                        return {id:item.id, name:$useDisplaynamesStr};
				    });
		       	}
	     	);
		 }
		 //Watch for oneToMany property, to add custom object to each value. Without this, adding elements have no effect when POSTing.
     	 \$scope.\$watch('${domainClass.propertyName}.${p.name}', function(values) {
     	 	if(values && values.length>0){
				_.forEach(values, function(value) { value.${p.referencedPropertyName}={id:\$stateParams.id}; });
		    }
	     }, true);
     """;
	String uniDirectionalStr = """
	if(\$scope.${domainClass.propertyName}.${p.name}){
		\$scope.${domainClass.propertyName}.${p.name} = \$scope.${domainClass.propertyName}.${p.name}.map(function(item){
			return {id:item.id, name:$useDisplaynamesStr};
		});
	}
	""";
	if(p.referencedPropertyName){
		return str;
	}else{
		return uniDirectionalStr;
	}

}

%>

angular.module('angularDemoApp')
    .controller('${domainClass.shortName}EditController', function (\$scope, \$state, \$q, \$stateParams, ${domainClass.shortName}Service, ${domainClass.propertyName}Data, \$translate, inform $includeAngularServicesStr) {
    	\$scope.isEditForm = (\$stateParams.id)?true:false;

		\$scope.${domainClass.propertyName} = ${domainClass.propertyName}Data;
	    \$scope.submit = function(frmController) {
			var deferred = \$q.defer();
	    	var errorCallback = function(response){
					if (response.data.errors) {
		                angular.forEach(response.data.errors, function (error) {
							if(angular.element('#'+error.field).length) {
								frmController.setExternalValidation(error.field, undefined, error.message);
							} else {
								inform.add(error.message, {ttl: -1,'type': 'warning'});
							}
		                });
		            }
					deferred.reject(response);
		       };

	    	if(\$scope.isEditForm){
	    		${domainClass.shortName}Service.update(\$scope.${domainClass.propertyName}, function(response) {	
	    			\$translate('pages.${domainClass.shortName}.messages.update').then(function (msg) {
				    	inform.add(msg, {'type': 'success'});
					});
	            	deferred.resolve(response);
		        },errorCallback);
	    	}else{
    			${domainClass.shortName}Service.save(\$scope.${domainClass.propertyName},function(response) {
					
    				\$translate('pages.${domainClass.shortName}.messages.create').then(function (msg) {
				    	inform.add(msg, {'type': 'success'});
					});
					\$state.go('^.view', { id: response.id }, {location: 'replace'});
					deferred.resolve(response);
		        },errorCallback);
	    	}
	        return deferred.promise;
	    };
       <%for (p in props) {%>
		${renderFieldLogic(p, domainClass)}\
	   <%}%>
	});
