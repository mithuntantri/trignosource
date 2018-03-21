'use strict';

angular.module('trignosourceApp')
    .controller('addVideosCtrl', [ '$scope', 'Videos',
        function ($scope, Videos) {
          $scope.Videos = Videos
}]);
