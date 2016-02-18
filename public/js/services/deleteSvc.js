'use strict';
let app = angular.module('MainApp');

app.service('deleteSvc',function ($http) {
  this.deleteMenu = function (menuId, ownerId) {
    return $http.post(`/menus/delete/${ownerId}/${menuId}`)
  }
  this.deleteItem = function (menuId, itemId) {
    return $http.post(`/menus/delete/item/${menuId}/${itemId}`)
  }
  this.deleteEmployee = function (employeeId, ownerId) {
    return $http.post(`/members/delete/employee/${employeeId}/${ownerId}`)
  }
})
