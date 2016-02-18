'use strict';

let app = angular.module('MainApp');


app.service('editSvc', function ($http) {
  this.editItem = function (menuId, itemId, item) {
    return $http.put(`/menus/edit/item/${menuId}/${itemId}`, item);
  }
  this.editEmployee = function (employee, ownerId) {
    return $http.put(`/members/edit/employee/${employee._id}/${ownerId}`, employee)
  }
})
