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


					//reset
					//tableState.search.predicateObject = {};
					var searchVal;

					if(_.isArray(value)){
						value = _.filter(value, function(item) { return !angular.isDefined(item.$resolved) || item.$resolved; });
						searchVal = _.pluck(value, 'id') ;

            // TODO: was problem with initializing
            if (initializing){
              //setting initial value did one extra query to backend
              initializing = false;
             // return;
            }
					}else{
						searchVal = value;
					}
          if(searchVal && typeof searchVal.getMonth === 'function' ){
            ctrl.search(searchVal.toJSON(), searchProperty);
          }else{
            ctrl.search(searchVal, searchProperty);
          }

				}
			}, true);
		}
	};
});
