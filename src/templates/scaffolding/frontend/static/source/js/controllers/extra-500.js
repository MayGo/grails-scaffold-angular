App.controller('Extra500Controller', function ($scope, $routeParams){
    $('body').addClass('bounceInLeft');
    $("body>.default-page").hide();
    $("body>.extra-page").html($(".page-content").html()).show();
});