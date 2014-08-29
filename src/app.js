angular.module('morphDemo', ['ngAnimate'])


.controller('AppCtrl', ['$scope', function ($scope) {
  $scope.example1 = {
    trigger: 'click',
    closingEl: '.close-x',
    template: {
      url: 'views/loginform.html',
    }
  };

  $scope.example2 = {
    trigger: 'click',
    closingEl: '.close-x',
    template: {
      url: 'views/about.html',
      width: '1000px',
      height: '800px'
    }
  };
    
  var toggle = false;

  $scope.transform = function (ev) {
    var el = angular.element(ev.target);
    if ( !toggle ) {
      TweenMax.to(el, 0.70, { width: 400, height: 400, delay: 0.1, ease: Expo.easeInOut });
      TweenMax.to(el, 0.40, { opacity: 1, delay: 0.3 });
    } else {
      TweenMax.to(el, 0.70, { width: 200, height: 50, delay: 0.1, ease: Expo.easeInOut });
      TweenMax.to(el, 0.3, { opacity: 0, delay: 0.5, ease: Expo.easeOut });
    }

    toggle = !toggle;
  };

}])


.animation('.ng-morphed-morphable', function () {
  return {
    addClass: function (element, className) {
      element.css({
        'z-index': 2000,
      });
      TweenMax.to(element, 0.1, { opacity: 0 });      
    },
    removeClass: function (element, className) {
      element.css({
        'z-index': 2000,
      });
      TweenMax.to(element, 0.1, { opacity: 1, delay: 0.5 });
    }
  };
})


.animation('.ng-morphed-wrapper', function () {
  return {
    addClass: function (element, className) {

      TweenMax.to(element, 0.1, { opacity: 1 });
    },
    removeClass: function (element, className) {
      TweenMax.to(element, 0.4, { opacity: 0 });
    }
  };
})


.animation('.ng-morphed-content', function () {
  return {
    addClass: function (element, className) {
      element.css({ visibility: 'visible' });

      TweenMax.to(element, 0.3, { opacity: 1, delay: 0.4, ease: Linear.easeNone });
    },
    removeClass: function (element, className) {
      TweenMax.to(element, 0.3, { opacity: 0, height: 0, delay: 0.3, ease: Linear.easeNone });
      element.css({ visibility: 'hidden' });
    }
  };
})




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
      // 'transition': 'opacity 0.3s 0.3s ease',
      // '-webkit-transition': 'opacity 0.3s 0.3s ease',
      'height': '0',
      'opacity': '0',
    },
    morphable: {
      'z-index': '1000',
      'outline': 'none',
      // '-webkit-transition': 'opacity 0.1s 0.5s',
      // 'transition': 'opacity 0.1s 0.5s'
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

  var addClassHandler = {
    wrapper: function (element, settings) {
        element.css({
          'visibility': 'visible',
          'margin': '-' + ( settings.ContentBoundingRect.height / 2 ) + 'px 0 0 -' + ( settings.ContentBoundingRect.width / 2 ) + 'px',
        });
    },
    content: function (element, settings) {
      element.css({
        height: settings.ContentBoundingRect.height + 'px'
      });
      // $animate.addClass(element, '.ng-morphed-content');
    }
  };

  var removeClassHandler = {
    wrapper: function (element, settings) {
      setBoundingRect(element, settings.MorphableBoundingRect);
      $animate.removeClass(element, '.ng-morphed-wrapper');
    },
    content: function (element, settings) {

    }
  };

  return { 
    setBoundingRect: setBoundingRect,

    applyDefaultStyles: function (element, elementName) {
      element.css(defaultStyles[elementName]);
    },

    addClass: function (element, elementName, settings) {
      if ( addClassHandler[elementName] )
        addClassHandler[elementName](element, settings);
      // else
        // $animate.addClass(element, '.ng-morphed-' + elementName);

    },

    removeClass: function (element, elementName, settings) {
      if ( removeClassHandler[elementName] )
        removeClassHandler[elementName](element, settings);
      else
        $animate.removeClass(element, '.ng-morphed-' + elementName);

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

    addClass: MorphAssist.addClass,

    removeClass: MorphAssist.removeClass
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

      element.bind('click', function () {
        if ( isMorphed ) {
          angular.forEach(elements, function (element, elementName) {
            Morph.removeClass(element, elementName, scope.settings);
          });

        } else {

          wrapper.css({
            top: MorphableBoundingRect.top ,
            left: MorphableBoundingRect.left,
          });

          wrapper.css({
            'visibility': 'visible',
          });

          TweenMax.to(wrapper, 0.60, { top: '50%', left: '50%', delay: 0.2, ease: Linear.easNone });
          TweenMax.to(wrapper, 0.6, { width: 400, height: 400, delay: 0.2 });
          TweenMax.to(wrapper, 0.6, { margin: '-' + ( ContentBoundingRect.height / 2 ) + 'px 0 0 -' + ( ContentBoundingRect.width / 2 ) + 'px', delay: 0.2 });
          TweenMax.to(wrapper, 0.20, { opacity: 1, delay: 0.15 });
          TweenMax.to(element, 0.1, { opacity: 0, delay: 0.15 });
          TweenMax.to(content, 0.4, { opacity: 1, delay: 0.6 });

          angular.forEach(elements, function (element, elementName) {
            // Morph.addClass(element, elementName, scope.settings);
          });

        }

        isMorphed = !isMorphed;
      });

      // content.bind(closeEl)
      
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
