'use strict';
var _ = require('lodash');
// Production specific configuration
// =================================

console.log('VCAP_APPLICATION:' + process.env.VCAP_APPLICATION);
console.log('VCAP_SERVICES:' + process.env.VCAP_SERVICES);
console.log('FRONTEND:' + process.env.frontend);
console.log('ENV:' + process.env);


var prod = {
  // Server IP
  ip: process.env.VCAP_APP_HOST || process.env.OPENSHIFT_NODEJS_IP || process.env.IP || undefined,

  // Server port
  port: process.env.VCAP_APP_PORT || process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT || 8080
};

var fromEnv = {};

if (process.env.frontend !== undefined) {
  fromEnv.frontend = JSON.parse(process.env.frontend);
} else {
  console.log("'frontend' config not defined in Enviroment Variables")
}
module.exports = _.merge(
  prod,
  fromEnv);



