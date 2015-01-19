'use strict';

describe('Login Page', function() {
  var page;

  beforeEach(function() {
	 
    //browser.get('/');//Should redirect to login if security enabled
    browser.get('/#/login');
    page = require('./login.po');
  });

  it('should include login form with username/password', function() {
    expect(page.usernameEl).not.toBeNull();
    expect(page.passwordEl).not.toBeNull();
  });
});
