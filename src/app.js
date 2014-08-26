angular.module('morphDemo', ['ngMorph'])
.controller('AppCtrl', ['$scope', function ($scope) {

  $scope.example1 = {
    trigger: 'click',
    closingEl: '.close-x',
    template: {
      url: 'views/loginform.html',
    }
  };


  $scope.example2 = {
    trigger: 'click',
    closingEl: '.close-x',
    template: {
      url: 'views/about.html',
      width: '1000px',
      height: '800px'
    }
  };


  // Alertnate template method
  // $scope.loginForm = '<div class="login" >' +
  //                     '<span class="close"> X </span>' +
  //                     '<form>' +
  //                       '<p><label>Email</label><input type="text" /></p>' +
  //                       '<p><label>Password</label><input type="password" /></p>' +
  //                       '<p><button>Login</button></p>' +
  //                     '</form>' +
  //                   '</div>';

  

}]);
