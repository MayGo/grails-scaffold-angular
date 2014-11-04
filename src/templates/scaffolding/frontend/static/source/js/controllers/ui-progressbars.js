App.controller('UiProgressbarsController', function ($scope, $routeParams){
    $scope.update_progressbar= function(){
        setTimeout(function(){
            var $ps = $('.m-multi-trigger .progress-bar');
            $('#m-multi-trigger-0').click(function() {
                $ps.attr('aria-valuetransitiongoal', 0).progressbar();
            });
            $('#m-multi-trigger-50').click(function() {
                $ps.attr('aria-valuetransitiongoal', 50).progressbar();
            });
            $('#m-multi-trigger-100').click(function() {
                $ps.attr('aria-valuetransitiongoal', 100).progressbar();
            });
        }, 50);
        setTimeout(function(){
            $('#refresh-speed-progressbars .progress-bar').progressbar({
                display_text: 'center',
                use_percentage: false,
                refresh_speed: 2000
            });
            $('#delayed-progressbars .progress-bar').progressbar({
                transition_delay: 3000
            });
            $('#percentage-format .progress-bar').progressbar({
                display_text: 'center',
                percent_format: function(p) {return p + ' percent';}
            });
            $('#amount-format .progress-bar').progressbar({
                display_text: 'center',
                use_percentage: false,
                amount_format: function(p, t) {return p + ' of ' + t;}
            });
            $('#filled-text .progress-bar').progressbar({
                display_text: 'fill'
            });
            $('#filled-text-nonpercentage .progress-bar').progressbar({
                display_text: 'fill',
                use_percentage: false
            });
            $('#center-text .progress-bar').progressbar({
                display_text: 'center'
            });
            $('#center-text-nonpercentage .progress-bar').progressbar({
                display_text: 'center',
                use_percentage: false
            });
            $('#vertical-center-text .progress-bar').progressbar({
                display_text: 'center'
            });
            $('#vertical-center-text-nonpercentage .progress-bar').progressbar({
                display_text: 'center',
                use_percentage: false
            });
            $('#vertical-filled-text .progress-bar').progressbar({
                display_text: 'fill'
            });
            $('#vertical-filled-text-nonpercentage .progress-bar').progressbar({
                display_text: 'fill',
                use_percentage: false
            });
        }, 100);
        setTimeout(function(){
            $('.progress-bar').progressbar();
        }, 150);
    };
});