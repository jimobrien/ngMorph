angular.module('morphDemo', ['ngMorph'])
.controller('AppCtrl', ['$scope', function ($scope) {

  $scope.loginForm = '<div class="login">' +
                      '<form>' +
                        '<p><label>Email</label><input type="text" /></p>' +
                        '<p><label>Password</label><input type="password" /></p>' +
                        '<p><button>Login</button></p>' +
                      '</form>' +
                    '</div>';

  $scope.morphSettings = {
    trigger: 'click',
  };

}]);