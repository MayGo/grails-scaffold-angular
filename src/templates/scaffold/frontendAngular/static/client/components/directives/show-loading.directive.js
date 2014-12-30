'use strict';


angular.module('angularDemoApp')
  .directive('mxShowLoading', function(){
    return {
		priority:-1000,
		restrict: 'A',
		link: function ($scope, ele, attrs) {
			$scope.isBusy = false;
			var defaultText;
			//with click events, handle "busy" status
			var functionName = "showLoading" + Math.floor(Math.random() * 10001);
            var onClick = attrs.ngClick;
			var loadingText = attrs.mxShowLoading;
			var hasLoadingText = (!angular.isUndefined(loadingText) && angular.isString(loadingText) && loadingText != "");
		 
			var loadingEl;
			if (hasLoadingText){
				loadingEl = loadingText;
			}else{
				loadingEl = angular.element('<span class="loading-spinner"/>');
			}
			
			//wrap onClick so we can enable "busy" status
			$scope[functionName] = function () {
				//if it's already busy, don't accept a new click
				if ($scope.busy === true) {
					return false;
				}

				//handle busy button that uses ngClick
				$scope.isBusy = true;
				defaultText = ele.html();
				ele.addClass('disabled');
				ele.html(loadingEl);
				var ret = $scope.$eval(onClick);
				if (angular.isDefined(ret) && angular.isFunction(ret.then)) {
					ret.finally(function () {
						ele.removeClass('disabled');
						ele.html(defaultText);
						$scope.isBusy = false;
						attrs.$set('ngClick', onClick);
					});
				}
			};

			//handle busy button that uses ngClick
			if (angular.isDefined(attrs.ngClick)) {
				//by using ngClick instead of .bind(), we're leaving garbage collection up to Angular
				attrs.$set('ngClick', functionName + '()');
			}
			
			
		}
	};
});