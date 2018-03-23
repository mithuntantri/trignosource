'use strict';

angular.module('trignosourceApp', [
    'ngMaterial',
    'ui.router'
  ])
  .config(['$stateProvider', '$urlRouterProvider', '$mdThemingProvider', '$httpProvider',
  function ($stateProvider, $urlRouterProvider, $mdThemingProvider, $httpProvider) {

    console.log("Start of Config")

    $mdThemingProvider.theme('success-toast');
    $mdThemingProvider.theme('error-toast');
    // $qProvider.errorOnUnhandledRejections(false);
    $httpProvider.interceptors.push('tokenInterceptor');

    $urlRouterProvider.otherwise("/dashboard");

    $stateProvider
      .state('login', {
        url : '/login',
        controller: 'AdminLoginCtrl',
        templateUrl : 'views/admin/login.html'
      })
      .state('dashboard', {
        url : '/dashboard',
        controller: 'AdminDashboardCtrl',
        templateUrl : 'views/admin/newDashboard.html',
        resolve: {
          checkToken : ['$q', function($q){
            let deferred = $q.defer()
            if(localStorage.getItem('token')){
              deferred.resolve()
            }else{
              deferred.reject('token_expired')
            }
            return deferred.promise
          }]
        }
      })
      .state('dashboard.tutorials' ,{
            url: '',
            controller: 'AllTutorialsCtrl',
            templateUrl: 'views/admin/all_tutorials.html'
      })
      .state('dashboard.chapters' ,{
            url: '',
            controller: 'AllChaptersCtrl',
            templateUrl: 'views/admin/all_chapters.html'
      })
      .state('dashboard.videos',{
            url: '',
            controller: 'AllVideosCtrl',
            templateUrl: 'views/admin/all_videos.html'
      })
      .state('dashboard.questions',{
            url: '',
            controller: 'AllQuestionsCtrl',
            templateUrl: 'views/admin/all_questions.html'
      })
      .state('dashboard.options',{
            url: '',
            controller: 'AllOptionsCtrl',
            templateUrl: 'views/admin/all_options.html'
      })
  }])

  .run(['$location','$rootScope','$state','$window',
    function ($location, $rootScope, $state, $window) {
      console.log("Inside Run")
      $rootScope.$on('token_expired', function () {
        $state.go('login');
      })
      $rootScope.$on('$stateChangeError', (event, toState, toParams, fromState, fromParams, error)=>{
        $state.go("login")
      })
  }])

'use strict';

angular.module('trignosourceApp')
    .controller('AdminLoginCtrl', [ '$scope', '$state', 'Login', 'Toast',
        function ($scope, $state, Login, Toast) {
          localStorage.removeItem('token')
          $scope.login = {
            username : '',
            password : ''
          }
          $scope.adminLogin = ()=>{
            Login.adminLogin($scope.login).then((response)=>{
              if(response.data.status){
                localStorage.setItem('token',response.data.data.token)
                $state.go('dashboard.tutorials')
              }else{
                Toast.showError(response.data.message)
              }
            })
          }
}]);

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

'use strict';

angular.module('trignosourceApp')
    .controller('addVideosCtrl', [ '$scope', 'Videos',
        function ($scope, Videos) {
          $scope.Videos = Videos
}]);

'use strict';

angular.module('trignosourceApp')
    .controller('editVideosCtrl', [ '$scope', 'Videos',
        function ($scope, Videos) {
          $scope.Videos = Videos
}]);

'use strict';

angular.module('trignosourceApp')
    .controller('AllTutorialsCtrl', [ '$scope', '$rootScope', '$state', 'Videos', 'Toast',
        function ($scope, $rootScope, $state, Videos, Toast) {
          $scope.Videos = Videos
          localStorage.activeTab = 'tutorials'
          $rootScope.activeTab = localStorage.activeTab

          Videos.create_chapter.subject_number = null
          Videos.create_video.subject_number = null
          Videos.create_question.subject_number = null
          Videos.create_option.subject_number = null

          $scope.gotoChapters = function(index){
            localStorage.currentSubject = index
            $state.go('dashboard.chapters')
          }

          $scope.deleteTutorial = function(index){
            Videos.deleteTutorial(index).then((response)=>{
              if(response.data.status){
                Videos.all_tutorials = response.data.data
                Toast.showSuccess('Tutorial deleted successfully')
              }else{
                Toast.showError(response.data.message)
              }
            })
          }
}]);

