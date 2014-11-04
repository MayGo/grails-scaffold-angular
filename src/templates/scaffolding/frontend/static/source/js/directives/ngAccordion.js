App.directive("ngAccordion", function($parse, $compile){
    return {
        link: function($scope, element, attributes){
            $scope._accordion = {status:[], collapse:{}};

            $scope._accordion.collapse = function(i){
                for(var j=0; j<$scope._accordion.status.length; j++){
                    if(i==j)
                        continue;
                    $scope._accordion.status[j] = true;
                }
                $scope._accordion.status[i] = !$scope._accordion.status[i];
            };

            $(">div", attributes.$$element).each(function(index, item){
                $scope._accordion.status[index] = true;
                $(">.panel-heading>a", item).attr({'ng-click': '_accordion.collapse('+index+')', 'index':index});
                $(">.panel-collapse", item).attr({'collapse': '_accordion.status['+index+']', 'index':index});
            });

            element.html($compile(element.html())($scope));
        }
    };
});