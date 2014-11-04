App.directive("ngTab", function($parse, $compile){
    return {
        link: function($scope, element, attributes){
            $("a", element).click(function(e){
                e.preventDefault();
            });
        }
    };
});