'use strict';

angular.module('angularDemoApp')
  .controller('ErrorController', function ($scope, $state, $stateParams, $translate, inform) {
	$translate($stateParams.messageCode || 'pages.session.messages.default').then(function (msg) {
		var url =  $stateParams.url || ''
		$scope.message = msg + url;
	});
  });
