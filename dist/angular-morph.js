angular.module('morph.transitions', ['morph.assist'])
.factory('Transitions', ['Modal', function (Modal) {
  return {
    Modal: Modal 
  };
}]);
angular.module('morph.transitions')
.factory('Modal', [ function () {
  return function (elements, settings) {
    var enter = {
      wrapper: function (element, settings) {
        var ContentBoundingRect = settings.ContentBoundingRect;

        element.css({
          'z-index': 1900,
          'opacity': 1,
          'visibility': 'visible',
          'pointer-events': 'auto',
          'top': '50%',
          'left': '50%',
          'width': ContentBoundingRect.width + 'px',
          'height': ContentBoundingRect.height + 'px', 
          'margin': '-' + ( ContentBoundingRect.height / 2 ) + 'px 0 0 -' + ( ContentBoundingRect.width / 2 ) + 'px',
          '-webkit-transition': 'width 0.4s 0.1s, height 0.4s 0.1s, top 0.4s 0.1s, left 0.4s 0.1s, margin 0.4s 0.1s',
          'transition': 'width 0.4s 0.1s, height 0.4s 0.1s, top 0.4s 0.1s, left 0.4s 0.1s, margin 0.4s 0.1s'
        });
        
      },
      content: function (element, settings) {
        element.css({
          'transition': 'opacity 0.3s 0.4s ease',
          'visibility': 'visible',
          'opacity': '1'
        });
      },
      morphable: function (element, settings) {
        element.css({
          'z-index': 2000,
          'opacity': 0,
          '-webkit-transition': 'opacity 0.1s',
          'transition': 'opacity 0.1s',
        });
      },
    };

    var exit = {
      wrapper: function (element, settings) {
        var MorphableBoundingRect = settings.MorphableBoundingRect;
        
        element.css({
          'position': 'fixed',
          'z-index': '900',
          'opacity': '0',
          'margin': 0,
          'top': MorphableBoundingRect.top + 'px',
          'left': MorphableBoundingRect.left + 'px',
          'width': MorphableBoundingRect.width + 'px', 
          'height': MorphableBoundingRect.height + 'px',
          'pointer-events': 'none',
          '-webkit-transition': 'opacity 0.3s 0.5s, width 0.35s 0.1s, height 0.35s 0.1s, top 0.35s 0.1s, left 0.35s 0.1s, margin 0.35s 0.1s',
          'transition': 'opacity 0.3s 0.5s, width 0.35s 0.1s, height 0.35s 0.1s, top 0.35s 0.1s, left 0.35s 0.1s, margin 0.35s 0.1s'
        });
      },
      content: function (element, settings) {
        element.css({
          'transition': 'opacity 0.3s 0.4s ease',
          'height': '0',
          'opacity': '0'
        });

        setTimeout( function () {
          element.css({'visibility': 'hidden'});
        }, 100);

      },
      morphable: function (element, settings) {
        element.css({
          'z-index': 900,
          'opacity': 1,
          '-webkit-transition': 'opacity 0.1s 0.4s',
          'transition': 'opacity 0.1s 0.4s',
        });
      },
    };

    return {

      toggle: function (isMorphed) {
        if ( !isMorphed ) {
          elements.wrapper.css({
            transition: 'none', // remove any transitions to prevent the relocation from being delayed.
            top: settings.MorphableBoundingRect.top + 'px',
            left: settings.MorphableBoundingRect.left + 'px'
          });

          // wrap in timeout to allow relocation to finish. transition styles are added too soon without this.
          setTimeout( function () {
            angular.forEach(elements, function (element, elementName) {
              enter[elementName](element, settings);
            });
          }, 25 );
        } else {
          angular.forEach(elements, function (element, elementName) {
            exit[elementName](element, settings);
          });
        }

        return !isMorphed;
      }
    };
  };
}]);

