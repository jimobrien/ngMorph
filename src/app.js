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
        'z-index': 1000,
      });
      TweenMax.to(element, 0.1, { opacity: 1 });
    }
  };
})


.animation('.ng-morphed-wrapper', function () {
  return {
    addClass: function (element, className) {

    },
    removeClass: function (element, className) {

    }
  };
})


.animation('.ng-morphed-content', function () {
  return {
    addClass: function (element, className) {

    },
    removeClass: function (element, className) {

    }
  };
})




.factory('NormalStateStyles', [function () {
  return { 
    wrapper: {
      'position': 'fixed',
      'z-index': '900',
      'opacity': '0',
      'margin': '0',
      'pointer-events': 'none'
      // move to $animate
      // '-webkit-transition': 'opacity 0.3s 0.5s, width 0.4s 0.1s, height 0.4s 0.1s, top 0.4s 0.1s, left 0.4s 0.1s, margin 0.4s 0.1s',
      // 'transition': 'opacity 0.3s 0.5s, width 0.4s 0.1s, height 0.4s 0.1s, top 0.4s 0.1s, left 0.4s 0.1s, margin 0.4s 0.1s'
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
}])



.factory('Morph', ['$animate', 'NormalStateStyles', function ($animate, NormalStateStyles) {

  var isMorphed = false;

  function initialize (morphable, content, settings) {
    var MorphableBoundingRect;
    var ContentBoundingRect;

    this.wrapper   = wrapper = angular.element('<div></div>').css('visibility', 'hidden');
    this.content   = content;
    this.morphable = morphable;

    // add to dom
    wrapper.append(content);
    morphable.after(wrapper);

    // get content dimensions
    MorphableBoundingRect = morphable[0].getBoundingClientRect();
    ContentBoundingRect   = content[0].getBoundingClientRect();
    
    // set wrapper position
    wrapper.css({
      'top': MorphableBoundingRect.top + 'px',
      'left': MorphableBoundingRect.left + 'px',
      'width': MorphableBoundingRect.width + 'px',
      'height': MorphableBoundingRect.height + 'px'
    });

    // apply normal-state styles
    morphable.css(NormalStateStyles.morphable);
    wrapper.css(NormalStateStyles.wrapper);
    content.css(NormalStateStyles.content);

    // init event handlers for morphable
    _initEvents(morphable, content);
  }

  function _initEvents (morphable, content) {

    morphable.bind('click', function () {
      if ( isMorphed ) 
        $animate.removeClass(morphable, '.ng-morphed-morphable');
      else
        $animate.addClass(morphable, '.ng-morphed-morphable');
      
      isMorphed = !isMorphed;
    });
    // on click
    // on window resize, recalc wrapper position
  }

  return {
    initialize: initialize
  };
}])



.directive('ngMorphable', ['$compile', '$http', 'Morph', function ($compile, $http, Morph) {
  // function initialize (morphable, compiledContent, settings) {
  //   Morph.initialize(morphable, compiledContent, settings);
  // }

  var postLinking = function (scope, element, attrs) {
    var fetchContent = $http.get(scope.settings.template.url);

    var compileContent = function (results) {
      if ( results ) scope.morphTemplate = results.data;

      return $compile(scope.morphTemplate)(scope);    
    };

    fetchContent.then(compileContent)
    .then( function (compiledContent) {
      Morph.initialize(element, compiledContent, scope.settings);
      // Morph.content
      // Morph.wrappedContent
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
}])




.directive('ngMorphInto', ['$compile', function ($compile) {
  return {
    restrict: 'E',
    scope: false, // sibling scope, just being explicit
    template: '<div></div>',
    replace: true,
    link: function (scope, element, attrs) {
      var content = $compile(attrs.template)(scope);
      element.append(content);
      
    }
  }; 
}])

;
