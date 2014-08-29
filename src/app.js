angular.module('ngMorph', ['morph.transitions'])
.factory('MorphAssist', ['$animate', '$timeout', function ($animate, $timeout) {
  var defaultStyles = {
    wrapper: {
      'position': 'fixed',
      'z-index': '900',
      'opacity': '0',
      'background': '#e85657',
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

  var setBoundingRect = function (element, positioning, callback) {
    element.css({
      'top': positioning.top + 'px',
      'left': positioning.left + 'px',
      'width': positioning.width + 'px',
      'height': positioning.height + 'px'
    });

    if ( typeof callback === 'function' )
      callback(element);
  };

  return { 
    setBoundingRect: setBoundingRect,

    applyDefaultStyles: function (element, elementName) {
      element.css(defaultStyles[elementName]);
    },

    addClass: {
      wrapper: function (element, settings) {
        var ContentBoundingRect = settings.ContentBoundingRect;

        element.css({
          'z-index': 1900,
          'opacity': 1,
          'background': '#e75854',
          visibility: 'visible',
          'pointer-events': 'auto',
          top: '50%',
          left: '50%',
          width: ContentBoundingRect.width + 'px',
          height: ContentBoundingRect.height + 'px', 
          margin: '-' + ( ContentBoundingRect.height / 2 ) + 'px 0 0 -' + ( ContentBoundingRect.width / 2 ) + 'px',
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
    },

    removeClass: {
      wrapper: function (element, settings) {
        var MorphableBoundingRect = settings.MorphableBoundingRect;
        
        element.css({
          'position': 'fixed',
          'z-index': '900',
          'opacity': '0',
          margin: 0,
          top: MorphableBoundingRect.top + 'px',
          left: MorphableBoundingRect.left + 'px',
          width: MorphableBoundingRect.width + 'px', 
          height: MorphableBoundingRect.height + 'px',
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
    }
  };
}])

.factory('Morph', ['MorphAssist', function (MorphAssist) {
  return {
    initialize: function (elements, settings) {
      var morphable = elements.morphable;
      var wrapper   = elements.wrapper;
      var content   = elements.content;
      var MorphableBoundingRect = settings.MorphableBoundingRect;
      var ContentBoundingRect = settings.ContentBoundingRect;

      // set wrapper bounding rectangle
      MorphAssist.setBoundingRect(wrapper, MorphableBoundingRect);
      
      // apply normal-state styles
      angular.forEach(elements, function (element, elementName) {
        MorphAssist.applyDefaultStyles(element, elementName);
      });
    },

    makeWrapper: function (content) {
      return angular.element('<div></div>').css('visibility', 'hidden');
    },

    addClass: function (element, elementName, settings) {
      MorphAssist.addClass[elementName](element, settings);
    },

    removeClass: function (element, elementName, settings) {
      MorphAssist.removeClass[elementName](element, settings);
    }

  };
}])

.directive('ngMorphable', ['$http', '$templateCache', '$compile', 'Morph', function ($http, $templateCache, $compile, Morph) {
  var isMorphed = false;

  var postLinking = function (scope, element, attrs) {
    var loadContent = $http.get(scope.settings.template.url, { cache: $templateCache });

    var compile = function (results) {
      if ( results ) scope.morphTemplate = results.data;

      return $compile(scope.morphTemplate)(scope);    
    };

    loadContent.then(compile)
    .then( function (content) {
      var wrapper = Morph.makeWrapper();
      var closeEl = angular.element(content[0].querySelector(scope.settings.closeEl));
      var elements = {
        morphable: element,
        wrapper: wrapper,
        content: content
      };

      // add to dom
      wrapper.append(content);
      element.after(wrapper);

      // get bounding rectangles
      scope.settings.MorphableBoundingRect = element[0].getBoundingClientRect();
      scope.settings.ContentBoundingRect = content[0].getBoundingClientRect();

      // bootstrap morphable environment
      Morph.initialize(elements, scope.settings);

      // attach event listeners
      element.bind('click', function () {
        if ( isMorphed ) { // testing only
          angular.forEach(elements, function (element, elementName) {
            Morph.removeClass(element, elementName, scope.settings);
          });
        } else {
          angular.forEach(elements, function (element, elementName) {
            Morph.addClass(element, elementName, scope.settings);
          });
        }

        isMorphed = !isMorphed;
      });

      closeEl.bind('click', function (event) {
        
        if ( isMorphed ) {
          
          angular.forEach(elements, function (element, elementName) {
            Morph.removeClass(element, elementName, scope.settings);
          });

          isMorphed = !isMorphed;
        }
      });
      
    });

  };

  return {
    restrict: 'A',
    scope: {
      // morphTemplate: '=',
      settings: '=ngMorphable'
    },
    link: postLinking
  };
}]);
