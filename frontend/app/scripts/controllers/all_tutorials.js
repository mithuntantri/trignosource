'use strict';

angular.module('trignosourceApp')
    .controller('AllTutorialsCtrl', [ '$scope', '$rootScope', '$state', 'Videos', 'Toast',
        function ($scope, $rootScope, $state, Videos, Toast) {
          $scope.Videos = Videos
          localStorage.activeTab = 'tutorials'
          $rootScope.activeTab = localStorage.activeTab

          Videos.create_chapter.subject_number = null
          Videos.create_video.subject_number = null
          Videos.create_question.subject_number = null
          Videos.create_option.subject_number = null

          $scope.gotoChapters = function(index){
            localStorage.currentSubject = index
            $state.go('dashboard.chapters')
          }

          $scope.deleteTutorial = function(index){
            Videos.deleteTutorial(index).then((response)=>{
              if(response.data.status){
                Videos.all_tutorials = response.data.data
                Toast.showSuccess('Tutorial deleted successfully')
              }else{
                Toast.showError(response.data.message)
              }
            })
          }
}]);
