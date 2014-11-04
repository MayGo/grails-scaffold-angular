App.controller('UiGeneralsController', function ($scope, $routeParams){
    var timeout = setTimeout(function () {
        var msg = '<p class="fa fa-lightbulb-o" style="font-size: 35px; float:left;margin-top: 10px;margin-right: 10px;"></p> Resize your web browser to see mobile & tablet tabs version';
        $.notific8(msg);
    }, 3000);
	
	$scope.loadInputGroupTab = function(){
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
	};
	
});