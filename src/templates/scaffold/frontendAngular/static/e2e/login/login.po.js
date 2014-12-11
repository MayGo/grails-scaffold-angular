/**
 * This file uses the Page Object pattern to define the main page for tests
 * https://docs.google.com/presentation/d/1B6manhG0zEXkC-H-tPo2vwU06JhL8w9-XCF9oehXzAQ
 */

'use strict';

var LoginPage = function() {
  this.usernameEl = element(by.model('user.username'));
  this.passwordEl = element(by.model('user.password'));
};

module.exports = new LoginPage();

