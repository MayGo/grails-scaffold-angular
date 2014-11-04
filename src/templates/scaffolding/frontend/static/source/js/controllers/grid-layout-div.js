App.controller('GridLayoutDivController', function ($scope, $routeParams){
    $('#grid-layout-div').jplist({
        itemsBox: '.list',
        itemPath: '.list-item',
        panelPath: '.jplist-panel',
        //save plugin state
        storage: 'localstorage', //'', 'cookies', 'localstorage'
        storageName: 'jplist-div-layout'
    });
});

