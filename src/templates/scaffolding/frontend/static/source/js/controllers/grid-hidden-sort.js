App.controller('GridHiddenSortController', function ($scope, $routeParams){
    $('#grid-hidden-sort').jplist({
        itemsBox: '.list',
        itemPath: '.list-item',
        panelPath: '.jplist-panel'
    });
});