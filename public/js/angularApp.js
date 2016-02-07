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


// controllers

// Login Ctrl
app.controller('loginCtrl',function ($rootScope,$scope, loginSrv, tokenSvc, $state) {
  $scope.login = function (loginData) {
    loginSrv.loginUser(loginData).then(function (resp) {
      console.log(resp);
      if (resp.data.user.owner || resp.data.owner){
        tokenSvc.setToken(resp.data.token);
        loginSrv.setUser(JSON.stringify(resp.data.user));
        $rootScope.loggedIn = true;
        $state.go('welcome')
      }else{
        $state.go('login')
        $rootScope.loggedIn = false;
        tokenSvc.removeToken();
        tokenSvc.logOutUser();
        swal("Authentication Err", 'You are not authorized to view this page', 'error');
      }
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
app.controller('welcomeCtrl', function($rootScope, $scope, registerSrv, loginSrv, $state, tokenSvc, getSvc, createSvc, deleteSvc) {
  if (typeof localStorage.getItem('token') === undefined) {
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
    createSvc.makeMenu($scope.newMenu, $scope.user)
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

  $scope.logout = function() {
    $state.go('login')
    $rootScope.loggedIn = false;
    tokenSvc.removeToken();
    tokenSvc.logOutUser();
  }
});


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
      },function (err) {
        swal("Error!", "There was an error adding an item to the menu.", "error");
      })
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


// Services

app.service('loginSrv', function ($http) {
  this.loginUser = function (loginData) {
    return $http.post('/members/login',loginData)
  }
  this.setUser = function (user) {
    localStorage.setItem('user', user)
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
  this.logOutUser = function () {
      localStorage.removeItem('user');
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

app.service('getSvc', function ($http) {
    this.getOwnerInfo = function (userId) {
      return $http.get(`/members/ownerInfo/${userId}`)
    }
    this.getMenuInfo = function (menuId) {
      return $http.get(`/menus/menu/${menuId}`)
    }
});


app.service('createSvc', function ($http) {
  this.makeMenu = function (menuName, user) {
    return $http.post(`/menus/create/${user._id}`, {menuName:menuName})
  }
  this.addItem = function(menuId, itemInfo){
    return $http.post(`/menus/create/item/${menuId}`, itemInfo)
  }
})

app.service('editSvc', function ($http) {
  this.editItem = function (menuId, itemId, item) {
    return $http.put(`/menus/edit/item/${menuId}/${itemId}`, item);
  }
})

app.service('deleteSvc',function ($http) {
  this.deleteMenu = function (menuId, ownerId) {
    return $http.post(`/menus/delete/${ownerId}/${menuId}`)
  }
  this.deleteItem = function (menuId, itemId) {
    return $http.post(`/menus/delete/item/${menuId}/${itemId}`)
  }
})
