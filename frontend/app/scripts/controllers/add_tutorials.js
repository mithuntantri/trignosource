'use strict';

angular.module('trignosourceApp')
    .controller('AddTutorialCtrl', [ '$scope', '$rootScope', '$state', 'Videos',
        function ($scope, $rootScope, $state, Videos) {
          $scope.Videos = Videos
          localStorage.activeRightTab = 'tutorials'
          $rootScope.activeRightTab = localStorage.activeTab
}]);
