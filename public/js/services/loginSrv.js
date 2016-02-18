'use strict';

let app = angular.module('MainApp');


app.service('loginSrv', function ($http) {
  this.loginUser = function (loginData) {
    return $http.post('/members/login',loginData)
  }
  this.setUser = function (user) {
    localStorage.setItem('user', user)
  }
});
