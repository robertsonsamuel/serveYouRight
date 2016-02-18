'use strict';

let app = angular.module('MainApp');

app.service('tokenSvc',function () {
  this.setToken = function (token) {
     localStorage.setItem('token', token);
  }
  this.removeToken = function (token) {
     localStorage.removeItem('token');
  }
  this.logOutUser = function () {
      localStorage.removeItem('user');
  }
});
