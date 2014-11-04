App.directive("ngMenu", function($parse, $compile){
    return {
        link: function($scope, element, attributes){
            $scope._menu = {status:[], collapse:{}, hover:[]};
			
			$scope._menu.mouseleave = function(){
				for(var j=0; j<$scope._menu.hover.length; j++){
					$scope._menu.hover[j] = '';
				}
			};
			$scope._menu.mouseover = function(i){
				for(var j=0; j<$scope._menu.hover.length; j++){
					$scope._menu.hover[j] = '';
				}
				$scope._menu.hover[i] = 'nav-hover';
			};
            $scope._menu.collapse = function(i){
                $scope._menu.status[i] = !$scope._menu.status[i];

                var current = attributes.$$element.find('a[index='+i+']');

                current.parent('li').addClass('active').siblings().removeClass('active').children('ul').each(function(){
                    $scope._menu.status[$(this).attr('index')] = true;
                });

                if(current.hasClass('btn-fullscreen')){
                    if (!document.fullscreenElement &&
                        !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement){
                        if (document.documentElement.requestFullscreen) {
                            document.documentElement.requestFullscreen();
                        } else if (document.documentElement.msRequestFullscreen) {
                            document.documentElement.msRequestFullscreen();
                        } else if (document.documentElement.mozRequestFullScreen) {
                            document.documentElement.mozRequestFullScreen();
                        } else if (document.documentElement.webkitRequestFullscreen) {
                            document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
                        }
                    } else {
                        if (document.exitFullscreen) {
                            document.exitFullscreen();
                        } else if (document.msExitFullscreen) {
                            document.msExitFullscreen();
                        } else if (document.mozCancelFullScreen) {
                            document.mozCancelFullScreen();
                        } else if (document.webkitExitFullscreen) {
                            document.webkitExitFullscreen();
                        }
                    }
                }
            };

            attributes.$$element.find('li').children('a').each(function(index, value){
                $scope._menu.status[index] = true;
                $(this).attr({'ng-click': '_menu.collapse('+index+')', 'index':index});
                $('>ul', $(this).parent('li')).attr({'collapse': '_menu.status['+index+']', 'index':index});
            });
			
			$(">li", attributes.$$element).each(function(index, value){
				$scope._menu.hover[index] = '';
				$(this).attr({'ng-mouseleave':'_menu.mouseleave()', 'ng-mouseover': '_menu.mouseover('+index+')', 'ng-class':'_menu.hover['+index+']'});
			});
 
            element.html($compile(element.html())($scope));
        }
    };
});