angular.module('morphDemo', ['ngAnimate'])

.controller('AppCtrl', ['$scope', function ($scope) {
  $scope.example1 = {
    trigger: 'click',
    closeEl: '.close-x',
    template: {
      url: 'views/loginform.html',
    }
  };

  $scope.example2 = {
    trigger: 'click',
    closeEl: '.close-x',
    template: {
      url: 'views/about.html',
      width: '1000px',
      height: '800px'
    }
  };

}])

.factory('MorphAssist', ['$animate', '$timeout', function ($animate, $timeout) {
  var defaultStyles = {
    wrapper: {
      'position': 'fixed',
      'z-index': '900',
      'opacity': '0',
      'background': '#e85657',
      'margin': '0',
      'pointer-events': 'none',
      'visibility': 'hidden'
    },
    content: {
      'height': '0',
      'opacity': '0',
    },
    morphable: {
      'z-index': '1000',
      'outline': 'none',
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
          'visibility': 'visible',
          'pointer-events': 'auto'
        });

        TweenMax.to(element, 0.30, { 
          delay: 0.2,
          top: '50%', 
          left: '50%',
          width: ContentBoundingRect.width,
          height: ContentBoundingRect.height, 
          margin: '-' + ( ContentBoundingRect.height / 2 ) + 'px 0 0 -' + ( ContentBoundingRect.width / 2 ) + 'px'
        });

        TweenMax.to(element, 0.30, { opacity: 1 }); 
      },
      content: function (element, settings) {
        TweenMax.to(element, 0.3, { opacity: 1, delay: 0.4 });
      },
      morphable: function (element, settings) {
          TweenMax.to(element, 0.03, { opacity: 0, delay: 0.2 });
      },
    },

    removeClass: {
      wrapper: function (element, settings) {
        var MorphableBoundingRect = settings.MorphableBoundingRect;

        TweenMax.to(element, 0.30, { 
          margin: 0, 
          delay: 0.2,
          top: MorphableBoundingRect.top, 
          left: MorphableBoundingRect.left,
          width: MorphableBoundingRect.width,
          height: MorphableBoundingRect.height,
          onComplete: function () {
            element.css({
              'visibility': 'hidden',
              'pointer-events': 'none'
            });
          } 
        });
      },
      content: function (element, settings) {
        TweenMax.to(element, 0.3, { opacity: 0 });
      },
      morphable: function (element, settings) {
        TweenMax.to(element, 0.03, { 
          opacity: 1, 
          delay: 0.42, 
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
  var MorphableBoundingRect;
  var ContentBoundingRect;

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
      scope.settings.MorphableBoundingRect = MorphableBoundingRect = element[0].getBoundingClientRect();
      scope.settings.ContentBoundingRect = ContentBoundingRect = content[0].getBoundingClientRect();

      // bootstrap morphable environment
      Morph.initialize(elements, scope.settings);

      // attach event listeners
      element.bind('click', function () {
        if ( isMorphed ) {
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

      closeEl.bind('click', function () {
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
