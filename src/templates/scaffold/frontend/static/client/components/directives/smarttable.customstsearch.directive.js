'use strict';
angular.module('angularDemoApp').directive('customStSearch', function() {
	return {
		restrict : 'A',
		require : ['^stTable', 'ngModel'],
		link : function(scope, element, attrs, controllers) {
			var ctrl = controllers[0], ngModel = controllers[1];
			var tableState = ctrl.tableState();
			var searchProperty = attrs.customStSearch;
			scope.$watch(function() {
				return ngModel.$modelValue;
			}, function(value) {
				if (value) {
					//reset
					tableState.search.predicateObject = {};
					var searchVal;
					if(_.isArray(value)){
						value = _.filter(value, function(item) { return item.$resolved; });
						searchVal = _.pluck(value, 'id') ;
					}else{
						searchVal =  value;
					}
					ctrl.search(_.pluck(value, 'id'), searchProperty);
				}
			}, true);
		}
	};
}); 