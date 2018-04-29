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


          $scope.editVideo = function(index){
            $scope.changeMenu('editvideos')
            Videos.create_video.subject_number = Videos.all_tutorials[$scope.currentSubject].subject_number
            Videos.create_video.chapter_number = parseInt(Videos.all_tutorials[$scope.currentSubject].chapters[$scope.currentChapter].chapter_number)
            Videos.create_video.video_number = Videos.all_tutorials[$scope.currentSubject].chapters[$scope.currentChapter].videos[index].video_number
            Videos.create_video.old_video_number = Videos.all_tutorials[$scope.currentSubject].chapters[$scope.currentChapter].videos[index].video_number
            Videos.create_video.video_name = Videos.all_tutorials[$scope.currentSubject].chapters[$scope.currentChapter].videos[index].video_name
            Videos.create_video.thumbnail_time = Videos.all_tutorials[$scope.currentSubject].chapters[$scope.currentChapter].videos[index].thumbnail_time
            Videos.create_video.file_name = Videos.all_tutorials[$scope.currentSubject].chapters[$scope.currentChapter].videos[index].file_name
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
          document.getElementById('addvideos').style.display = 'block'

          $scope.changeMenu = function(id){
            resetSideMenu()
            document.getElementById(id).style.display = 'block'
          }
}]);