'use strict';

angular.module('trignosourceApp')
    .controller('AllChaptersCtrl', [ '$scope', '$rootScope', '$state', 'Videos', 'Toast',
        function ($scope, $rootScope, $state, Videos, Toast) {
          $scope.Videos = Videos
          localStorage.activeTab = 'chapters'
          $rootScope.activeTab = localStorage.activeTab

          $scope.currentSubject = localStorage.currentSubject
          Videos.create_chapter.subject_number = Videos.all_tutorials[$scope.currentSubject].subject_number

          Videos.create_video.subject_number = Videos.all_tutorials[$scope.currentSubject].subject_number

          Videos.create_video.chapter_number = null
          Videos.create_question.chapter_number = null
          Videos.create_option.chapter_number = null

          $scope.gotoVideos = function(index){
            localStorage.currentChapter = index
            $state.go('dashboard.videos')
          }

          $scope.deleteChapter = function(index){
            Videos.deleteChapter($scope.currentSubject, index).then((response)=>{
              if(response.data.status){
                Videos.all_tutorials = response.data.data
                Toast.showSuccess('Chapter deleted successfully')
              }else{
                Toast.showError(response.data.message)
              }
            })
          }
}]);

'use strict';

angular.module('trignosourceApp')
    .controller('AllVideosCtrl', [ '$scope', '$state', '$rootScope', 'Videos', 'Toast', '$timeout',
        function ($scope, $state, $rootScope, Videos, Toast, $timeout) {
          $scope.Videos = Videos
          localStorage.activeTab = 'videos'
          $rootScope.activeTab = localStorage.activeTab

          $scope.currentSubject = localStorage.currentSubject
          $scope.currentChapter = localStorage.currentChapter

          Videos.create_video.subject_number = Videos.all_tutorials[$scope.currentSubject].subject_number
          Videos.create_video.chapter_number = Videos.all_tutorials[$scope.currentSubject].chapters[$scope.currentChapter].chapter_number

          Videos.create_question.video_number = null
          Videos.create_option.video_number = null

          $scope.gotoQuestions = function(index){
            localStorage.currentVideo = index
            $state.go('dashboard.questions')
          }

          $scope.deleteVideo = function(index){
            Videos.deleteVideo($scope.currentSubject, $scope.currentChapter, index).then((response)=>{
              if(response.data.status){
                $timeout(function () {
                  Videos.all_tutorials = response.data.data
                });
                Toast.showSuccess('Video deleted successfully')
              }else{
                Toast.showError(response.data.message)
              }
            })
          }
}]);

'use strict';

angular.module('trignosourceApp')
    .controller('AddTutorialCtrl', [ '$scope', '$rootScope', '$state', 'Videos',
        function ($scope, $rootScope, $state, Videos) {
          $scope.Videos = Videos
          localStorage.activeRightTab = 'tutorials'
          $rootScope.activeRightTab = localStorage.activeTab
}]);

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

'use strict';

angular.module('trignosourceApp')
    .controller('AllOptionsCtrl', [ '$scope', '$rootScope', 'Videos', 'Toast', '$timeout',
        function ($scope, $rootScope, Videos, Toast, $timeout) {
          $scope.Videos = Videos
          localStorage.activeTab = 'options'
          $rootScope.activeTab = localStorage.activeTab

          $scope.currentSubject = localStorage.currentSubject
          $scope.currentChapter = localStorage.currentChapter
          $scope.currentVideo = localStorage.currentVideo
          $scope.currentQuestion = localStorage.currentQuestion

          Videos.create_option.subject_number = Videos.all_tutorials[$scope.currentSubject].subject_number
          Videos.create_option.chapter_number = Videos.all_tutorials[$scope.currentSubject].chapters[$scope.currentChapter].chapter_number
          Videos.create_option.video_number = Videos.all_tutorials[$scope.currentSubject].chapters[$scope.currentChapter].videos[$scope.currentVideo].video_number
          Videos.create_option.question_number = Videos.all_tutorials[$scope.currentSubject].chapters[$scope.currentChapter].videos[$scope.currentVideo].questions[$scope.currentQuestion].question_number

          $scope.deleteOption = function(index){
            Videos.deleteOption($scope.currentSubject, $scope.currentChapter, $scope.currentVideo, $scope.currentQuestion, index).then((response)=>{
              if(response.data.status){
                $timeout(function () {
                  Videos.all_tutorials = response.data.data
                });
                Toast.showSuccess('Option deleted successfully')
              }else{
                Toast.showError(response.data.message)
              }
            })
          }
}]);

