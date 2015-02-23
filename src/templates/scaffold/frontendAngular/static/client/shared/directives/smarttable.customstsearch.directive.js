'use strict';
angular.module('angularDemoApp').directive('customStSearch', function() {
	return {
		restrict : 'A',
		require : ['^stTable', 'ngModel'],
		link : function(scope, element, attrs, controllers) {
			var ctrl = controllers[0], ngModel = controllers[1];
			var tableState = ctrl.tableState();
			var searchProperty = attrs.customStSearch;
			
			var initializing = true;
			
			scope.$watch(function() {
				return ngModel.$modelValue;
			}, function(value) {
				if (value !== undefined) {
					//setting initial value did one extra query to backend
					if (initializing){
						initializing = false;
						return;
					}
					//reset
					tableState.search.predicateObject = {};
					var searchVal;

					if(_.isArray(value)){
						value = _.filter(value, function(item) { return !angular.isDefined(item.$resolved) || item.$resolved; });
						searchVal = _.pluck(value, 'id') ;
					}else{
						searchVal = value;
					}
					ctrl.search(searchVal, searchProperty);
				}
			}, true);
		}
	};
}); 