'use strict';
<% 
    import grails.plugin.scaffold.core.ScaffoldingHelper
    ScaffoldingHelper sh = new ScaffoldingHelper(domainClass, pluginManager, comparator, getClass().classLoader)
    allProps = sh.getProps()
    props = allProps.findAll{p->!p.embedded} 
    
    includeAngularServices = allProps.findAll{p->p.manyToOne || p.oneToMany || p.manyToMany || p.oneToOne}*.getReferencedPropertyType()

    includeAngularServices -= domainClass.clazz
   
    includeAngularServicesStr=""
    if(includeAngularServices) includeAngularServicesStr=", "+ includeAngularServices.collect{grails.util.GrailsNameUtils.getShortName(it)}.unique().join(", ")
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
	String useDisplaynamesStr = ScaffoldingHelper.getDomainClassDisplayNames(owningClass, config, p).collect{key, value->"item." + key + ""}.join("+ ', ' +")
	if(!useDisplaynamesStr) useDisplaynamesStr = "item.id"
	ScaffoldingHelper sh2 = new ScaffoldingHelper(p.referencedDomainClass, pluginManager, comparator, getClass().classLoader)
	excludes = sh2.getProps().findAll{it.isAssociation()}
    String str =  """
	     if(\$scope.isEditForm){
			${p.referencedDomainClass.shortName}.query({filter:{${p.referencedPropertyName}:\$stateParams.id}, excludes:"${excludes*.name.join(",")}"}).\$promise.then(
		        function( response ){
			       	\$scope.${domainClass.propertyName} = angular.extend({}, \$scope.${domainClass.propertyName});
	     			\$scope.${domainClass.propertyName}.${p.name} = response.map(function(item){
                        return {id:item.id, name:$useDisplaynamesStr};
				    });
		       	}
	     	);
	     	
		 }
		 //Watch for oneToMany property, to add custom object to each value. Without this, adding elements have no effect when POSTing.
     	 \$scope.\$watch('${domainClass.propertyName}.${p.name}', function(values) {
     	 	if(values && values.length>0){
				_.forEach(values, function(value) { value['${p.getReferencedPropertyName()}']={id:\$stateParams.id}; });
		    }
	     }, true);
     """
     return str;
}

%>

angular.module('angularDemoApp')
    .controller('${domainClass.shortName}EditCtrl', function (\$scope, \$state, \$stateParams, ${domainClass.shortName}, inform $includeAngularServicesStr) {
    	\$scope.isEditForm = (\$stateParams.id)?true:false;
    	
    	
    	if(\$scope.isEditForm){
    		${domainClass.shortName}.get({id:\$stateParams.id}).\$promise.then(
		        function( response ){
			       	\$scope.${domainClass.propertyName} = angular.extend({}, \$scope.${domainClass.propertyName} , response);
			       	\$scope.orig = angular.copy(\$scope.${domainClass.propertyName} );
		       	}
	     	);
    	}else{
    		\$scope.${domainClass.propertyName} = new ${domainClass.shortName}();
    	}
		
	
	    \$scope.submit = function(frmCtrl) {
	    	var errorCallback = function(response){
				if (response.data.errors) {
	                angular.forEach(response.data.errors, function (error) {
	                    frmCtrl.setExternalValidation(error.field, undefined, error.message);
	                })
	            }
	        }
	    	if(\$scope.isEditForm){
	    		${domainClass.shortName}.update(\$scope.${domainClass.propertyName}, function(response) {
		            inform.add("Updated ${domainClass.shortName}", {
		            	  "type": "success"
	            	});
	            	\$state.go('^.view', { id: response.id });
		        },errorCallback);
	    	}else{
    			${domainClass.shortName}.save(\$scope.${domainClass.propertyName},function(response) {
		            inform.add("Created ${domainClass.shortName}", {
		            	  "type": "success"
	            	});
            	 	\$state.go('^.view', { id: response.id });
		        },errorCallback);
	    	}
	        
	    };
       <%for (p in props) {%>
		${renderFieldLogic(p, domainClass)}\
	   <%}%>
	});
