'use strict';

angular.module('trignosourceApp')
    .controller('AllQuestionsCtrl', [ '$scope', '$state', '$rootScope', 'Videos', 'Toast', '$timeout',
        function ($scope, $state, $rootScope, Videos, Toast, $timeout) {
          $scope.Videos = Videos
          localStorage.activeTab = 'questions'
          $rootScope.activeTab = localStorage.activeTab
          Videos.sortTutorials()

          $scope.currentSubject = null
          Videos.create_question.subject_number = null
          if(localStorage.currentSubject){
            $scope.currentSubject = localStorage.currentSubject
            Videos.create_question.subject_number = Videos.all_tutorials[$scope.currentSubject].subject_number
          }

          $scope.currentChapter = null
          Videos.create_question.chapter_number = null
          if(localStorage.currentChapter){
            $scope.currentChapter = localStorage.currentChapter
            Videos.create_question.chapter_number = Videos.all_tutorials[$scope.currentSubject].chapters[$scope.currentChapter].chapter_number
          }

          $scope.currentVideo = null
          Videos.create_question.video_number = null
          if(localStorage.currentVideo){
            $scope.currentVideo = localStorage.currentVideo
            Videos.create_question.video_number = Videos.all_tutorials[$scope.currentSubject].chapters[$scope.currentChapter].videos[$scope.currentVideo].video_number
          }

          Videos.create_option.question_number = null

          localStorage.removeItem('currentQuestion')
          
          $scope.gotoOptions = function(index){
            localStorage.currentQuestion = index
            $state.go('dashboard.options')
          }

          $scope.deleteQuestion = function(index){
            Videos.deleteQuestion($scope.currentSubject, $scope.currentChapter, $scope.currentVideo, index).then((response)=>{
              if(response.data.status){
                $timeout(function () {
                  Videos.all_tutorials = response.data.data
                  Videos.sortTutorials()
                });
                Toast.showSuccess('Question deleted successfully')
              }else{
                Toast.showError(response.data.message)
              }
            })
          }

          $scope.editQuestion = function(index){
            $scope.changeMenu('editquestions')
            Videos.create_question.subject_number = Videos.all_tutorials[$scope.currentSubject].subject_number
            Videos.create_question.chapter_number = parseInt(Videos.all_tutorials[$scope.currentSubject].chapters[$scope.currentChapter].chapter_number)
            Videos.create_question.video_number = Videos.all_tutorials[$scope.currentSubject].chapters[$scope.currentChapter].videos[$scope.currentVideo].video_number
            Videos.create_question.old_question_number = Videos.all_tutorials[$scope.currentSubject].chapters[$scope.currentChapter].videos[$scope.currentVideo].questions[index].question_number
            Videos.create_question.question_number = Videos.all_tutorials[$scope.currentSubject].chapters[$scope.currentChapter].videos[$scope.currentVideo].questions[index].question_number
            Videos.create_question.question_name = Videos.all_tutorials[$scope.currentSubject].chapters[$scope.currentChapter].videos[$scope.currentVideo].questions[index].question_name
            Videos.create_question.time_of_pause = Videos.all_tutorials[$scope.currentSubject].chapters[$scope.currentChapter].videos[$scope.currentVideo].questions[index].time_of_pause
            Videos.create_question.appear_time = Videos.all_tutorials[$scope.currentSubject].chapters[$scope.currentChapter].videos[$scope.currentVideo].questions[index].appear_time
          }

          function resetSideMenu(){
            document.getElementById('addtutorials').style.display = 'none'
            document.getElementById('edittutorials').style.display = 'none'
            document.getElementById('addchapters').style.display = 'none'
            document.getElementById('editchapters').style.display = 'none'
            document.getElementById('addvideos').style.display = 'none'
            document.getElementById('editvideos').style.display = 'none'
            document.getElementById('addquestions').style.display = 'none'
            document.getElementById('editquestions').style.display = 'none'
            document.getElementById('addoptions').style.display = 'none'
            document.getElementById('editoptions').style.display = 'none'
          }

          resetSideMenu()
          document.getElementById('addquestions').style.display = 'block'

          $scope.changeMenu = function(id){
            resetSideMenu()
            document.getElementById(id).style.display = 'block'
          }
}]);