angular.module('trignosourceApp')
    .factory('tokenInterceptor', ["$q", "$rootScope", function ($q, $rootScope) {
            return {
                request: function(config) {
                    config.headers = config.headers || {};
                    let token = localStorage.getItem('token')
                    if (token) {
                        config.headers.Authorization = token
                    }
                    return config || $q.when(config);
                },
                responseError: function(response) {
                    if (response.status === 401) {
                        $rootScope.$broadcast('tokenexpired')
                    }else if(response.status == 502 || response.status == 500){
                      $rootScope.$broadcast('reloadpage')
                    }
                    return response || $q.when(response);
                }
            };
    }])

class Toast{
  constructor($mdToast){
    this.$mdToast = $mdToast
  }
  showSuccess(msg){
    this.$mdToast.show(
        this.$mdToast.simple().textContent(msg).hideDelay(3000).position('top center').theme('success-toast')
    )
  }
  showError(msg){
    this.$mdToast.show(
        this.$mdToast.simple().textContent(msg).hideDelay(3000).position('top center').theme('error-toast')
    )
  }
}
Toast.$inject = ['$mdToast']
angular.module('trignosourceApp').service('Toast', Toast)

class Login{
  constructor($http){
    this.$http = $http
  }
  adminLogin(data){
    return this.$http({
      url: "/api/admin/login",
      method: "POST",
      data : data
    })
  }
  adminLogout(){
    return this.$http({
      url: "/api/admin/logout",
      method: "POST"
    })
  }
}
Login.$inject = ['$http']
angular.module('trignosourceApp').service('Login', Login)

class Videos{
  constructor($http, $timeout, Toast){
    this.$http = $http
    this.$timeout = $timeout
    this.Toast = Toast
    this.validFormats = ['pdf', 'xls', 'xlsx', 'zip', 'rar',
    'gz', 'txt', 'rtf', 'jpg', 'jpeg', 'png', 'gif', 'bmp',
    'html', 'tiff', 'tar.gz', 'gzip', 'docx', 'doc', 'mp4', 'm4v'];
    this.video_name = null
    this.all_videos = []
    this.all_tutorials = []
    this.getAllTutorials()
    this.getAllVideos()
    this.FileMessage = null
    this.durationError = null
    this.create_tutorial = {
      'subject_number' : null,
      'subject_name' : null
    }

    this.create_chapter = {
      'chapter_number' : null,
      'subject_number' : null,
      'chapter_name' : null
    }

    this.create_video = {
      'chapter_number' : null,
      'subject_number' : null,
      'video_name' : null,
      'video_number' : null,
      'thumbnail_time' : null,
      'is_module' : 'module',
      'mop_name' : null,
      'mop_number' : null
    }

    this.create_question = {
      'chapter_number' : null,
      'subject_number' : null,
      'video_number' : null,
      'question_number' : null,
      'question_name' : null,
      'time_of_pause' : null,
      'appear_time' : null
    }

    this.create_option = {
      'chapter_number' : null,
      'subject_number' : null,
      'video_number' : null,
      'question_number' : null,
      'option_number' : null,
      'option_name' : null,
      'skip_time' : null
    }
  }

  getAllTutorials(){
    this.$http({
      url: '/api/admin/tutorials',
      method: "GET"
    }).then((response)=>{
      if(response.data.status){
        this.all_tutorials = response.data.data
      }else{
        this.Toast.showError(response.data.message)
      }
    })
  }

  createTutorial(){
    return this.$http({
      url: '/api/admin/tutorials',
      method: "POST",
      data: this.create_tutorial
    })
  }

  createChapter(){
    return this.$http({
      url: '/api/admin/chapters',
      method: "POST",
      data: this.create_chapter
    })
  }

