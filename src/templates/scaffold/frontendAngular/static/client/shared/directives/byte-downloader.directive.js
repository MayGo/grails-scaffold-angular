'use strict';

angular.module('angularDemoApp').directive('byteDownloader', function () {
  return {
    restrict: 'A',
    scope: {
      ngModel: '='
    },
    templateUrl: 'shared/blocks/byte-downloader.html',
    controller: function ($scope, $sce) {
      var download = function (chars, filename, contentType) {
        var s = "";
        for (var i = 0, l = chars.length; i < l; i++)
          s += String.fromCharCode(chars[i]);
        if (!contentType){
          contentType = 'application/octet-stream';
        }
        var a = document.createElement('a');
        var blob = new Blob([s], {'type': contentType});
        a.href = window.URL.createObjectURL(blob);
        a.download = filename;
        a.click();
      }

      $scope.downloadFile = function () {
        download($scope.ngModel, 'myfile.txt')
      }
      if ($scope.ngModel) {
        console.log($scope.ngModel);
      }
    }
  };
});