angular.module('morph.transitions')
.factory('Expand', [ function () {
}]);
angular.module('morph.transitions')
.factory('Overlay', [ function () {
}]);
angular.module('morph.directives', ['morph']);
angular.module('morph.directives')
.directive('ngMorphModal', ['$http', '$templateCache', '$compile', 'Morph', function ($http, $templateCache, $compile, Morph) {
  var isMorphed = false;

  return {
    restrict: 'A',
    scope: {
      settings: '=ngMorphModal'
    },
    link: function (scope, element, attrs) {
      var loadContent = $http.get(scope.settings.template.url, { cache: $templateCache });
      var wrapper     = angular.element('<div></div>').css('visibility', 'hidden');

      var compile = function (results) {
        if ( results ) scope.morphTemplate = results.data;

        return $compile(scope.morphTemplate)(scope);    
      };

      loadContent.then(compile)
      .then( function (content) {
        var closeEl  = angular.element(content[0].querySelector(scope.settings.closeEl));
        var elements = {
          morphable: element,
          wrapper: wrapper,
          content: content
        };

        wrapper.append(content);
        element.after(wrapper);

        // set the wrapper bg color
        wrapper.css('background', getComputedStyle(content[0]).backgroundColor);

        // get bounding rectangles
        scope.settings.MorphableBoundingRect = element[0].getBoundingClientRect();
        scope.settings.ContentBoundingRect = content[0].getBoundingClientRect();
        
        // bootstrap the modal
        // var modal = Morph.modal(elements, scope.settings);
        var modal = new Morph('Modal', elements, scope.settings);
        
        // attach event listeners
        element.bind('click', function () {
          scope.settings.MorphableBoundingRect = element[0].getBoundingClientRect();
          isMorphed = modal.toggle(isMorphed);
        });

        if ( closeEl ) {
          closeEl.bind('click', function (event) {
            scope.settings.MorphableBoundingRect = element[0].getBoundingClientRect();
            isMorphed = modal.toggle(isMorphed);
          });
        }

        // remove event handlers when scope is destroyed
        scope.$on('$destroy', function () {
          element.unbind('click');
          closeEl.unbind('click');
        });
      });

    }
  };
}]);
angular.module('morph.assist', [
  // assist.modal,
  // assist.expand,
  // assist.overlay
  ])
.factory('Assist', [function () {
  var defaultStyles = {
    wrapper: {
      'position': 'fixed',
      'z-index': '900',
      'opacity': '0',
      'margin': '0',
      'pointer-events': 'none',
      '-webkit-transition': 'opacity 0.3s 0.5s, width 0.4s 0.1s, height 0.4s 0.1s, top 0.4s 0.1s, left 0.4s 0.1s, margin 0.4s 0.1s',
      'transition': 'opacity 0.3s 0.5s, width 0.4s 0.1s, height 0.4s 0.1s, top 0.4s 0.1s, left 0.4s 0.1s, margin 0.4s 0.1s'
    },
    content: {
      'transition': 'opacity 0.3s 0.3s ease',
      '-webkit-transition': 'opacity 0.3s 0.3s ease',
      'height': '0',
      'opacity': '0',
    },
    morphable: {
      'z-index': '1000',
      'outline': 'none',
      '-webkit-transition': 'all 0.1s 0.5s',
      'transition': 'all 0.1s 0.5s'
    }
  };

  return { 
    setBoundingRect: function (element, positioning, callback) {
      element.css({
        'top': positioning.top + 'px',
        'left': positioning.left + 'px',
        'width': positioning.width + 'px',
        'height': positioning.height + 'px'
      });

      if ( typeof callback === 'function' )
        callback(element);
    },

    applyDefaultStyles: function (element, elementName) {
      element.css(defaultStyles[elementName]);
    }

  };
}]);
angular.module('morph', ['morph.transitions', 'morph.assist'])
.factory('Morph', ['Transitions', 'Assist', function (Transitions, Assist) {

  return function (type, elements, settings) {
    var MorphableBoundingRect = settings.MorphableBoundingRect;

    // set wrapper bounding rectangle
    Assist.setBoundingRect(elements.wrapper, MorphableBoundingRect);
    
    // apply normal-state styles
    angular.forEach(elements, function (element, elementName) {
      Assist.applyDefaultStyles(element, elementName);
    });

    return Transitions[type](elements, settings);
  };
}]);
angular.module('ngMorph', [
  'morph.transitions',
  'morph.directives',
  'morph.assist',
  'morph'
  ]);