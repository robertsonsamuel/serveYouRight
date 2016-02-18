'use strict';

var app = angular.module('MainApp');

// Register Ctrl
app.controller('registerCtrl',function ($scope, registerSrv, $state ) {
  $scope.register = function (regData) {
    registerSrv.registerUser(regData).then(function (resp) {
      console.log(resp);
      swal(`Awesome: Hello ${resp.data.firstName} ${resp.data.lastName}`, `You have been registered!`, "success");
      $state.go('login')
    }, function (err) {
      if(err) swal("Error", `${err.data}`, "warning")
      console.log(err);
    })
  }
})
