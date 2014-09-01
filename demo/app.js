angular.module('morphDemo', ['ngMorph'])
.controller('AppCtrl', ['$scope', function ($scope) {
  
  $scope.example1 = {
    trigger: 'click',
    closeEl: '.close-x',
    modal: {
      templateUrl: 'views/loginform.html'
    }
  };

  $scope.example2 = {
    trigger: 'click',
    closeEl: '.close-x',
    overlay: {
      templateUrl: 'views/info.html',
    }
  };

}]);