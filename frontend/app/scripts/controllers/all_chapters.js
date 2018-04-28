'use strict';

angular.module('trignosourceApp')
    .controller('AllChaptersCtrl', [ '$scope', '$rootScope', '$state', 'Videos', 'Toast',
        function ($scope, $rootScope, $state, Videos, Toast) {
          $scope.Videos = Videos
          localStorage.activeTab = 'chapters'
          $rootScope.activeTab = localStorage.activeTab
          Videos.sortTutorials()

          $scope.currentSubject = null
          Videos.create_chapter.subject_number = null
          if(localStorage.currentSubject){
            $scope.currentSubject = localStorage.currentSubject     
            Videos.create_chapter.subject_number = Videos.all_tutorials[$scope.currentSubject].subject_number
          }
          
          Videos.create_video.subject_number = null
          Videos.create_video.chapter_number = null
          Videos.create_question.chapter_number = null
          Videos.create_option.chapter_number = null

          localStorage.removeItem('currentChapter')
          localStorage.removeItem('currentVideo')
          localStorage.removeItem('currentQuestion')

          $scope.gotoVideos = function(index){
            localStorage.currentChapter = index
            $state.go('dashboard.videos')
          }

          $scope.deleteChapter = function(index){
            Videos.deleteChapter($scope.currentSubject, index).then((response)=>{
              if(response.data.status){
                Videos.all_tutorials = response.data.data
                Videos.sortTutorials()
                Toast.showSuccess('Chapter deleted successfully')
              }else{
                Toast.showError(response.data.message)
              }
            })
          }
}]);
