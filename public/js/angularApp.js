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

app.controller('loginCtrl',function ($scope, loginSrv) {
  $scope.login = function (loginData) {
    loginSrv.loginUser(loginData).then(function (resp) {
      console.log(resp.data);
    },function (err) {
      console.log(err);
    })
  }
})

app.controller('registerCtrl',function ($scope, registerSrv ) {

  $scope.register = function (regData) {
    registerSrv.registerUser(regData).then(function (resp) {
      console.log(resp.data);
    }, function (err) {
      console.log(err);
    })
  }
})



app.service('loginSrv', function ($http) {
  this.loginUser = function (loginData) {
    console.log(loginData);
    return $http.post('members/login',loginData)
  }
})

app.service('registerSrv',function ($http) {
  this.registerUser = function (userData) {
    console.log(userData);
    return $http.post('members/register')
  }
})
