App.controller('GridLayoutTable2Controller', function ($scope, $routeParams){
    $('#grid-layout-table-2').jplist({
        itemsBox: '.demo-tbl tbody',
        itemPath: '.tbl-item',
        panelPath: '.jplist-panel',
        //save plugin state
        storage: 'localstorage', //'', 'cookies', 'localstorage'
        storageName: 'jplist-table-2',
        redrawCallback: function(){
            $('.tbl-item').each(function(index, el){
                if(index%2 === 0){
                    $(el).addClass('even');
                }
                else{
                    $(el).addClass('odd');
                }
            });
        }
    });
});