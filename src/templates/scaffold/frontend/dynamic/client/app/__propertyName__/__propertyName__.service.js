'use strict';

angular.module('angularDemoApp')
  .service('${domainClass.shortName}', function(\$resource, appConfig){
        return \$resource(appConfig.restUrl + '${domainClass.propertyName.toLowerCase()}s/:id', { id: '@id' }, {
            //query: {method:'GET',  params:{}, isArray:true},
            update: {
                method: 'PUT' // this method issues a PUT request
            }
        });
    });
