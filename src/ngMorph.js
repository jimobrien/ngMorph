angular.module('ngMorph', [])
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
    // controller: 'MorphCtrl',
    scope: {
      settings: '=morphable'
    },
    transclude: true,
    template: '<div ng-transclude></div><morph-into template="{{settings.morphInto}}" />',
    link: {
      pre: function (scope, element, attrs, ctrl) {
        var settings = scope.settings;
        var wrapper;

        // initialize state
        scope.state = { isMorphed: false };
        
        settings.originDimensions = element[0].getBoundingClientRect();

        // get morphable height/width to pass to morph-wrapper directive
        scope.wrapperCfg = {
          height: settings.originDimensions.height + 'px',
          width: settings.originDimensions.width + 'px',
          display: 'inline-block'
        };

        // compile wrapper directive, pass settings obj
        wrapper = $compile('<morph-wrapper settings="wrapperCfg"/>')(scope);
        
        // wrap morphable with morphWrapper
        element.wrap(wrapper);

        // set normal state styles
        element.css(NormalStateStyles);


        // intialize event listener (get from config obj)
        element.on(scope.settings.trigger, function () {
          scope.state.isMorphed ? element.css(NormalStateStyles) : element.css(MorphedStateStyles);
          scope.state.isMorphed = !scope.state.isMorphed;
          scope.$digest(); // requried to trigger $watch in morphInto
          
        });
      }
    }
  };
}])
.directive('morphInto', ['$compile', function ($compile) {

  var ContentWrapperStyles = {
    NormalState: {
      'background': '#e85657',
      'position': 'fixed',
      'z-index': '900',
      'opacity': 0,
      'pointer-events': 'none',
      '-webkit-transition': 'opacity 0.1s',
      'transition': 'opacity 0.3s 0.5s, width 0.4s 0.1s, height 0.4s 0.1s, top 0.4s 0.1s, left 0.4s 0.1s, margin 0.4s 0.1s',
      'transition-timing-function': 'cubic-bezier(0.7,0,0.3,1)',
      '-webkit-transition-timing-function': 'cubic-bezier(0.7,0,0.3,1)'
      // 'pointer-events': 'none'
    },
    MorphedState: {
      'opacity': 1,
      'z-index': 1900,
      'top': '50% !important',
      'left': '50% !important',
      'pointer-events': 'auto',
      'transition': 'width 0.4s 0.1s, height 0.4s 0.1s, top 0.4s 0.1s, left 0.4s 0.1s, margin 0.4s 0.1s',
    }
  };

  var TemplateStyles = {
    NormalState: {
      'visibility': 'hidden',
      'opacity': '0',
      '-webkit-transition': 'opacity 0.1s, visibility 0s 0.1s, height 0s 0.1s',
      'transition': 'opacity 0.1s, visibility 0s 0.1s, height 0s 0.1s'
    },
    MorphedState: {
      '-webkit-transition': 'opacity 0.3s 0.3s',
      'transition': 'opacity 0.3s 0.3s',
      'visibility': 'visible',
      'height': 'auto',
      'opacity': '1',
    }
  };

  return {
    restrict: 'E',
    // require: '^morphable', 
    // controller: 'MorphCtrl', // share same instance of ctrl
    // scope: {
    //   template: '='
    // },
    scope: true,
    // replace: true,
    // template: '<div></div>',
    link: function (scope, element, attrs, ctrl) {
      var parent = scope.$parent;

      var template = $compile(parent.settings.morphInto)(scope); //compile incase more directives are a part of the template
      var OriginalTemplateStyles = template[0].getBoundingClientRect();

      var styles = angular.extend({ 
        width: parent.settings.originDimensions.width + 'px', 
        height: parent.settings.originDimensions.height + 'px',
      }, ContentWrapperStyles.NormalState );
      
      element.css(styles);

      element.append(template);

      var templateStyles = angular.extend({
        height: '0px',
        width: parent.settings.originDimensions.width + 'px'
      }, TemplateStyles.NormalState);

      template.css(templateStyles);

      scope.$watch('state.isMorphed', function (isMorphed, oldVal) {
        if ( isMorphed !== oldVal ) {
          if ( isMorphed ) {
            element.css(ContentWrapperStyles.MorphedState);
            template.css(TemplateStyles.MorphedState);
          } else {
            element.css(ContentWrapperStyles.NormalState);
            template.css(TemplateStyles.NormalState);
          }
        }
      });

      // setTimeout( function () {  scope.state.isMorphed = true; console.log(scope.state)}, 2000)      
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
      // set height/width and normal-state styling
      element.css(scope.settings);
    }
  };
}]);