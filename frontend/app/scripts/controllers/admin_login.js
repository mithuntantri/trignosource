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
