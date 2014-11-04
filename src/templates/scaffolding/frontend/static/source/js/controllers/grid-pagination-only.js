App.controller('GridPaginationOnlyController', function ($scope, $routeParams){
    $('#grid-pagination-only').jplist({
        itemsBox: '.list',
        itemPath: '.list-item',
        panelPath: '.jplist-panel'
    });
});