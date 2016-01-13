'use strict';
let app = angular.module('MainApp', ['ui.router']);

app.config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise("login");

  $stateProvider
    .state('login', {
      url: "/login",
      templateUrl: "../partials/loginMember.html",
      controller: "loginCtrl"
    })
    .state('resident', {
      url: "/register",
      templateUrl: "../partials/registerMember.html",
      controller: "registerCtrl"
    })

})

app.controller('loginCtrl',function ($scope, loginSrv, tokenSvc) {
  $scope.login = function (loginData) {
    loginSrv.loginUser(loginData).then(function (resp) {
      console.log(resp.data);
      tokenSvc.setToken(resp.data.token);
    },function (err) {
      if(err) swal("Error", `${err.data.message}`, "warning")
      tokenSvc.removeToken();
      console.log(err);
      })
  }
})

app.controller('registerCtrl',function ($scope, registerSrv, $state ) {
  $scope.register = function (regData) {
    registerSrv.registerUser(regData).then(function (resp) {
      console.log(resp.data);
      swal(`Awesome: Hello ${resp.data.user.firstName + resp.data.user.lastName}`, `${resp.data.message}`, "success");
      $state.go('login')
    }, function (err) {
      if(err) swal("Error", `${err}`, "warning")
      console.log(err);
    })
  }
})



app.service('loginSrv', function ($http) {
  this.loginUser = function (loginData) {
    return $http.post('/members/login',loginData)
  }
  });

app.service('registerSrv',function ($http) {
  this.registerUser = function (userData) {
    console.log('before post', userData);
    return $http.post('/members/register',userData)
  }
});

app.service('tokenSvc',function () {
  this.setToken = function (token) {
     localStorage.setItem('token', token);
  }
  this.removeToken = function (token) {
     localStorage.removeItem('token');
  }
});
