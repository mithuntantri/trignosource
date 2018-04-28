'use strict';

angular.module('trignosourceApp')
    .controller('AllVideosCtrl', [ '$scope', '$state', '$rootScope', 'Videos', 'Toast', '$timeout',
        function ($scope, $state, $rootScope, Videos, Toast, $timeout) {
          $scope.Videos = Videos
          localStorage.activeTab = 'videos'
          $rootScope.activeTab = localStorage.activeTab
          Videos.sortTutorials()

          $scope.currentSubject = null
          Videos.create_video.subject_number = null
          if(localStorage.currentSubject){
            $scope.currentSubject = localStorage.currentSubject
            Videos.create_video.subject_number = Videos.all_tutorials[$scope.currentSubject].subject_number
          }

          $scope.currentChapter = null
          Videos.create_video.chapter_number = null
          if(localStorage.currentChapter){
            $scope.currentChapter = localStorage.currentChapter
            Videos.create_video.chapter_number = Videos.all_tutorials[$scope.currentSubject].chapters[$scope.currentChapter].chapter_number
          }
          
          Videos.create_question.video_number = null
          Videos.create_option.video_number = null

          localStorage.removeItem('currentVideo')
          localStorage.removeItem('currentQuestion')

          $scope.gotoQuestions = function(index){
            localStorage.currentVideo = index
            $state.go('dashboard.questions')
          }

          $scope.deleteVideo = function(index){
            Videos.deleteVideo($scope.currentSubject, $scope.currentChapter, index).then((response)=>{
              if(response.data.status){
                $timeout(function () {
                  Videos.all_tutorials = response.data.data
                  Videos.sortTutorials()
                });
                Toast.showSuccess('Video deleted successfully')
              }else{
                Toast.showError(response.data.message)
              }
            })
          }
}]);