  createQuestion(){
    return this.$http({
      url: '/api/admin/questions',
      method: "POST",
      data: this.create_question
    })
  }

  createOption(){
    return this.$http({
      url: '/api/admin/options',
      method: "POST",
      data: this.create_option
    })
  }

  deleteTutorial(index){
    return this.$http({
      url: `/api/admin/tutorials?subject_number=${this.all_tutorials[index].subject_number}`,
      method: 'DELETE',
    })
  }

  deleteVideo(index1, index2, index3){
    let url = `/api/admin/videos?subject_number=${this.all_tutorials[index1].subject_number}`
    url += `&chapter_number=${this.all_tutorials[index1].chapters[index2].chapter_number}`
    url += `&video_number=${this.all_tutorials[index1].chapters[index2].videos[index3].video_number}`
    return this.$http({
      url: url,
      method: 'DELETE',
    })
  }

  deleteQuestion(index1, index2, index3, index4){
    let url = `/api/admin/questions?subject_number=${this.all_tutorials[index1].subject_number}`
    url += `&chapter_number=${this.all_tutorials[index1].chapters[index2].chapter_number}`
    url += `&video_number=${this.all_tutorials[index1].chapters[index2].videos[index3].video_number}`
    url += `&question_number=${this.all_tutorials[index1].chapters[index2].videos[index3].questions[index4].question_number}`
    return this.$http({
      url: url,
      method: 'DELETE',
    })
  }

  deleteOption(index1, index2, index3, index4, index5){
    let url = `/api/admin/options?subject_number=${this.all_tutorials[index1].subject_number}`
    url += `&chapter_number=${this.all_tutorials[index1].chapters[index2].chapter_number}`
    url += `&video_number=${this.all_tutorials[index1].chapters[index2].videos[index3].video_number}`
    url += `&question_number=${this.all_tutorials[index1].chapters[index2].videos[index3].questions[index4].question_number}`
    url += `&option_number=${this.all_tutorials[index1].chapters[index2].videos[index3].questions[index4].options[index5].option_number}`
    return this.$http({
      url: url,
      method: 'DELETE',
    })
  }

  deleteChapter(index1, index2){
    return this.$http({
      url: `/api/admin/chapters?subject_number=${this.all_tutorials[index1].subject_number}&chapter_number=${this.all_tutorials[index1].chapters[index2].chapter_number}`,
      method: 'DELETE',
    })
  }

  getAllVideos(){
    this.$http({
      url: '/api/admin/upload',
      method: "GET"
    }).then((response)=>{
      if(response.data.status){
        this.all_videos = response.data.data
      }else{
        this.Toast.showError(response.data.message)
      }
    })
  }

  validateVideoName(){
    if(this.create_video.video_name &&
      this.create_video.video_number &&
      this.create_video.thumbnail_time &&
      this.create_video.is_module &&
      this.create_video.mop_name &&
      this.create_video.mop_number) {
      this.FileMessage = null
      this.enableUpload = this.checkThumbnailTime()
    }else{
      // this.Toast.showError(`Please fill in proper details`)
      this.enableUpload = false
    }
  }

  addDuration(){
    this.edit_video.pause_durations.push("00:00:00")
    this.edit_video.questions.push({'appear_time': '00:00:00', 'question_text': '', 'options':[]})
    this.checkDuration()
  }

  addOptions(index){
    this.edit_video.questions[index].options.push({'skip_time': '00:00:00', 'text': ''})
    console.log(this.edit_video)
    this.checkDuration()
  }

  removeOptions(index1, index2){
    console.log(index1, index2)
    this.edit_video.questions[index1].options.splice(index2, 1)
    this.checkDuration()
  }

  removeDuration(index){
    this.edit_video.pause_durations.splice(index, 1)
    this.edit_video.questions.splice(index, 1)
    this.checkDuration()
  }

  checkThumbnailTime(){
    var m = this.create_video.thumbnail_time.split(":")
    console.log(m , m.length)
    if(m.length != 3){
      // this.Toast.showError(`Thumbnail Time should be of the format HH:MM:SS`)
      return false
    }else{
      return true
    }
  }

