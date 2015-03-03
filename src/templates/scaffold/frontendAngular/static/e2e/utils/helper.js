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
  },
  /**
   * [selectWindow Focus the browser to the index window. Implementation by http://stackoverflow.com/questions/21700162/protractor-e2e-testing-error-object-object-object-has-no-method-getwindowha]
   * @param  {[Object]} index [Is the index of the window. E.g., 0=browser, 1=FBpopup]
   * @return {[!webdriver.promise.Promise.<void>]}       [Promise resolved when the index window is focused.]
   */
  selectWindow: function (index) {

    // wait for handels[index] to exists
    browser.driver.wait(function () {
      return browser.driver.getAllWindowHandles().then(function (handles) {
        /**
         * Assume that handles.length >= 1 and index >=0.
         * So when i call selectWindow(index) i return
         * true if handles contains that window.
         */
        if (handles.length > index) {
          return true;
        }
      });
    });
    // here i know that the requested window exists

    // switch to the window
    return browser.driver.getAllWindowHandles().then(function (handles) {
      return browser.driver.switchTo().window(handles[index]);
    });
  }
}
;

