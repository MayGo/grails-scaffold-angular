App.controller('UINotific8NotificationsController', function ($scope, $routeParams){
    $.fn.Data.checkbox();

    WS.jQuery.notific8.init();

    $('#message_trigger_ok').on('click', function(e) {
        e.preventDefault();
        $.scojs_message('The system has been updated with many new features', $.scojs_message.TYPE_OK);
    });
    $('#message_trigger_err').on('click', function(e) {
        e.preventDefault();
        $.scojs_message('The system is not working for maintenance', $.scojs_message.TYPE_ERROR);
    });
});