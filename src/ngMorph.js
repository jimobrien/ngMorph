angular.module('ngMorph', [])
.factory('MorphEngine', [function () {
  var transEndEventNames = {
      'WebkitTransition': 'webkitTransitionEnd',
      'MozTransition': 'transitionend',
      'OTransition': 'oTransitionEnd',
      'msTransition': 'MSTransitionEnd',
      'transition': 'transitionend'
    },
    transEndEventName = transEndEventNames[ Modernizr.prefixed( 'transition' ) ],
    support = { transitions : Modernizr.csstransitions };

  function UIMorphingButton(wrapper, morphable, morphInto, options) {
    this.el = wrapper[0];
    this.element = morphable[0];
    this.contentEl = morphInto[0];
    this.options = angular.extend( {}, this.options );
    angular.extend( this.options, options );
    this._init();
  }

  UIMorphingButton.prototype.options = {
    closeEl : '',
    onBeforeOpen : function() { return false; },
    onAfterOpen : function() { return false; },
    onBeforeClose : function() { return false; },
    onAfterClose : function() { return false; }
  };

  UIMorphingButton.prototype._init = function() {
    // the element
    // this.element = this.el.querySelector( 'button' );
    // state
    this.expanded = false;
    // content el
    // this.contentEl = document.querySelector( '.morph-content' );

    // init events
    this._initEvents();
  };

  UIMorphingButton.prototype._initEvents = function() {
    var self = this;
    // open
    this.element.addEventListener( 'click', function() { self.toggle(); } );
    // close
    if( this.options.closeEl !== '' ) {
      var closeEl = this.el.querySelector( this.options.closeEl );
      if( closeEl ) {
        closeEl.addEventListener( 'click', function() { self.toggle(); } );
      }
    }
  };

  UIMorphingButton.prototype.toggle = function() {
    if( this.isAnimating ) return false;

    // callback
    if( this.expanded ) {
      this.options.onBeforeClose();
    } else {
      // add class active (solves z-index problem when more than one button is in the page)
      // classie.addClass( this.el, 'active' ); // replace with jquery
      angular.element(this.el).addClass('active');
      this.options.onBeforeOpen();
    }

    this.isAnimating = true;

    var self = this;
    var onEndTransitionFn = function( ev ) {
        if( ev.target !== this ) return false;

        if( support.transitions ) {
          // open: first opacity then width/height/left/top
          // close: first width/height/left/top then opacity
          if( self.expanded && ev.propertyName !== 'opacity' || !self.expanded && ev.propertyName !== 'width' && ev.propertyName !== 'height' && ev.propertyName !== 'left' && ev.propertyName !== 'top' ) {
            return false;
          }
          this.removeEventListener( transEndEventName, onEndTransitionFn );
        }
        self.isAnimating = false;
        
        // callback
        if( self.expanded ) {
          // remove class active (after closing)
          // classie.removeClass( self.el, 'active' );
          angular.element(self.el).removeClass('active');
          self.options.onAfterClose();
        }
        else {
          self.options.onAfterOpen();
        }

        self.expanded = !self.expanded;
    };

    if( support.transitions ) {
      this.contentEl.addEventListener( transEndEventName, onEndTransitionFn );
    }
    else {
      onEndTransitionFn();
    }
      
    // set the left and top values of the contentEl (same like the button)
    var elementPos = this.element.getBoundingClientRect();
    // need to reset
    // angular.element(this.contentEl).addClass('no-transition');
    
    this.contentEl.style.left = 'auto';
    this.contentEl.style.top = 'auto';
    
    // add/remove class "open" to the button wraper
    setTimeout( function() { 

      self.contentEl.style.left = elementPos.left + 'px';
      self.contentEl.style.top = elementPos.top + 'px';
      
      if( self.expanded ) {
        angular.element(self.contentEl).removeClass('no-transition');
        angular.element(self.el).removeClass('open');
      } else {
        setTimeout( function() {
          angular.element(self.contentEl).removeClass('no-transition');
          angular.element(self.el).addClass('open');


          angular.element(self.contentEl).removeClass('no-transition');
          angular.element(self.el).addClass('open');
        }, 25 );
      }
    }, 25 );
  };

  return {
    init: function (morphWrapper, morphable, morphContent, options) {
      return new UIMorphingButton(morphWrapper, morphable, morphContent, options);
    }
  };

}])
.directive('morphable', ['$compile', 'MorphEngine', function ($compile, MorphEngine) {
 return {
  restrict: 'A',
  // template: '<div ng-transclude><morph-content template="{{template}}"/></div>',
  scope: {
    template: '='
  },
  link: function (scope, element, attrs) {

    var settings = scope.settings;
    var morphWrapper;
    var morphContent;
    
    scope.originDimensions = element[0].getBoundingClientRect();

    scope.contentStyle = {
      height: scope.originDimensions.height + 'px',
      width: scope.originDimensions.width + 'px',      
    };

    scope.wrapperCfg = { 
      height: scope.originDimensions.height + 'px',
      width: scope.originDimensions.width + 'px',  
      display: 'inline-block'
    };

    morphWrapper = $compile('<morph-wrapper />')(scope);
    morphContent = $compile('<morph-content template="{{template}}">')(scope);
    morphContent.css(scope.contentStyle);

    element.wrap(morphWrapper);
    element.after(morphContent);

    var me = MorphEngine.init(morphWrapper, element, morphContent);


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
        // element.css({
        //   height: scope.originDimensions.height + 'px',
        //   width: scope.originDimensions.width + 'px'
        // });
        
        element.append(innerContent);

    }
  }; 
}])
.directive('morphWrapper', [function () {
  return {
    restrict: 'E',
    link: function (scope, element, attrs) {
      element.css({
        width: scope.originDimensions.width + 'px',
        height: scope.originDimensions.height + 'px',
        display: 'inline-block'
      });

      element.addClass('morph-button morph-button-modal morph-button-modal-2 morph-button-fixed');
      
    }
  };
}]);