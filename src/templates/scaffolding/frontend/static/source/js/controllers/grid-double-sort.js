App.controller('GridDoubleSortController', function ($scope, $routeParams){
    $('#grid-double-sort').jplist({
        itemsBox: '.list',
        itemPath: '.list-item',
        panelPath: '.jplist-panel'
    });
});