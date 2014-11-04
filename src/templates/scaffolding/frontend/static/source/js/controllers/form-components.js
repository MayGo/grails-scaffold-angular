App.controller('FormComponentsController', function ($scope, $routeParams){
    setTimeout(function(){
        //BEGIN PLUGINS DATE RANGE PICKER
        $('input[name="daterangepicker-default"]').daterangepicker();
        $('input[name="daterangepicker-date-time"]').daterangepicker({ timePicker: true, timePickerIncrement: 30, format: 'MM/DD/YYYY h:mm A' });
        $('.reportrange').daterangepicker(
            {
                ranges: {
                    'Today': [moment(), moment()],
                    'Yesterday': [moment().subtract('days', 1), moment().subtract('days', 1)],
                    'Last 7 Days': [moment().subtract('days', 6), moment()],
                    'Last 30 Days': [moment().subtract('days', 29), moment()],
                    'This Month': [moment().startOf('month'), moment().endOf('month')],
                    'Last Month': [moment().subtract('month', 1).startOf('month'), moment().subtract('month', 1).endOf('month')]
                },
                startDate: moment().subtract('days', 29),
                endDate: moment()
            },
            function(start, end) {
                $('.reportrange span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
            }
        );
        $('.reportrange span').html(moment().subtract('days', 29).format('MMMM D, YYYY') + ' - ' + moment().format('MMMM D, YYYY'));
        //END PLUGINS DATE RANGE PICKER

        //BEGIN PLUGINS DATE PICKER
        $('.datepicker-default').datepicker();
        $('.datepicker-years').datepicker({
            startView: 1,
            minViewMode: 2
        });
        $('.input-daterange').datepicker({
            format: "dd-mm-yyyy"
        });
        $('.datepicker-inline').datepicker({
            format: "dd-mm-yyyy",
            startView: 2,
            minViewMode: 1
        });
        //END PLUGINS DATE PICKER

        //BEGIN PLUGINS DATETIME PICKER
        $('.datetimepicker-default').datetimepicker();
        $('.datetimepicker-disable-date').datetimepicker({
            pickDate: false
        });
        $('.datetimepicker-disable-time').datetimepicker({
            pickTime: false
        });
        $('.datetimepicker-start').datetimepicker();
        $('.datetimepicker-end').datetimepicker();
        $('.datetimepicker-start').on("change.dp",function (e) {
            $('.datetimepicker-end').data("DateTimePicker").setStartDate(e.date);
        });
        $('.datetimepicker-end').on("change.dp",function (e) {
            $('.datetimepicker-start').data("DateTimePicker").setEndDate(e.date);
        });
        //END PLUGINS DATETIME PICKER

        //BEGIN PLUGINS TIME PICKER
        $('.timepicker-default').timepicker();
        $('.timepicker-24hr').timepicker({
            autoclose: true,
            minuteStep: 1,
            showSeconds: true,
            showMeridian: false
        });
        //END PLUGINS TIME PICKER

        //BEGIN PLUGINS CLOCKFACE TIME PICKER
        $('.clockface-default').clockface();
        $('.clockface-component').clockface({
            format: 'HH:mm',
            trigger: 'manual'
        });

        $('#btn-clockface-component').click(function(e){
            e.stopPropagation();
            $('.clockface-component').clockface('toggle');
        });

        $('.clockface-inline').clockface({
            format: 'H:mm'
        }).clockface('show', '14:30');
        //END PLUGINS CLOCKFACE TIME PICKER


        //BEGIN PLUGINS COLOR PICKER
        $('.colorpicker-default').colorpicker();
        $('.colorpicker-rgba').colorpicker();
        $('.colorpicker-component').colorpicker({
            format: 'hex'
        }).on('changeColor', function(ev) {
                $('.colorpicker-component span i').css('color',ev.color.toHex());
                $('.colorpicker-component input').val(ev.color.toHex());
            });
        //END PLUGINS COLOR PICKER

        // BEGIN PLUGIN MASK INPUT
        $("#date").mask("99/99/9999");
        $("#phone").mask("(999) 999-9999");
        $("#product-key").mask("(aa) 99-999");
        // END PLUGIN MASK INPUT

        //$("[name='my-checkbox']").bootstrapSwitch();
        setTimeout(function(){
            $('.make-switch').bootstrapSwitch();
        }, 50);

        //BEGIN CHECKBOX & RADIO
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
        //END CHECKBOX & RADIO
        //BEGIN CHARACTER COUNT
        $("#message1, #message2").charCount();
        $("#message3").charCount({
            allowed: 50,
            warning: 20,
            counterText: 'Characters left: '
        });
        //END CHARACTER COUNT
        //BEGIN PORTLET
        $(".portlet").each(function(index, element) {
            var me = $(this);
            $(">.portlet-header>.tools>i", me).click(function(e){
                if($(this).hasClass('fa-chevron-up')){
                    $(">.portlet-body", me).slideUp('fast');
                    $(this).removeClass('fa-chevron-up').addClass('fa-chevron-down');
                }
                else if($(this).hasClass('fa-chevron-down')){
                    $(">.portlet-body", me).slideDown('fast');
                    $(this).removeClass('fa-chevron-down').addClass('fa-chevron-up');
                }
                else if($(this).hasClass('fa-cog')){
                    //Show modal
                }
                else if($(this).hasClass('fa-refresh')){
                    //$(">.portlet-body", me).hide();
                    $(">.portlet-body", me).addClass('wait');

                    setTimeout(function(){
                        //$(">.portlet-body>div", me).show();
                        $(">.portlet-body", me).removeClass('wait');
                    }, 1000);
                }
                else if($(this).hasClass('fa-times')){
                    me.remove();
                }
            });
        });
        //END PORTLET
    }, 100);
});