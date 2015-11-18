'use strict';

describe('collapseBarDirective', function () {

  var $compile;
  var scope;

  beforeEach(function () {
    module('angularDemoApp.templates');
    module('angularDemoApp.common.components');
  });

  beforeEach(inject(function (_$compile_, $rootScope) {
    $compile = _$compile_;
    scope = $rootScope.$new();
  }));

  it('should have correct ids', inject(function () {

    var template = '<collapse-bar id="myName" >';
    var collapseBarEl = $compile(template)(scope);
    scope.$apply();
    expect(collapseBarEl.find('#myNameCollapseBar').length).toBe(1);
    expect(collapseBarEl.find('#myNameCollapseContent').length).toBe(1);
    collapseBarEl.remove();

  }));

  it('should be closed if is-toggle-open="false"', inject(function () {

    var template = '<collapse-bar id="myName" is-toggle-open="false">';
    var collapseBarEl = $compile(template)(scope);
    scope.$apply();

    collapseBarEl.remove();

  }));

  it('should have correct title name', inject(function () {

    var template = '<collapse-bar id="myName">';
    var collapseBarEl = $compile(template)(scope);
    scope.$apply();

    collapseBarEl.remove();

  }));

});
