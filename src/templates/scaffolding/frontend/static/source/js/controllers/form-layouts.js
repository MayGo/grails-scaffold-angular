App.controller('FormLayoutsController', function ($scope, $routeParams){
    $.fn.Data.checkbox();
    $("ul.nav-tabs a").click(function(e){
		e.preventDefault();
	});
});