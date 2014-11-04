App.controller('LayoutHeaderTopbarController', function ($scope, $routeParams){
    $scope.layout_header_topbar_update = function(){
        $('#header-topbar-page .option-demo').hover(function() {
            $(this).append("<div class='demo-layout animated fadeInUp'><i class='fa fa-magic mrs'></i>Demo</div>");
        }, function() {
            $('.demo-layout').remove();
        });

        $('#header-topbar-page .demo-layout').live('click', function() {
            var HtmlOption = $(this).parent().detach();
            $('#header-topbar-option-demo').html(HtmlOption).addClass('animated flash').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
                $(this).removeClass('animated flash');
            });

            $('#header-topbar-option-demo .option-demo').unbind('hover');
            return false;
        });
    };
});