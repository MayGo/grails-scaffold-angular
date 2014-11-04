App.controller('TableActionController', function($scope, $routeParams){
    $scope.table_action_update = function(){
        $(".spinner").spinner();
        $.fn.Data.checkbox();

        //BEGIN CHECKBOX TABLE
        $('.checkall').on('ifChecked ifUnchecked', function(event) {
            if (event.type == 'ifChecked') {
                $(this).closest('table').find('input[type=checkbox]').iCheck('check');
            } else {
                $(this).closest('table').find('input[type=checkbox]').iCheck('uncheck');
            }
        });
        //END CHECKBOX TABLE
    };
});