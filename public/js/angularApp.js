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
    .state('menu', {
      url: "/menu",
      templateUrl: "../partials/menuPage.html",
      controller: "menuCtrl",
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
