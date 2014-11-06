'use strict';

angular.module('angularDemoApp')
  .service('${domainClass.shortName}Service', function(\$resource){
        return \$resource('http://localhost:8181/horizon/${domainClass.propertyName}s/:id', { id: '@id' }, {
            //query: {method:'GET',  params:{}, isArray:true},
            update: {
                method: 'PUT' // this method issues a PUT request
            }
        });
    });
