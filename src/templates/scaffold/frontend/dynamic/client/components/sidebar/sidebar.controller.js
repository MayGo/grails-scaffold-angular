'use strict';

angular.module('angularDemoApp')
  .controller('SidebarController', function (\$scope, \$location) {
    \$scope.menu = [{
      'title': 'User list',
      'link': 'user'
    },
	{
      'title': 'User edit',
      'link': 'user.edit'
    },
	{
      'title': 'User view',
      'link': 'user.view'
    },
	{
      'title': 'User create',
      'link': 'user.create'
    }];

    \$scope.isCollapsed = true;

    \$scope.isActive = function(route) {
      return route === \$location.path();
    };
  });