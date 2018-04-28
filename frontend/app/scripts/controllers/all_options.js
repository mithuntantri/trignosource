'use strict';

angular.module('trignosourceApp')
    .controller('AllOptionsCtrl', [ '$scope', '$rootScope', 'Videos', 'Toast', '$timeout',
        function ($scope, $rootScope, Videos, Toast, $timeout) {
          $scope.Videos = Videos
          localStorage.activeTab = 'options'
          $rootScope.activeTab = localStorage.activeTab
          Videos.sortTutorials()

          $scope.currentSubject = null
          Videos.create_option.subject_number = null
          if(localStorage.currentSubject){
            $scope.currentSubject = localStorage.currentSubject
            Videos.create_option.subject_number = Videos.all_tutorials[$scope.currentSubject].subject_number
          }

          $scope.currentChapter = null
          Videos.create_option.chapter_number = null
          if(localStorage.currentChapter){
            $scope.currentChapter = localStorage.currentChapter
            Videos.create_option.chapter_number = Videos.all_tutorials[$scope.currentSubject].chapters[$scope.currentChapter].chapter_number
          }
          
          $scope.currentVideo = null
          Videos.create_option.video_number = null
          if(localStorage.currentVideo){
            $scope.currentVideo = localStorage.currentVideo
            Videos.create_option.video_number = Videos.all_tutorials[$scope.currentSubject].chapters[$scope.currentChapter].videos[$scope.currentVideo].video_number
          }

          $scope.currentQuestion = null
          Videos.create_option.question_number = null
          if(localStorage.currentQuestion){
            $scope.currentQuestion = localStorage.currentQuestion
            Videos.create_option.question_number = Videos.all_tutorials[$scope.currentSubject].chapters[$scope.currentChapter].videos[$scope.currentVideo].questions[$scope.currentQuestion].question_number
          }

          $scope.deleteOption = function(index){
            Videos.deleteOption($scope.currentSubject, $scope.currentChapter, $scope.currentVideo, $scope.currentQuestion, index).then((response)=>{
              if(response.data.status){
                $timeout(function () {
                  Videos.all_tutorials = response.data.data
                  Videos.sortTutorials()
                });
                Toast.showSuccess('Option deleted successfully')
              }else{
                Toast.showError(response.data.message)
              }
            })
          }
}]);
