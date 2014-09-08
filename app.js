angular.module('morphDemo', ['ngMorph'])
.controller('AppCtrl', ['$scope', function ($scope) {
  $scope.example1 = {
    closeEl: '.close',
    modal: {
      templateUrl: 'views/loginform.html'
    }
  };

  $scope.example2 = {
    closeEl: '.close',
    overlay: {
      templateUrl: 'views/info.html'
    }
  };

  $scope.example3 = {
    closeEl: '.close',
    expand: {
      templateUrl: 'views/loginform.html'
    }
  };

}]);