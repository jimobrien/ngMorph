angular.module('morphDemo', ['ngMorph'])
.controller('AppCtrl', ['$scope', function ($scope) {

  $scope.morphSettings = {
    trigger: 'click'
  };

}]);