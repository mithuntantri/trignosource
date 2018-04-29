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

        $scope.editTutorial = function(){
          if(Videos.create_tutorial.subject_number && Videos.create_tutorial.subject_name){
            var tutorial_numbers = _.pluck(Videos.all_tutorials, 'subject_number')
            if((Videos.create_tutorial.subject_number != Videos.create_tutorial.old_subject_number)
              && tutorial_numbers.includes(Videos.create_tutorial.subject_number)){
                Toast.showError('Tutorial Number already exists')
            }else{
              Videos.show_loader = true
              Videos.editTutorial().then((response)=>{
                Videos.create_tutorial = _.omit(Videos.create_tutorial, 'old_subject_number')
                Videos.create_tutorial = {
                  'subject_number' : null,
                  'subject_name' : null
                }
                if(response.data.status){
                  Videos.all_tutorials = _.sortBy(response.data.data, 'subject_number')
                  Videos.sortTutorials()
                  Toast.showSuccess('Tutorial modified successfully')
                }else{
                  Toast.showError(response.data.message)
                }
                Videos.show_loader = false
                $scope.changeMenu('addtutorials')
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

        $scope.editChapter = function(){
          var currentSubject = parseInt(localStorage.getItem('currentSubject'))
          if(Videos.create_chapter.chapter_number && Videos.create_chapter.chapter_name){
            var chapter_numbers = _.pluck(Videos.all_tutorials[currentSubject].chapters, 'chapter_number')
            if((Videos.create_chapter.chapter_number != Videos.create_chapter.old_chapter_number)
              && chapter_numbers.includes(Videos.create_chapter.chapter_number)){
                Toast.showError('Chapter Number already exists')
            }else{
              Videos.show_loader = true
              Videos.editChapter().then((response)=>{
                Videos.create_chapter.chapter_number = null
                Videos.create_chapter.chapter_name = null
                Videos.create_chapter.mop_number = null
                Videos.create_chapter.mop_name = null
                if(response.data.status){
                  Videos.create_chapter = _.omit(Videos.create_chapter, 'old_chapter_number')
                  Videos.all_tutorials = _.sortBy(response.data.data, 'subject_number')
                  Videos.sortTutorials()
                  Toast.showSuccess('Chapter modified successfully')
                }else{
                  Toast.showError(response.data.message)
                }
                Videos.show_loader = false
                $scope.changeMenu('addchapters')
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

        $scope.editQuestion = function(){
          var currentSubject = parseInt(localStorage.getItem('currentSubject'))
          var currentChapter = parseInt(localStorage.getItem('currentChapter'))
          var currentVideo = parseInt(localStorage.getItem('currentVideo'))
          if(Videos.create_question.question_number && Videos.create_question.question_name && Videos.create_question.time_of_pause && Videos.create_question.appear_time){
            var question_numbers = _.pluck(Videos.all_tutorials[currentSubject].chapters[currentChapter].videos[currentVideo].questions, 'question_number')
            console.log(question_numbers, Videos.create_question)
            Videos.create_question.question_number = parseInt(Videos.create_question.question_number)
            if((Videos.create_question.question_number != Videos.create_question.old_question_number) 
              && question_numbers.includes(parseInt(Videos.create_question.question_number))){
              Toast.showError('Question Number already exists')
            }else if(Videos.create_question.time_of_pause < Videos.create_question.appear_time){
               Toast.showError('Pause time cannot be before appear time')
            }else{
              Videos.show_loader = true
              Videos.editQuestion().then((response)=>{
                Videos.create_question = _.omit(Videos.create_question, 'old_question_number')
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
                $scope.changeMenu('addquestions')
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

        $scope.editOption = function(){
          var currentSubject = parseInt(localStorage.getItem('currentSubject'))
          var currentChapter = parseInt(localStorage.getItem('currentChapter'))
          var currentVideo = parseInt(localStorage.getItem('currentVideo'))
          var currentQuestion = parseInt(localStorage.getItem('currentQuestion'))
          if(Videos.create_option.option_number && Videos.create_option.option_name && Videos.create_option.skip_time){
            var option_numbers = _.pluck(Videos.all_tutorials[currentSubject].chapters[currentChapter].videos[currentVideo].questions[currentQuestion].options, 'option_number')
            Videos.create_option.option_number = parseInt(Videos.create_option.option_number)
            if((Videos.create_option.option_number != Videos.create_option.old_option_number) 
              && option_numbers.includes(Videos.create_option.option_number)){
              Toast.showError('Option number already exists')
            }else{
              var pause_times = _.pluck(Videos.all_tutorials[currentSubject].chapters[currentChapter].videos[currentVideo].questions, 'time_of_pause')
              if(pause_times.includes(Videos.create_option.skip_time)){
                Toast.showError('Skip time conflicts with a pause time of a question! Please check')
              }else{
                Videos.show_loader = true
                Videos.editOption().then((response)=>{
                  Videos.create_option = _.omit(Videos.create_option, 'old_option_number')
                  Videos.create_option.option_number = null
                  Videos.create_option.option_name = null
                  Videos.create_option.skip_time = null
                  if(response.data.status){
                    Videos.all_tutorials = response.data.data
                    Videos.sortTutorials()
                    Toast.showSuccess('Option modified successfully')
                  }else{
                    Toast.showError(response.data.message)
                  }
                  Videos.show_loader = false
                  $scope.changeMenu('addoptions')
                })
              }
            }
          }else{
            Toast.showError('Invalid Input')
          }
        }

        $scope.editVideo = function(){
          var currentSubject = parseInt(localStorage.getItem('currentSubject'))
          var currentChapter = parseInt(localStorage.getItem('currentChapter'))
          if(Videos.create_video.video_number && Videos.create_video.video_name && Videos.create_video.thumbnail_time){
            var video_numbers = _.pluck(Videos.all_tutorials[currentSubject].chapters[currentChapter].videos, 'video_number')
            Videos.create_video.video_number = parseInt(Videos.create_video.video_number)
            if((Videos.create_video.video_number != Videos.create_video.old_video_number) 
              && video_numbers.includes(Videos.create_video.video_number)){
              Toast.showError('Video number already exists')
            }else{
              if(!Videos.checkThumbnailTime()){
                Toast.showError('Invalid Thumnail Time')
              }else{
                Videos.show_loader = true
                Videos.editVideo().then((response)=>{
                  Videos.create_video = _.omit(Videos.create_video, 'old_video_number')
                  Videos.create_video = _.omit(Videos.create_video, 'file_name')
                  Videos.create_video.video_number = null
                  Videos.create_video.video_name = null
                  Videos.create_video.thumnail_url = null
                  if(response.data.status){
                    Videos.all_tutorials = response.data.data
                    Videos.sortTutorials()
                    Toast.showSuccess('Video modified successfully')
                  }else{
                    Toast.showError(response.data.message)
                  }
                  Videos.show_loader = false
                  $scope.changeMenu('addvideos')
                })
              }
            }
          }else{
            Toast.showError('Invalid Input')
          }
        }

        $scope.convertVideo = function(index){
          var currentSubject = parseInt(localStorage.getItem('currentSubject'))
          var currentChapter = parseInt(localStorage.getItem('currentChapter'))
          var file_name = Videos.all_tutorials[currentSubject].chapters[currentChapter].videos[index].file_name
          Videos.convertVideo(file_name).then((response)=>{
            if(response.data.status){
              Toast.showSuccess('Video conversion started successfully! Please check after 10-15 minutes')
            }else{
              Toast.showError(response.data.message)
            }
          }).catch((err)=>{
            Toast.showError(err.message)
          })
        }

        function resetSideMenu(){
            document.getElementById('addtutorials').style.display = 'none'
            document.getElementById('edittutorials').style.display = 'none'
            document.getElementById('addchapters').style.display = 'none'
            document.getElementById('editchapters').style.display = 'none'
            document.getElementById('addvideos').style.display = 'none'
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
