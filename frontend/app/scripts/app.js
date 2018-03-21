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
