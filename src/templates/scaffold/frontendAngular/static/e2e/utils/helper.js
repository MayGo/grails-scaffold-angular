'use strict';
module.exports = {
  waitForPageChange: function (urlSegment) {
    console.log('>> Waiting for URL to contain: ', urlSegment);
    var currentUrl;
    return browser.getCurrentUrl().then(function (url) {
      currentUrl = url;
    }).then(function () {
      browser.wait(function () {
        return browser.getCurrentUrl().then(function (url) {
          if (urlSegment) {
            return url.indexOf(urlSegment) >= 0;
          }
          return url !== currentUrl;
        });
      });
    });
  },
  currentUrlContains: function (urlSegment) {
    return browser.getCurrentUrl().then(function (url) {
      if (urlSegment) {
        return url.indexOf(urlSegment) >= 0;
      }
      return url !== currentUrl;
    });
  }
}
;

