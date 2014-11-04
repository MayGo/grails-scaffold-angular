App.controller('GridWithoutItemPerPageController', function ($scope, $routeParams){
    $('#grid-without-item-per-page').jplist({
        itemsBox: '.list',
        itemPath: '.list-item',
        panelPath: '.jplist-panel'
    });
});