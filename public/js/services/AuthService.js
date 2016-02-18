'use strict';

let app = angular.module('MainApp');

app.service('AuthService',function ($http) {
  this.isAuthenticated = function (params) {
      if(typeof localStorage.token === 'undefined'){
        return false;
      }else if(localStorage.token == null){
          return false;
      }else{
          return true;
      }
  }
});
