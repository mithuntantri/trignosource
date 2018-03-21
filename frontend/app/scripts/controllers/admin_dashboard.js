'use strict';

angular.module('trignosourceApp')
    .controller('AdminDashboardCtrl',
        [ '$scope','$state', '$rootScope', 'Login', 'Videos', 'Toast',
        function ($scope, $state, $rootScope, Login, Videos, Toast) {

        if(localStorage.activeTab){
          $state.go('dashboard.'+localStorage.activeTab)
          $rootScope.activeTab = localStorage.activeTab
        }else{
          localStorage.activeTab = 'tutorials'
          $state.go('dashboard.'+localStorage.activeTab)
          $rootScope.activeTab = localStorage.activeTab
        }

        $scope.Videos = Videos
        $scope.adminLogout = ()=>{
          Login.adminLogout().then((response)=>{
            if(response.data.status){
              localStorage.removeItem('token')
              $state.go('login')
            }else{
              Toast.showError(response.data.message)
            }
          })
        }

        $scope.createTutorial = function(){
          if(Videos.create_tutorial.subject_number && Videos.create_tutorial.subject_name){
            Videos.createTutorial().then((response)=>{
              Videos.create_tutorial = {
                'subject_number' : null,
                'subject_name' : null
              }
              if(response.data.status){
                Videos.all_tutorials = response.data.data
                Toast.showSuccess('Tutorial created successfully')
              }else{
                Toast.showError(response.data.message)
              }
            })
          }else{
            Toast.showError('Invalid Input')
          }
        }

        $scope.createChapter = function(){
          if(Videos.create_chapter.chapter_number && Videos.create_chapter.chapter_name){
            Videos.createChapter().then((response)=>{
              Videos.create_chapter.chapter_number = null
              Videos.create_chapter.chapter_name = null
              if(response.data.status){
                Videos.all_tutorials = response.data.data
                Toast.showSuccess('Chapter created successfully')
              }else{
                Toast.showError(response.data.message)
              }
            })
          }else{
            Toast.showError('Invalid Input')
          }
        }


        $scope.createQuestion = function(){
          if(Videos.create_question.question_number && Videos.create_question.question_name && Videos.create_question.time_of_pause && Videos.create_question.appear_time){
            Videos.createQuestion().then((response)=>{
              Videos.create_question.question_number = null
              Videos.create_question.question_name = null
              Videos.create_question.time_of_pause = null
              Videos.create_question.appear_time = null
              if(response.data.status){
                Videos.all_tutorials = response.data.data
                Toast.showSuccess('Question created successfully')
              }else{
                Toast.showError(response.data.message)
              }
            })
          }else{
            Toast.showError('Invalid Input')
          }
        }

        $scope.createOption = function(){
          if(Videos.create_option.option_number && Videos.create_option.option_name && Videos.create_option.skip_time){
            Videos.createOption().then((response)=>{
              Videos.create_option.option_number = null
              Videos.create_option.option_name = null
              Videos.create_option.skip_time = null
              if(response.data.status){
                Videos.all_tutorials = response.data.data
                Toast.showSuccess('Option created successfully')
              }else{
                Toast.showError(response.data.message)
              }
            })
          }else{
            Toast.showError('Invalid Input')
          }
        }

        function resetSideMenu(){
          document.getElementById('addtutorials').style.display = 'none'
          document.getElementById('addchapters').style.display = 'none'
          document.getElementById('addvideos').style.display = 'none'
          document.getElementById('addquestions').style.display = 'none'
          document.getElementById('addoptions').style.display = 'none'
        }

        resetSideMenu()
        document.getElementById('addtutorials').style.display = 'block'

        $scope.changeMenu = function(id){
          resetSideMenu()
          document.getElementById(id).style.display = 'block'
        }
}]);
