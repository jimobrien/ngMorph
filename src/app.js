angular.module('morphDemo', ['ngMorph'])
.controller('AppCtrl', ['$scope', function ($scope) {

  $scope.loginForm = '<div class="login">' +
                      '<span class="close"> X </span>' +
                      '<form>' +
                        '<h2> Login </h2>' +
                        '<p><label>Email</label><input type="text" /></p>' +
                        '<p><label>Password</label><input type="password" /></p>' +
                        '<p><button>Login</button></p>' +
                      '</form>' +
                    '</div>';

  $scope.termsPane = '<div class="terms"> </div>'

  $scope.morphSettings = {
    trigger: 'click',
    closeEl: '.close'
  };

}]);