  checkDuration(){
    this.durationError = null
    _.each(this.edit_video.pause_durations, (duration)=>{
        console.log(duration)
        var m = duration.split(":")
        console.log(m , m.length)
        if(m.length != 3){
          this.durationError = `Duration should be of the format HH:MM:SS`
        }
    })
    _.each(this.edit_video.questions, (question)=>{
      var m = question.appear_time.split(":")
      if(m.length != 3){
        this.durationError = `Appear Time should be of the format HH:MM:SS`
      }else{
        _.each(question.options, (option)=>{
          var m = option.skip_time.split(":")
          if(m.length != 3){
            this.durationError = `Stop Time should be of the format HH:MM:SS`
          }
        })
      }
    })
  }

  editUpload(index){
    this.edit_video = this.all_videos[index]
    $('#editVideos').modal('show')
  }

  editUploadSubmit(){
    this.$http({
      url: '/api/admin/upload',
      method: 'PUT',
      data: this.edit_video
    }).then((response)=>{
      if(response.data.status){
        this.Toast.showSuccess(response.data.message)
        this.getAllVideos()
      }else{
        this.Toast.showError(response.data.message)
      }
    })
  }

  deleteUpload(index){
    let id = this.all_videos[index].id
    this.$http({
      url: `/api/admin/upload?id=${id}`,
      method: "DELETE"
    }).then((response)=>{
      if(response.data.status){
        this.Toast.showSuccess(response.data.message)
        this.getAllVideos()
      }else{
        this.Toast.showError(response.data.message)
      }
    })
  }

  uploadFileVideo(element){
    this.temp_element = element
    console.log(this.temp_element)
    this.validateVideoName()
  }

  uploadSubmit(){
    this.uploadFile(this.temp_element)
  }

  uploadFile(element){
    this.validateVideoName()
    if(this.enableUpload){
      this.$timeout(()=>{
        this.enableUpload = false
        this.theFile = element.files[0];
        this.FileMessage = null;
        var filename = this.theFile.name;
        var ext = filename.split(".").pop()
        var is_valid = this.validFormats.indexOf(ext) !== -1;
        var is_one = element.files.length == 1
        var is_valid_filename = this.theFile.name.length <= 64
        if (is_valid && is_one && is_valid_filename){
          var data = new FormData();
          data.append('file', this.theFile);
          var is_module = (this.create_video.is_module == 'module'?true:false)
          let url = `/api/admin/upload?video_name=${this.create_video.video_name}`
          url += `&subject_number=${this.create_video.subject_number}`
          url += `&chapter_number=${this.create_video.chapter_number}`
          url += `&video_number=${this.create_video.video_number}`
          url += `&thumbnail_time=${this.create_video.thumbnail_time}`
          url += `&is_module=${is_module}`
          url += `&mop_name=${this.create_video.mop_name}`
          url += `&mop_number=${this.create_video.mop_number}`
          this.$http({
            url: url,
            method: 'POST',
            headers: {'Content-Type': undefined},
            data: data
          }).then((response)=>{
            if(response.data.status){
              this.all_tutorials = response.data.data
              this.create_video.video_name = null
              this.create_video.video_number = null
              this.create_video.thumbnail_time = null
              this.create_video.mop_name = null
              this.create_video.mop_number = null
              this.create_video.is_module = 'module'
              this.enableUpload = false
              this.Toast.showSuccess(`Video created successfully`)
            }else{
              this.Toast.showError(`Something went wrong! Please try again`)
            }
          }).catch(()=>{
            this.Toast.showError(`Something went wrong while uploading`)
          })
          angular.element("input[type='file']").val(null);
        } else if(!is_valid){
          this.theFile = ''
          angular.element("input[type='file']").val(null);
          this.FileMessage = 'Please upload correct File Name, File extension is not supported';
        } else if(!is_one){
          this.theFile = ''
          angular.element("input[type='file']").val(null);
          this.FileMessage = 'Cannot upload more than one file at a time';
        } else if(!is_valid_filename){
          this.theFile = ''
          angular.element("input[type='file']").val(null);
          this.FileMessage = 'Filename cannot exceed 64 Characters';
        }
      })
    }else{
      this.Toast.showError(`Please fill in proper details`)
    }

  }
}
Videos.$inject = ['$http', '$timeout', 'Toast']
angular.module('trignosourceApp').service('Videos', Videos)

