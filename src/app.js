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

.animation('.ng-morphable-origin', function () {
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
      'visibility': 'hidden',
      'position': 'fixed',
      'z-index': '900',
      'opacity': '0',
      'margin': '0',
    },
    content: {
      'visibility': 'hidden'
    },
    morphable: {
      'z-index': '1000',
      'outline': 'none',
      '-webkit-transition': 'opacity 0.1s 0.5s',
      'transition': 'opacity 0.1s 0.5s'
    }
  };
}])


.factory('MorphedStateStyles', [function () {

  return { 
    Wrapper: {
      'visibility': 'hidden'
    },
    Content: {
      'visibility': 'hidden'
    }
  };
}])



.factory('Morph', ['$animate', 'NormalStateStyles', 'MorphedStateStyles', function ($animate, NormalStateStyles, MorphedStateStyles) {

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
  }

  function initEvents () {

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
