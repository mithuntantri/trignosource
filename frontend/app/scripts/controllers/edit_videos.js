'use strict';

angular.module('trignosourceApp')
    .controller('editVideosCtrl', [ '$scope', 'Videos',
        function ($scope, Videos) {
          $scope.Videos = Videos
}]);
