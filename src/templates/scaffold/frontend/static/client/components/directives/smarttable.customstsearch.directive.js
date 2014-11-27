'use strict';
angular.module('angularDemoApp').directive('customStSearch', function() {
	return {
		restrict : 'A',
		require : ['^stTable', 'ngModel'],
		link : function(scope, element, attrs, controllers) {
			var ctrl = controllers[0], ngModel = controllers[1];
			var tableState = ctrl.tableState();
			var searchProperty = attrs.ngModel;
			scope.$watch(function() {
				return ngModel.$modelValue;
			}, function(value) {
				if (value) {
					//reset
					tableState.search.predicateObject = {};
					var searchVal = (_.isArray(value)) ? _.pluck(value, 'id') : value;
					ctrl.search(_.pluck(value, 'id'), searchProperty);
				}
			}, true);
		}
	};
}); 