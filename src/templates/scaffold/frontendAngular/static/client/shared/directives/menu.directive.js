'use strict';

angular.module('angularDemoApp')
  .directive('ngMenu', function($parse, $compile){
    return {
        link: function($scope, element, attributes){
            $scope._menu = {status:[], collapse:{}};
			
		
            $scope._menu.collapse = function(i){
                $scope._menu.status[i] = !$scope._menu.status[i];

                var current = attributes.$$element.find('a[index='+i+']');

                current.parent('li').addClass('active').siblings().removeClass('active').children('ul').each(function(){
                    $scope._menu.status[$(this).attr('index')] = true;
                });

            };

            attributes.$$element.find('li').children('a').each(function(index){
                $scope._menu.status[index] = true;
                $(this).attr({'ng-click': '_menu.collapse('+index+')', 'index':index});
                $('>ul', $(this).parent('li')).attr({'collapse': '_menu.status['+index+']', 'index':index});
            }); 
            element.html($compile(element.html())($scope));
        }
    };
});