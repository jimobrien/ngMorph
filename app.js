angular.module('morphDemo', ['ngMorph'])
.controller('AppCtrl', ['$scope', function ($scope) {
  $scope.example1 = {
    closeEl: '.close-x',
    modal: {
      templateUrl: 'views/loginform.html'
    }
  };

  $scope.example2 = {
    closeEl: '.close-x',
    overlay: {
      templateUrl: 'views/info.html'
    }
  };


  $scope.example3 = {
    closeEl: '.close-x',
    expand: {
      templateUrl: 'views/loginform.html'
    }
  };


}]);