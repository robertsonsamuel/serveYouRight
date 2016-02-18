'use strict';

let app = angular.module('MainApp');

app.controller('menuCtrl', function($rootScope, $scope, $state, tokenSvc, getSvc, createSvc, editSvc, deleteSvc) {
  if ($rootScope.editingMenu) {
    $rootScope.loggedIn = true;
    getSvc.getMenuInfo($rootScope.editingMenu)
      .then(function(resp) {
        $scope.menu = resp.data;
      }, function(err) {
        console.log(err);
      })

    $scope.createItem = function() {
      let menuId = $rootScope.editingMenu;
      let item = {
        itemName:$scope.newItemName,
        itemDescription:$scope.newItemDesc,
        itemPrice:$scope.newItemPrice
      };
      createSvc.addItem(menuId, item)
      .then(function (resp) {
        $scope.menu = resp.data
        $scope.newItemName = '';
        $scope.newItemDesc = '';
        $scope.newItemPrice = '';
        $('#createModal').modal('hide')
      },function (err) {
        swal("Error!", "There was an error adding an item to the menu.", "error");
      })
    }

    $scope.addItemModal = function () {
      $('#createModal').modal('show')
    }
    $scope.editItem = function (itemId, itemName, itemDescription, itemPrice) {
      $scope.editItemId = itemId;
      $scope.editItemName = itemName;
      $scope.editItemDesc = itemDescription;
      $scope.editItemPrice = itemPrice;

      $('#editItemModal').modal('show')
    }

    $scope.saveItemChanges = function () {
      let item = {
          itemName:$scope.editItemName,
          itemDescription:$scope.editItemDesc,
          itemPrice:$scope.editItemPrice
      };
      editSvc.editItem($rootScope.editingMenu, $scope.editItemId, item)
      .then(function (resp) {
        $scope.menu = resp.data;
        $scope.editItemId = '';
        $scope.editItemName ='';
        $scope.editItemDesc ='';
        $scope.editItemPrice ='';
        $('#editItemModal').modal('hide');

      },function (err) {
        console.log(err);
      })
    }

    $scope.deleteItem = function (itemId) {
      swal({
      title: "Are you sure?",
      text: "You will not be able to recover this item!",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#DD6B55",
      confirmButtonText: "Yes, delete it!",
      closeOnConfirm: false
    },
    function() {
      deleteSvc.deleteItem($rootScope.editingMenu, itemId)
      .then(function (resp) {
        $scope.menu = resp.data
        swal("Deleted!", "Your menu has been deleted.", "success");
      },function (err) {
        swal("Error!", "There was an error deleting the item.", "error");
      })
    })
    }


    $scope.logout = function() {
      $state.go('login')
      $rootScope.loggedIn = false;
      tokenSvc.removeToken();
      tokenSvc.logOutUser();
    }

  } else {
    $state.go('welcome');
  }
})
