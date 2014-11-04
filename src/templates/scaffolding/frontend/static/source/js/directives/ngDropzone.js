App.directive("ngDropzone", function($parse, $compile){
    return {
        link: function($scope, element, attributes){
            $(attributes.$$element).dropzone({
                url: "http://www.torrentplease.com/dropzone.php",
                maxFilesize: 100,
                paramName: "uploadfile",
                maxThumbnailFilesize: 5,
                init: function() {
                    //$scope.files.push({file: 'added'}); // here works
                    this.on('success', function(file, json) {
                    });

                    this.on('addedfile', function(file) {
                        $scope.$apply(function(){
                            //alert(file);
                            //$scope.files.push({file: 'added'});
                        });
                    });

                    this.on('drop', function(file) {
                        //alert('file');
                    });

                }

            });
        }
    };
});
