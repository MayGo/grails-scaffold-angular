'use strict';

angular.module('angularDemoApp')
	.controller('${domainClass.shortName}ListController', function (\$scope, \$rootScope,
		\$state, \$q, ${domainClass.shortName}Service, \$stateParams, \$timeout, inform, ngTableParams, appConfig, \$location, \$mdDialog) {

		if(\$state.current.data){
			\$scope.isTab = \$state.current.data.isTab;
		}

		\$scope.delete${domainClass.shortName} = function(instance){
			return ${domainClass.shortName}Service.deleteInstance(instance).then(function(instance){
				\$scope.tableParams.reload();
				return instance;
			});
		};


		\$scope.search = {};

		if(\$location.search().filter) {
			angular.extend(\$scope.search,\$location.search())
			\$location.search().filter = null
		}

		var filterTimeout;
		var defaultParams = {
			page: 1,            // show first page
			count: appConfig.itemsByPage,          // count per page
			sorting: {
				id: 'asc'     // initial sorting
			},
			filter: \$scope.search
		};
		var parameters = angular.extend(defaultParams,\$location.search());
		var errorCallback = function(response){
			if (response.data && response.data.errors) {
				angular.forEach(response.data.errors, function (error) {
					inform.add(error.message, {ttl: -1,'type': 'warning'});
				});
			}
		};
		var settings = {
			getData: function(\$defer, params) {
				// do not let to make do much queries
				if (filterTimeout){
					\$timeout.cancel(filterTimeout);
				}

				filterTimeout = \$timeout(function() {
					\$location.search(params.url()); // put params in url
					var offset = (params.page()-1) * params.count();
					var paging = {max: params.count(), offset: offset};

					var query = _.merge(paging, params.filter())

					if (params.sorting()) {
						query.sort = Object.keys(params.sorting())[0];
						query.order = params.sorting()[query.sort];
					}

					if(\$stateParams.relationName && \$stateParams.id){
						if(_.isEmpty(query[\$stateParams.relationName])){
							query[\$stateParams.relationName] = [];
						}
						query[\$stateParams.relationName].push(Number(\$stateParams.id));
					}

					${domainClass.shortName}Service.query(query, function(response, responseHeaders){
						params.total(responseHeaders().total);
						\$defer.resolve(response);
					}, errorCallback);
				}, 255);
			}
		};

		\$scope.tableParams = new ngTableParams(parameters, settings);

		/**
		 * When list is opened as modal to select item to field with item-selector directive
		 * @param item
		 */
		\$scope.selectItemToField = function (item) {
			console.log("Selected item:", item);
			\$mdDialog.hide(item);
		};

		\$scope.closeItemToFieldSelector = function () {
			\$mdDialog.hide();
		};
});
