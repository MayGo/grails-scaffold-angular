App.controller('GridFilterWithUiLiController', function ($scope, $routeParams){
    $('#grid-filter-with-ul-li').jplist({
        itemsBox: '.list',
        itemPath: '.list-item',
        panelPath: '.jplist-panel',
        //save plugin state
        storage: 'localstorage', //'', 'cookies', 'localstorage'
        storageName: 'drop-down-filters-ul-li'
    });
});