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

          $scope.editOption = function(index){
            $scope.changeMenu('editoptions')
            Videos.create_option.subject_number = Videos.all_tutorials[$scope.currentSubject].subject_number
            Videos.create_option.chapter_number = parseInt(Videos.all_tutorials[$scope.currentSubject].chapters[$scope.currentChapter].chapter_number)
            Videos.create_option.video_number = Videos.all_tutorials[$scope.currentSubject].chapters[$scope.currentChapter].videos[$scope.currentVideo].video_number
            Videos.create_option.question_number = Videos.all_tutorials[$scope.currentSubject].chapters[$scope.currentChapter].videos[$scope.currentVideo].questions[$scope.currentQuestion].question_number
            Videos.create_option.old_option_number = Videos.all_tutorials[$scope.currentSubject].chapters[$scope.currentChapter].videos[$scope.currentVideo].questions[$scope.currentQuestion].options[index].option_number
            Videos.create_option.option_number = Videos.all_tutorials[$scope.currentSubject].chapters[$scope.currentChapter].videos[$scope.currentVideo].questions[$scope.currentQuestion].options[index].option_number
            Videos.create_option.option_name = Videos.all_tutorials[$scope.currentSubject].chapters[$scope.currentChapter].videos[$scope.currentVideo].questions[$scope.currentQuestion].options[index].option_name
            Videos.create_option.skip_time = Videos.all_tutorials[$scope.currentSubject].chapters[$scope.currentChapter].videos[$scope.currentVideo].questions[$scope.currentQuestion].options[index].skip_time
            Videos.create_option.is_correct = Videos.all_tutorials[$scope.currentSubject].chapters[$scope.currentChapter].videos[$scope.currentVideo].questions[$scope.currentQuestion].options[index].is_correct.toString()
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
          document.getElementById('addoptions').style.display = 'block'

          $scope.changeMenu = function(id){
            resetSideMenu()
            document.getElementById(id).style.display = 'block'
          }

}]);
