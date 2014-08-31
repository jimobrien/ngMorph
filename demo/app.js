angular.module('morphDemo', ['ngMorph'])
.controller('AppCtrl', ['$scope', function ($scope) {
  
  $scope.example1 = {
    trigger: 'click',
    closeEl: '.close-x',
    modal: {
      templateUrl: 'views/loginform.html',
      position: {
        top: 30,
        left: 30
      }
    }
  };

}]);