App.controller('AppController', function ($scope, $rootScope, $routeParams, $location){
    $rootScope.style = 'style1';
    $rootScope.theme = 'pink-blue';

    $scope.data = {};
    $scope.effect = '';
    $scope.header = {
        form: false,
        chat: false,
        theme: false,
		footer: true,
        history:false,
        animation:'',
		boxed:'',
        layout_menu:'',
		theme_style:'style1',
        header_topbar:'static',
        menu_style:'sidebar-default',		
		layout_horizontal_menu:'',		

        toggle: function(k){
            switch(k){
                case 'chat':
                    $scope.header.chat = !$scope.header.chat;
                    break;
                case 'form':
                    $scope.header.form = !$scope.header.form;
                    break;
                case 'sitebar':					
                    $scope.header.header_topbar = $scope.header.header_topbar ? '' : (($scope.header.layout_menu === '') ? 'sidebar-collapsed' : 'right-side-collapsed');
                    break;
                case 'theme':
                    $scope.header.theme = !$scope.header.theme;
                    break;
                case 'history':
                    $scope.header.history = !$scope.header.history;
                    $scope.header.menu_style = $scope.header.history ? 'sidebar-collapsed' : 'sidebar-default';
                    break;
            }
        }
    };

    $scope.$on('$routeChangeSuccess', function (event, current, previous){
        $scope.header.animation = 'fadeInUp';
        setTimeout(function(){
            $scope.header.animation = '';
        }, 100);

        $scope.data = $.fn.Data.get(current.originalPath);
        if(-1 == $.inArray(current.originalPath, ['/extra-500', '/extra-404', '/extra-lock-screen', '/extra-signup', '/extra-signin'])){
            $('body').removeClass('bounceInLeft');
            $("body>.default-page").show();
            $("body>.extra-page").hide();
        }
        else{
            window.scrollTo(0,0);
        }
		
		$scope.header.boxed = '';
		$scope.header.footer = true;

        $rootScope.style = 'style1';
        $rootScope.theme = 'pink-blue';

		if('/layout-left-sidebar' === current.originalPath){
			$scope.header.layout_menu = '';	
			$scope.header.header_topbar = '';
			$scope.header.layout_horizontal_menu = '';
		}
		else if('/layout-left-sidebar-collapsed' === current.originalPath){
			$scope.header.layout_menu = '';	
			$scope.header.header_topbar = 'sidebar-collapsed';
			$scope.header.layout_horizontal_menu = '';
		}
		else if('/layout-right-sidebar' === current.originalPath){
			$scope.header.layout_menu = 'right-sidebar';	
			$scope.header.header_topbar = '';
			$scope.header.layout_horizontal_menu = '';
		}
		else if('/layout-right-sidebar-collapsed' === current.originalPath){
			$scope.header.layout_menu = 'right-sidebar';	
			$scope.header.header_topbar = 'right-side-collapsed';
			$scope.header.layout_horizontal_menu = '';
		}
		else if('/layout-horizontal-menu' === current.originalPath){
			$scope.header.layout_menu = '';	
			$scope.header.header_topbar = 'horizontal-menu-page';
			$scope.header.layout_horizontal_menu = 'horizontal-menu hidden-sm hidden-xs';			
		}
		else if('/layout-horizontal-menu-sidebar' === current.originalPath){
			$scope.header.layout_horizontal_menu = 'horizontal-menu hidden-sm hidden-xs';			
		}
		else if('/layout-fixed-topbar' === current.originalPath){			
			$scope.header.layout_menu = '';	
			$scope.header.header_topbar = 'fixed-topbar';
			$scope.header.layout_horizontal_menu = '';
		}
		else if('/layout-boxed' === current.originalPath){			
			$scope.header.boxed = 'container';
		}
		else if('/layout-hidden-footer' == current.originalPath){
			$scope.header.footer = false;	
		}
        else if($.inArray(current.originalPath, ['/extra-500', '/extra-404'])>=0){
            $rootScope.style = 'style1';
            $rootScope.theme = 'pink-violet';
        }
    });

    $scope.style_change = function(){
        $rootScope.style = $scope.header.theme_style;
    };

    $scope.theme_change = function(t){
        $rootScope.theme = t;
    };

    $(window).scroll(function(){
        if ($(this).scrollTop() > 0) {
            $('.quick-sidebar').css('top','0');
        } else {
            $('.quick-sidebar').css('top','50px');
        }
    });
    $('.quick-sidebar > .header-quick-sidebar').slimScroll({
        "height": $(window).height() - 50,
        'width': '280px',
        "wheelStep": 5
    });
    $('#news-ticker-close').click(function(e){
        $('.news-ticker').remove();
    });
});