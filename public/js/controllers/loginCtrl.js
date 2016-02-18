'use strict'
let app = angular.module('MainApp');
// Login Ctrl
app.controller('loginCtrl',function ($rootScope,$scope, loginSrv, tokenSvc, $state) {
  $scope.login = function (loginData) {
    loginSrv.loginUser(loginData).then(function (resp) {
      console.log(resp);
      if (resp.data.user.owner || resp.data.owner){
        tokenSvc.setToken(resp.data.token);
        loginSrv.setUser(JSON.stringify(resp.data.user));
        $rootScope.loggedIn = true;
        $state.go('welcome')
      }else{
        $state.go('login')
        $rootScope.loggedIn = false;
        tokenSvc.removeToken();
        tokenSvc.logOutUser();
        swal("Authentication Err", 'You are not authorized to view this page', 'error');
      }
    },function (err) {
      if(err) swal("Error", `${err.data.message}`, "warning")
      tokenSvc.removeToken();
      console.log(err);
      })
  }
});
