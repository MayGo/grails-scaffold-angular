'use strict';

angular.module('angularDemoApp').directive('uploaderWidget', function () {
  return {
    restrict: 'A',
    scope: {
      name: '@',
      uploadOnlyOne: '=?',
      bytesModel: '=?',
      uploadedItemsToModel: '=?'
    },
    templateUrl: function (elem, attrs) {
      var tmpl;
      if (attrs.uploadOnlyOne || attrs.bytesModel) {
        tmpl = 'shared/blocks/uploader-one.html'
      } else {
        tmpl = 'shared/blocks/uploader-multiple.html'
      }
      return tmpl
    },
    controller: function ($scope, $state, FileUploader, appConfig) {
      var urlParams = '';
      if ($scope.bytesModel) {
        $scope.uploadOnlyOne = true;
        urlParams = 'sendBytesBack=true';
      }
      var uploader = $scope.uploader = new FileUploader({
        url: appConfig.restUrl + '/upload?' + urlParams,
        autoUpload: true
      });
      if ($scope.uploadOnlyOne) {
        uploader.onAfterAddingFile = function (item) {
          if (uploader.queue.length == 2) {
            uploader.removeFromQueue(0);
          }
        }
      }

      uploader.onCompleteItem = function (fileItem, response, status, headers) {
        console.info('onCompleteItem', fileItem, response, status, headers);

        if (fileItem.isSuccess) {
          var fileData = fileItem.file;
          fileData.realFileName = response.realFileName;

          if ($scope.uploadOnlyOne) {
            $scope.uploadedItemsToModel = fileData;
            if ($scope.bytesModel) {
              $scope.bytesModel = response.fileAsBytes;
            }
          } else {
            if (!$scope.uploadedItemsToModel) {
              $scope.uploadedItemsToModel = [];
            }

            $scope.uploadedItemsToModel.push(fileData);
          }
        }
      };
      uploader.onCompleteAll = function () {
        console.info('onCompleteAll');
      };
    }
  };
});
