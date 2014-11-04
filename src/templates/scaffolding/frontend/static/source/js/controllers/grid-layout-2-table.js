App.controller('GridLayout2TableController', function ($scope, $routeParams){
    $('#grid-layout-first-table').jplist({
        itemsBox: '.demo-tbl',
        itemPath: '.tbl-item',
        panelPath: '.jplist-panel'
    });

    $('#grid-layout-second-table').jplist({
        itemsBox: '.demo-tbl',
        itemPath: '.tbl-item',
        panelPath: '.jplist-panel'
    });
});