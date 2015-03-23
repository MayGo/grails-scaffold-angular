'use strict';

angular.module('angularDemoApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('app.dashboard', {
        url: '/dashboard',
        templateUrl: 'app/dashboard/dashboard.html',
        controller: 'DashboardController',
		data: {
			/*permissions: {
				only: ['ROLE_ADMIN']
			}*/
		},
		resolve:{
			lastInsertedList: function($http, appConfig){
				return $http.get(appConfig.restUrl + '/statistics/lastInserted').then(function(response) {
					return response.data;
				});
			},
			totalInsertedList: function($http, appConfig){
				 return $http.get(appConfig.restUrl + '/statistics/totalInserted').then(function(response) {
					return  response.data;
				});
			}
		}
      });
  });
