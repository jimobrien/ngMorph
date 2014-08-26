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
    template: '=',
    settings: '=morphable'
  },
  link: function (scope, element, attrs) {
    var isMorphed = false;
    var Morphable = element;
    var MorphableBoundingBox = element[0].getBoundingClientRect();
    var MorphWrapper;
    var MorphContentWrapper;
    var MorphContent;

    var ContentStyle = {
      'position': 'fixed',
      'z-index': '900',
      'opacity': '0',
      height: MorphableBoundingBox.height + 'px',
      width: MorphableBoundingBox.width + 'px', 
      'pointer-events': 'none',
      '-webkit-transition': 'opacity 0.3s 0.5s, width 0.4s 0.1s, height 0.4s 0.1s, top 0.4s 0.1s, left 0.4s 0.1s, margin 0.4s 0.1s',
      'transition': 'opacity 0.3s 0.5s, width 0.4s 0.1s, height 0.4s 0.1s, top 0.4s 0.1s, left 0.4s 0.1s, margin 0.4s 0.1s'
    };

    var WrapperStyle = { 
      height: MorphableBoundingBox.height + 'px',
      width: MorphableBoundingBox.width + 'px',  
      display: 'inline-block'
    };

    MorphWrapper = $compile('<morph-wrapper />')(scope);
    MorphContentWrapper = $compile('<morph-content template="{{template}}">')(scope);
    MorphContent = angular.element(MorphContentWrapper[0].children[0]);

    MorphWrapper.css(WrapperStyle);
    MorphContentWrapper.css(ContentStyle);

    Morphable.css({
      'z-index': '1000',
      'width': '100%',
      'height': '100%',
      'outline': 'none',
      '-webkit-transition': 'opacity 0.1s 0.5s',
      'transition': 'opacity 0.1s 0.5s'
    });

    Morphable.wrap(MorphWrapper);
    Morphable.after(MorphContentWrapper);

    Morphable.bind('click', function () {
      if ( !isMorphed ) {
        setTimeout( function() {
          MorphContentWrapper[0].style.left = MorphableBoundingBox.left + 'px';
          MorphContentWrapper[0].style.top = MorphableBoundingBox.top + 'px';

          Morphable.css({
            'z-index': 2000,
            'opacity': 0,
            '-webkit-transition': 'opacity 0.1s',
            'transition': 'opacity 0.1s',
          });

          setTimeout( function() {
            MorphContentWrapper[0].style.width = 400 + 'px';
            MorphContentWrapper[0].style.height = 400 + 'px';

            MorphContentWrapper.css({
              'z-index': 1900,
              'opacity': 1,
              'background': '#e75854',
              'pointer-events': 'auto',
              top: '50%',
              left: '50%',
              margin: '-200px 0 0-200px',
              '-webkit-transition': 'width 0.4s 0.1s, height 0.4s 0.1s, top 0.4s 0.1s, left 0.4s 0.1s, margin 0.4s 0.1s',
              'transition': 'width 0.4s 0.1s, height 0.4s 0.1s, top 0.4s 0.1s, left 0.4s 0.1s, margin 0.4s 0.1s'
            });

            MorphContent.css({
              'transition': 'opacity 0.3s 0.3s',
              'visibility': 'visible',
              'height': 'auto',
              'opacity': '1'
            });

          }, 25);

        }, 25);
        

      } else {
        setTimeout( function () {
          MorphWrapper.css(WrapperStyle);
          MorphContentWrapper.css({
            margin: 0,
            top: MorphableBoundingBox.top + 'px',
            left: MorphableBoundingBox.left + 'px'
          });
          MorphContentWrapper.css(ContentStyle);
          MorphContent.css({
            'transition': 'opacity 0.3s 0.3s',
            'visibility': 'hidden',
            'height': '0',
            'opacity': '0'
          });
          Morphable.css({
            'z-index': '1000',
            'opacity': 1,
            '-webkit-transition': 'opacity 0.1s 0.5s',
            'transition': 'opacity 0.1s 0.5s'
          });
        }, 25);
      }

      isMorphed = !isMorphed;
    });

  }
 };
}])
.directive('morphContent', ['$compile', function ($compile) {
  return {
    restrict: 'E',
    template: '<div></div>',
    replace: true,
    link: function (scope, element, attrs) {
    
      var content = $compile(attrs.template)(scope);

      content.css({
        'visibility': 'hidden',
        'height': '0',
        'opacity': '0',
        '-webkit-transition': 'opacity 0.1s, visibility 0s 0.1s, height 0s 0.1s',
        'transition': 'opacity 0.1s, visibility 0s 0.1s, height 0s 0.1s'
      });

      element.append(content);

    }
  }; 
}])
.directive('morphWrapper', [function () {
  return {
    restrict: 'E',
    // template: '<div class="morph-button morph-button-modal morph-button-modal-2 morph-button-fixed"></div>',
    // replace: true,
    link: function (scope, element, attrs) {

      element.addClass('');
      
    }
  };
}]);