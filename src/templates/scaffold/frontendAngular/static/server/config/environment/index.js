'use strict';

var path = require('path');
var _ = require('lodash');

function requiredProcessEnv(name) {
  if(!process.env[name]) {
    throw new Error('You must set the ' + name + ' environment variable');
  }
  return process.env[name];
}

// All configurations will extend these options
// ============================================
var all = {
  env: process.env.NODE_ENV,

  // Root path of server
  root: path.normalize(__dirname + '/../../..'),

  // Server port
  port: process.env.PORT || 9000,



  // Secret for session, you will want to change this and make it an environment variable
  secrets: {
    session: 'app-angular-fullstack-secret'
  },

  // List of user roles
  userRoles: ['guest', 'user', 'admin'],

  //Frontend options to be writen in config.json file
  frontend: {
    "restUrl": "http://localhost:8080/myrestapp",
    "loginUrl": "http://localhost:8080/myrestapp/api/login",
    "logoutUrl": "http://localhost:8080/myrestappy/api/logout",
    "securityEnabled": false
  }

};

// Export the config object based on the NODE_ENV
// ==============================================
module.exports = _.merge(
  all,
  require('./' + process.env.NODE_ENV + '.js') || {});
