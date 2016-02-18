'use strict';

let app = angular.module('MainApp');

app.service('createSvc', function ($http) {
  this.makeMenu = function (menuName, user, storeCode) {
    return $http.post(`/menus/create/${user._id}`, {storeCode:storeCode, menuName:menuName} )
  }
  this.addItem = function(menuId, itemInfo){
    return $http.post(`/menus/create/item/${menuId}`, itemInfo)
  }
})
