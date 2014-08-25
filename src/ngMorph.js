angular.module('ngMorph', [])
.controller('MorphCtrl', ['$scope', function ($scope, s, st) {
  var ctrl = this;

  ctrl.getOriginElementDimensions = function () {
    return $scope.settings.originDimensions;
  };

}])
.directive('morphable', ['$compile', function ($compile) {
  var NormalStateStyles = {
    'opacity': 1,
    'z-index': 1000,
    '-webkit-transition': 'opacity 0.1s 0.5s',
    'transition': 'opacity 0.1s 0.5s',
  };

  var MorphedStateStyles = {
    'z-index': 2000,
    'opacity': 0,
    '-webkit-transition': 'opacity 0.1s',
    'transition': 'opacity 0.1s',
    // 'pointer-events': 'none'
  };

  return {
    restrict: 'A',
    controller: 'MorphCtrl',
    scope: {
      settings: '=morphable'
    },
    link: {
      pre: function (scope, element, attrs) {
        // initialize state
        var state = scope.state = { isMorphed: false };
        var settings = scope.settings;

        settings.originDimensions = element[0].getBoundingClientRect();

        // get morphable height/width to pass to morph-wrapper directive
        scope.wrapperCfg = {
          height: settings.originDimensions.height + 'px',
          width: settings.originDimensions.width + 'px',
          display: 'inline-block'
        };

        // compile wrapper directive, pass settings obj
        var wrapper = $compile('<morph-wrapper settings="wrapperCfg"/>')(scope);
        
        // wrap morphable with morphWrapper
        element.wrap(wrapper);

        // set normal state styles
        element.css(NormalStateStyles);


        // intialize event listener (get from config obj)
        element.on(scope.settings.trigger, function () {
          state.isMorphed ? element.css(NormalStateStyles) : element.css(MorphedStateStyles);
          state.isMorphed = !state.isMorphed;
        });
      }
    }
  };
}])
.directive('morphInto', ['$compile', function ($compile) {
  return {
    restrict: 'E',
    require: '^morphable', // share same instance of ctrl
    scope: {
      template: '='
    },
    link: function (scope, element, attrs) {
      // compile scope.template
      // set w/h to origin w/h
      var template = $compile(scope.template)(scope);
      console.log(template)
      // var dimensions = ctrl.getOriginElementDimensions();      
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
      

      // set height/width and normal-state styling
      element.css(scope.settings);
    }
  };
}]);