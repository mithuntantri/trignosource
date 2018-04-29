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

          $scope.editChapter = function(index){
            $scope.changeMenu('editchapters')
            Videos.create_chapter.subject_number = Videos.all_tutorials[$scope.currentSubject].subject_number
            Videos.create_chapter.old_chapter_number = parseInt(Videos.all_tutorials[$scope.currentSubject].chapters[index].chapter_number)
            Videos.create_chapter.chapter_number = parseInt(Videos.all_tutorials[$scope.currentSubject].chapters[index].chapter_number)
            Videos.create_chapter.chapter_name = Videos.all_tutorials[$scope.currentSubject].chapters[index].chapter_name
            Videos.create_chapter.mop_number = Videos.all_tutorials[$scope.currentSubject].chapters[index].mop_number
            Videos.create_chapter.mop_name = Videos.all_tutorials[$scope.currentSubject].chapters[index].mop_name
            Videos.create_chapter.is_module = Videos.all_tutorials[$scope.currentSubject].chapters[index].is_module
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
          document.getElementById('addchapters').style.display = 'block'

          $scope.changeMenu = function(id){
            resetSideMenu()
            document.getElementById(id).style.display = 'block'
          }
}]);
