angular.module('morphDemo', ['ngMorph'])
.controller('AppCtrl', ['$scope', function ($scope) {
  $scope.example1 = {
    trigger: 'click',
    closeEl: '.close-x',
    modal: {
      url: 'views/loginform.html'
    }
  };

  $scope.example2 = {
    trigger: 'click',
    closeEl: '.close-x',
    template: {
      url: 'views/about.html',
    }
  };

  $scope.example3 = {
    trigger: 'click',
    closeEl: '.close-x',
    template: {
      url: 'views/loginform.html',
    }
  };

}]);