'use strict';

let app = angular.module('MainApp');


app.service('getSvc', function ($http) {
    this.getOwnerInfo = function (userId) {
      return $http.get(`/members/ownerInfo/${userId}`)
    }
    this.getMenuInfo = function (menuId) {
      return $http.get(`/menus/menu/${menuId}`)
    }
});
