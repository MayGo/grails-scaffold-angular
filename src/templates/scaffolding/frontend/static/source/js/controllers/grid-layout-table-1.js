App.controller('GridLayoutTable1Controller', function ($scope, $routeParams){
    $('#grid-layout-table-1').jplist({
        itemsBox: '.demo-tbl',
        itemPath: '.tbl-item',
        panelPath: '.jplist-panel',
        //save plugin state
        storage: 'localstorage', //'', 'cookies', 'localstorage'
        storageName: 'jplist-tabl'
    });
});