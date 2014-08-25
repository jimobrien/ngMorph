angular.module('ngMorph', [])
.controller('MorphCtrl', ['$scope', function ($scope) {
  
}])
.directive('morphable', ['$compile', function ($compile) {
  return {
    restrict: 'A',
    controller: 'MorphCtrl',
    scope: {
      morphable: '='
    },
    link: {
      pre: function (scope, element, attrs) {
        // create wrapper. same size as origin element.
        // intialize event listener (get from config obj)
        
        // get morphable height/width to pass to morph-wrapper directive
        scope.wrapperCfg = {
          height: element[0].offsetHeight,
          width: element[0].offsetWidth,
          display: 'inline-block'
        };

        // compile wrapper directive, pass settings obj
        var wrapper = $compile('<morph-wrapper settings="wrapperCfg"/>')(scope);
        
        // wrap morphable with morphWrapper
        element.wrap(wrapper);
      }
    }
  };
}])
.directive('morphInto', [function () {
  return {
    restrict: 'E',
    require: '^morphable', // share same instance of ctrl
    link: function (scope, element, attrs) {
      console.log(scope, 'into')
    }
  };
}])
.directive('morphWrapper', [function () {
  return {
    restrict: 'E',
    scope: {
      settings: '='
    },
    link: function (scope, element, attrs) {
      // wrap the elements required for morphing effect
      // track state (morphed / normal)
      console.log(scope);

      // set height/width and normal-state styling
      element.css(scope.settings);
    }
  };
}]);