'use strict';

let app = angular.module('MainApp');

// WelcomePage Ctrl
app.controller('welcomeCtrl', function($rootScope, $scope, registerSrv, loginSrv, $state, tokenSvc, getSvc, createSvc, editSvc, deleteSvc) {
  if (typeof localStorage.getItem('token') === 'undefined') {
    $state.go('login')
  } else if (localStorage.getItem('token') === null) {
    $state.go('login')
  } else {
    let user = JSON.parse(localStorage.getItem('user'));
      if (user.owner){  //is an owner
        getSvc.getOwnerInfo(user._id)
        .then(function (resp) {
          $scope.user = resp.data;
        },function (err) {
          console.log(err);
        })

        $rootScope.loggedIn = true;
      }else { //is an employee
        $scope.logout();
        swal("Authentication Err", 'You are not authorized to view this page', 'error');
      }
    }

  $scope.createMenu = function () {
    createSvc.makeMenu($scope.newMenu, $scope.user, $scope.user.storeCode)
    .then(function (resp) {
      $scope.user.menus = [];
      $scope.user.menus = resp.data.menus;
      $scope.newMenu = '';
    }, function (err) {
        swal("Error!", "There was an creating the menu.", "error");
    })
  }

  $scope.deleteMenu = function (menuId) {
    swal({
    title: "Are you sure?",
    text: "You will not be able to recover this menu!",
    type: "warning",
    showCancelButton: true,
    confirmButtonColor: "#DD6B55",
    confirmButtonText: "Yes, delete it!",
    closeOnConfirm: false
  },
  function() {
    deleteSvc.deleteMenu(menuId, $scope.user._id)
      .then(function(resp) {
        console.log('resp from delete', resp);
        $scope.user.menus = [];
        $scope.user.menus = resp.data.menus;
        swal("Deleted!", "Your menu has been deleted.", "success");
      }, function(err) {
        swal("Error!", "There was an error deleting the menu.", "error");
      })
  });
}

  $scope.editMenu = function (menuID) {
    $rootScope.editingMenu = menuID
    $state.go('menu')
  }

  $scope.launchEditEmployeeModal = function (employee) {
    $scope.member = employee;
    $scope.member._id = employee._id;
    $('#editEmployeeModal').modal('show')
  }
  $scope.editEmployee = function (employee) {
    delete employee.menus
    delete employee.$$hashKey
    delete employee.orders
    console.log('before sending', employee);
    editSvc.editEmployee(employee, $scope.user._id).then(function (resp) {
      $scope.user = resp.data;
      $('#editEmployeeModal').modal('hide')
    }, function (err) {
      swal('Error', 'Error updating this employee.', 'error');
    })

  }

  $scope.deleteEmployee = function (employee) {
    swal({
    title: "Are you sure?",
    text: "You will not be able to recover this user!",
    type: "warning",
    showCancelButton: true,
    confirmButtonColor: "#DD6B55",
    confirmButtonText: "Yes, delete it!",
    closeOnConfirm: false
  },
  function() {
    deleteSvc.deleteEmployee(employee._id, $scope.user._id)
    .then(function (resp) {
      $scope.user = resp.data
      swal("Deleted!", "Your user has been deleted.", "success");
    },function (err) {
      swal('Error', 'Error deleting this employee.', 'error');
    })
  })

  }

  $scope.logout = function() {
    $state.go('login')
    $rootScope.loggedIn = false;
    tokenSvc.removeToken();
    tokenSvc.logOutUser();
  }
});
