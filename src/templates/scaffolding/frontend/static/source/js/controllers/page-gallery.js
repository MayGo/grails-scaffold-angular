App.controller('PageGalleryController', function ($scope, $routeParams){
    $scope.update_gallery = function(){
        $('.mix-grid').mixItUp();
    };
});