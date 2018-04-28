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
            var tutorial_numbers = _.pluck(Videos.all_tutorials, 'subject_number')
            if(tutorial_numbers.includes(Videos.create_tutorial.subject_number)){
                Toast.showError('Tutorial Number already exists')
            }else{
              Videos.show_loader = true
              Videos.createTutorial().then((response)=>{
                Videos.create_tutorial = {
                  'subject_number' : null,
                  'subject_name' : null
                }
                if(response.data.status){
                  Videos.all_tutorials = _.sortBy(response.data.data, 'subject_number')
                  Videos.sortTutorials()
                  Toast.showSuccess('Tutorial created successfully')
                }else{
                  Toast.showError(response.data.message)
                }
                Videos.show_loader = false
              })
            }
          }else{
            Toast.showError('Invalid Input')
          }
        }

        $scope.createChapter = function(){
          var currentSubject = parseInt(localStorage.getItem('currentSubject'))
          if(Videos.create_chapter.chapter_number && Videos.create_chapter.chapter_name){
            var chapter_numbers = _.pluck(Videos.all_tutorials[currentSubject].chapters, 'chapter_number')
            if(chapter_numbers.includes(Videos.create_chapter.chapter_number)){
                Toast.showError('Chapter Number already exists')
            }else{
              Videos.show_loader = true
              Videos.createChapter().then((response)=>{
                Videos.create_chapter.chapter_number = null
                Videos.create_chapter.chapter_name = null
                Videos.create_chapter.mop_number = null
                Videos.create_chapter.mop_name = null
                if(response.data.status){
                  Videos.all_tutorials = _.sortBy(response.data.data, 'subject_number')
                  Videos.sortTutorials()
                  Toast.showSuccess('Chapter created successfully')
                }else{
                  Toast.showError(response.data.message)
                }
                Videos.show_loader = false
              })
            }
          }else{
            Toast.showError('Invalid Input')
          }
        }


        $scope.createQuestion = function(){
          var currentSubject = parseInt(localStorage.getItem('currentSubject'))
          var currentChapter = parseInt(localStorage.getItem('currentChapter'))
          var currentVideo = parseInt(localStorage.getItem('currentVideo'))
          if(Videos.create_question.question_number && Videos.create_question.question_name && Videos.create_question.time_of_pause && Videos.create_question.appear_time){
            var question_numbers = _.pluck(Videos.all_tutorials[currentSubject].chapters[currentChapter].videos[currentVideo].questions, 'question_number')
            console.log(question_numbers, Videos.create_question)
            Videos.create_question.question_number = parseInt(Videos.create_question.question_number)
            if(question_numbers.includes(parseInt(Videos.create_question.question_number))){
              Toast.showError('Question Number already exists')
            }else if(Videos.create_question.time_of_pause < Videos.create_question.appear_time){
               Toast.showError('Pause time cannot be before appear time')
            }else{
              Videos.show_loader = true
              Videos.createQuestion().then((response)=>{
                Videos.create_question.question_number = null
                Videos.create_question.question_name = null
                Videos.create_question.time_of_pause = null
                Videos.create_question.appear_time = null
                if(response.data.status){
                  Videos.all_tutorials = response.data.data
                  Videos.sortTutorials()
                  Toast.showSuccess('Question created successfully')
                }else{
                  Toast.showError(response.data.message)
                }
                Videos.show_loader = false
              })
            }
          }else{
            Toast.showError('Invalid Input')
          }
        }

        $scope.createOption = function(){
          var currentSubject = parseInt(localStorage.getItem('currentSubject'))
          var currentChapter = parseInt(localStorage.getItem('currentChapter'))
          var currentVideo = parseInt(localStorage.getItem('currentVideo'))
          var currentQuestion = parseInt(localStorage.getItem('currentQuestion'))
          if(Videos.create_option.option_number && Videos.create_option.option_name && Videos.create_option.skip_time){
            var option_numbers = _.pluck(Videos.all_tutorials[currentSubject].chapters[currentChapter].videos[currentVideo].questions[currentQuestion].options, 'option_number')
            Videos.create_option.option_number = parseInt(Videos.create_option.option_number)
            if(option_numbers.includes(Videos.create_option.option_number)){
              Toast.showError('Option number already exists')
            }else{
              var pause_times = _.pluck(Videos.all_tutorials[currentSubject].chapters[currentChapter].videos[currentVideo].questions, 'time_of_pause')
              if(pause_times.includes(Videos.create_option.skip_time)){
                Toast.showError('Skip time conflicts with a pause time of a question! Please check')
              }else{
                Videos.show_loader = true
                Videos.createOption().then((response)=>{
                  Videos.create_option.option_number = null
                  Videos.create_option.option_name = null
                  Videos.create_option.skip_time = null
                  if(response.data.status){
                    Videos.all_tutorials = response.data.data
                    Videos.sortTutorials()
                    Toast.showSuccess('Option created successfully')
                  }else{
                    Toast.showError(response.data.message)
                  }
                  Videos.show_loader = false
                })
              }
            }
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
