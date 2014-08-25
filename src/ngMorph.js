angular.module('ngMorph', [])
.controller('MorphCtrl', ['$scope', function ($scope) {
  
}])
.directive('morphable', [function () {
  return {
    restrict: 'A',
    require: '^morphWrapper',
    scope: {
      morphable: '='
    },
    link: function (scope, element, attrs) {
      // create wrapper. same size as origin element.
      // intialize event listener (get from config obj)
      
    }
  };
}])
.directive('morphInto', [function () {
  return {
    restrict: 'E',
    require: '^morphable',
    link: function (scope, element, attrs) {
      
    }
  };
}])
.directive('morphWrapper', [function () {
  return {
    restrict: 'E',
    controller: 'MorphCtrl',
    link: function (scope, element, attrs) {
      // wrap the elements required for morphing effect
      // track state (morphed / normal)
    }
  };
}]);