App.controller('GridFilterWithSelectController', function ($scope, $routeParams){
    $('#grid-filter-with-select').jplist({
        itemsBox: '.list',
        itemPath: '.list-item',
        panelPath: '.jplist-panel'
    });
});