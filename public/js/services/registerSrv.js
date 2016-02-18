'use strict';
let app = angular.module('MainApp');

app.service('registerSrv',function ($http) {
  this.registerUser = function (userData) {
    console.log('before post', userData);
    return $http.post('/members/register',userData)
  }
});
