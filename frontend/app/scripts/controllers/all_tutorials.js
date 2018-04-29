'use strict';

angular.module('trignosourceApp')
    .controller('AllTutorialsCtrl', [ '$scope', '$rootScope', '$state', 'Videos', 'Toast',
        function ($scope, $rootScope, $state, Videos, Toast) {
          $scope.Videos = Videos
          localStorage.activeTab = 'tutorials'
          $rootScope.activeTab = localStorage.activeTab
          Videos.sortTutorials()

          Videos.create_chapter.subject_number = null
          Videos.create_video.subject_number = null
          Videos.create_question.subject_number = null
          Videos.create_option.subject_number = null

          localStorage.removeItem('currentSubject')
          localStorage.removeItem('currentChapter')
          localStorage.removeItem('currentVideo')
          localStorage.removeItem('currentQuestion')

          $scope.gotoChapters = function(index){
            localStorage.currentSubject = index
            $state.go('dashboard.chapters')
          }

          $scope.deleteTutorial = function(index){
            Videos.deleteTutorial(index).then((response)=>{
              if(response.data.status){
                Videos.all_tutorials = response.data.data
                Videos.sortTutorials()
                Toast.showSuccess('Tutorial deleted successfully')
              }else{
                Toast.showError(response.data.message)
              }
            })
          }

          $scope.editTutorial = function(index){
            $scope.changeMenu('edittutorials')
            Videos.create_tutorial.old_subject_number = Videos.all_tutorials[index].subject_number
            Videos.create_tutorial.subject_number = Videos.all_tutorials[index].subject_number
            Videos.create_tutorial.subject_name = Videos.all_tutorials[index].subject_name
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
          document.getElementById('addtutorials').style.display = 'block'

          $scope.changeMenu = function(id){
            resetSideMenu()
            document.getElementById(id).style.display = 'block'
          }
}]);
