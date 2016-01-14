/* global swal */
/* global angular */
'use strict';
let app = angular.module('MainApp', ['ui.router']);

app.config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise("login");

  $stateProvider
    .state('login', {
      url: "/login",
      templateUrl: "../partials/loginMember.html",
      controller: "loginCtrl",
      authenticate: false 
    })
    .state('resident', {
      url: "/register",
      templateUrl: "../partials/registerMember.html",
      controller: "registerCtrl",
      authenticate: false
    })
      .state('welcome', {
      url: "/welcome",
      templateUrl: "../partials/welcomePage.html",
      controller: "welcomeCtrl",
      authenticate: true 
    })

})

app.run(function ($rootScope, $state, AuthService) {
  $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams){
    if (toState.authenticate && !AuthService.isAuthenticated()){
      // User isn’t authenticated
      $state.transitionTo("login");
      event.preventDefault(); 
    }
  });
});


// controllers 

// Login Ctrl
app.controller('loginCtrl',function ($scope, loginSrv, tokenSvc, $state) {
  $scope.login = function (loginData) {
    loginSrv.loginUser(loginData).then(function (resp) {
      console.log(resp.data);
      tokenSvc.setToken(resp.data.token);
      $state.go('welcome')
    },function (err) {
      if(err) swal("Error", `${err.data.message}`, "warning")
      tokenSvc.removeToken();
      console.log(err);
      })
  }
})


// Register Ctrl
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


// WelcomePage Ctrl
app.controller('welcomeCtrl',function ($scope, registerSrv, $state ) {
    console.log('welcome hello!');
});


// Services 

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


