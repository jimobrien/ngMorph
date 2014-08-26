angular.module('ngMorph', [])
.factory('MorphEngine', [function () {
  var transEndEventNames = {
      'WebkitTransition': 'webkitTransitionEnd',
      'MozTransition': 'transitionend',
      'OTransition': 'oTransitionEnd',
      'msTransition': 'MSTransitionEnd',
      'transition': 'transitionend'
    };

  var transEndEventName = transEndEventNames[ Modernizr.prefixed( 'transition' ) ];

  function Morphable (morphWrapper, morphable, morphContent, options) {
    this.morphWrapper = morphWrapper[0];
    this.morphContent = morphContent[0];
    this.morphable    = morphable[0];
    this.options      = angular.extend( this.options, options );

    this._init();
  }

  Morphable.prototype.options = {
    closeEl : '',
    onBeforeOpen : function() { return false; },
    onAfterOpen : function() { return false; },
    onBeforeClose : function() { return false; },
    onAfterClose : function() { return false; }
  };

  Morphable.prototype._init = function() {
    this.expanded = false;
    this._initEvents();
  };

  Morphable.prototype._initEvents = function() {
    var self = this;
    
    // open
    this.morphable.addEventListener( this.options.trigger, function() { self.toggle(); } );

    // close
    if( this.options.closeEl !== '' ) {
      var closeEl = this.morphWrapper.querySelector( this.options.closeEl );

      if( closeEl ) {
        closeEl.addEventListener( this.options.trigger, function() { self.toggle(); } );
      }
    }
  };

  Morphable.prototype.toggle = function() {
    var self = this;
    var elementPos = this.morphable.getBoundingClientRect();

    var onEndTransitionFn = function (event) {
      if ( event.target !== this ) {
        return false;
      }

      if ( self.expanded && event.propertyName !== 'opacity' || !self.expanded && event.propertyName !== 'width' && event.propertyName !== 'height' && event.propertyName !== 'left' && event.propertyName !== 'top' ) {
        return false;
      }

      this.removeEventListener( transEndEventName, onEndTransitionFn );

      self.isAnimating = false;
      
      if ( self.expanded ) {
        angular.element(self.morphWrapper).removeClass('active');
      }

      self.expanded = !self.expanded;
    };

    if ( this.isAnimating ) {
      return false;
    }

    if ( !this.expanded ) {
      angular.element(this.morphWrapper).addClass('active');
    }

    this.isAnimating = true;

    // add evt listeners
    this.morphContent.addEventListener( transEndEventName, onEndTransitionFn );
    
    // add/remove class "open" to the button wraper
    setTimeout( function() {
      self.morphContent.style.left = elementPos.left + 'px';
      self.morphContent.style.top = elementPos.top + 'px';
      
      if ( self.expanded ) {
        angular.element(self.morphWrapper).removeClass('open');
        self.morphContent.style.width = self.morphable.offsetWidth + 'px';
        self.morphContent.style.height = self.morphable.offsetHeight + 'px';
      } else {
        setTimeout( function() {
          angular.element(self.morphWrapper).addClass('open');
          angular.element(self.morphWrapper).addClass('open');
          self.morphContent.style.width = 400 + 'px';
          self.morphContent.style.height = 400 + 'px';
        }, 25 );
      }
    }, 25 );
  };

  return {
    init: function (morphWrapper, morphable, morphContent, options) {
      return new Morphable(morphWrapper, morphable, morphContent, options);
    }
  };

}])
.directive('morphable', ['$compile', 'MorphEngine', function ($compile, MorphEngine) {
 return {
  restrict: 'A',
  scope: {
    template: '=morphInto',
    settings: '=morphable'
  },
  link: function (scope, element, attrs) {

    var boundingBox = element[0].getBoundingClientRect();
    var morphWrapper;
    var morphContent;

    var ContentStyle = {
      height: boundingBox.height + 'px',
      width: boundingBox.width + 'px',      
    };

    var WrapperStyle = { 
      height: boundingBox.height + 'px',
      width: boundingBox.width + 'px',  
      display: 'inline-block'
    };

    morphWrapper = $compile('<morph-wrapper />')(scope);
    morphContent = $compile('<morph-content template="{{template}}">')(scope);

    morphWrapper.css(WrapperStyle);
    morphContent.css(ContentStyle);

    element.wrap(morphWrapper);
    element.after(morphContent);

    // initialize morph engine
    MorphEngine.init(morphWrapper, element, morphContent, scope.settings);
  }
 };
}])
.directive('morphContent', ['$compile', function ($compile) {
  return {
    restrict: 'E',
    template: '<div></div>',
    replace: true,
    link: function (scope, element, attrs) {
      
      element.addClass('morph-content');
      var innerContent = $compile(attrs.template)(scope);
      element.append(innerContent);

    }
  }; 
}])
.directive('morphWrapper', [function () {
  return {
    restrict: 'E',
    link: function (scope, element, attrs) {

      element.addClass('morph-button morph-button-modal morph-button-modal-2 morph-button-fixed');
      
    }
  };
}]);