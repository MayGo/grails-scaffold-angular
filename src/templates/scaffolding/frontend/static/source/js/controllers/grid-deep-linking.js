App.controller('GridDeepLinkingController', function ($scope, $routeParams){
    $.fn.Data.checkbox();
    setTimeout(function(){
        $('#grid-deep-linking').jplist({
            itemsBox: '.list',
            itemPath: '.list-item',
            panelPath: '.jplist-panel',
            //deep linking
            deepLinking: true
        });
    },500);

});