App.controller('GridLayoutUlLiController', function ($scope, $routeParams){
    $('#grid-layout-ul-li').jplist({
        itemsBox: '.ul-li-list',
        itemPath: '.list-item',
        panelPath: '.jplist-panel',
        //save plugin state
        storage: 'localstorage', //'', 'cookies', 'localstorage'
        storageName: 'jplist-ul-li'
    });
});