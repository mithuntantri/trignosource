'use strict';

angular.module('trignosourceApp')
    .controller('AllQuestionsCtrl', [ '$scope', '$state', '$rootScope', 'Videos', 'Toast', '$timeout',
        function ($scope, $state, $rootScope, Videos, Toast, $timeout) {
          $scope.Videos = Videos
          localStorage.activeTab = 'questions'
          $rootScope.activeTab = localStorage.activeTab

          $scope.currentSubject = localStorage.currentSubject
          $scope.currentChapter = localStorage.currentChapter
          $scope.currentVideo = localStorage.currentVideo

          Videos.create_question.subject_number = Videos.all_tutorials[$scope.currentSubject].subject_number
          Videos.create_question.chapter_number = Videos.all_tutorials[$scope.currentSubject].chapters[$scope.currentChapter].chapter_number
          Videos.create_question.video_number = Videos.all_tutorials[$scope.currentSubject].chapters[$scope.currentChapter].videos[$scope.currentVideo].video_number

          Videos.create_option.question_number = null

          $scope.gotoOptions = function(index){
            localStorage.currentQuestion = index
            $state.go('dashboard.options')
          }

          $scope.deleteQuestion = function(index){
            Videos.deleteQuestion($scope.currentSubject, $scope.currentChapter, $scope.currentVideo, index).then((response)=>{
              if(response.data.status){
                $timeout(function () {
                  Videos.all_tutorials = response.data.data
                });
                Toast.showSuccess('Question deleted successfully')
              }else{
                Toast.showError(response.data.message)
              }
            })
          }
}]);
