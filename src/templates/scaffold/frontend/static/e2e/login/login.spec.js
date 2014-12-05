'use strict';

describe('Login Page', function() {
  var page;

  beforeEach(function() {
    browser.get('/');
    page = require('./login.po');
  });

  it('should include login form with username/password', function() {
    expect(page.usernameEl).not.toBeNull();
    expect(page.passwordEl).toBeNull();
  });
});
