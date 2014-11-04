App.controller('TableDatatablesController', function ($scope, $routeParams){
    setTimeout(function(){
        // Init
        var spinner = $( ".spinner" ).spinner();
        var table = $('#table_id').dataTable( {
            "lengthMenu": [[5, 10, 25, 50, -1], [5, 10, 25, 50, "All"]]
        } );

        var tableTools = new $.fn.dataTable.TableTools( table, {
            "sSwfPath": "../vendors/DataTables/extensions/TableTools/swf/copy_csv_xls_pdf.swf",
            "buttons": [
                "copy",
                "csv",
                "xls",
                "pdf",
                { "type": "print", "buttonText": "Print me!" }
            ]
        } );
        $(".DTTT_container").css("float","right");

        if($('#demo-checkbox-radio').length <= 0){
            $('input[type="checkbox"]:not(".switch")').iCheck({
                checkboxClass: 'icheckbox_minimal-grey',
                increaseArea: '20%' // optional
            });

            $('input[type="radio"]:not(".switch")').iCheck({
                radioClass: 'iradio_minimal-grey',
                increaseArea: '20%' // optional
            });
        }

        //BEGIN CHECKBOX TABLE
        $('.checkall').on('ifChecked ifUnchecked', function(event) {
            if (event.type == 'ifChecked') {
                $(this).closest('table').find('input[type=checkbox]').iCheck('check');
            } else {
                $(this).closest('table').find('input[type=checkbox]').iCheck('uncheck');
            }
        });
        //END CHECKBOX TABLE
    },50);

});