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
    this.contentEl = document.querySelector( '.morph-content' );
    console.log(this.contentEl);
    // init events
    this._initEvents();
  };

  UIMorphingButton.prototype._initEvents = function() {
    var self = this;
    // open
    this.button.addEventListener( 'click', function() { self.toggle(); } );
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
    }
    else {
      // add class active (solves z-index problem when more than one button is in the page)
      // classie.addClass( this.el, 'active' ); // replace with jquery
      $(this.el).addClass('active');
      this.options.onBeforeOpen();
    }

    this.isAnimating = true;

    var self = this,
      onEndTransitionFn = function( ev ) {
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
          $(self.el).removeClass('active');
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
    var buttonPos = this.button.getBoundingClientRect();
    // need to reset
    // classie.addClass( this.contentEl, 'no-transition' );
    $(this.contentEl).addClass('no-transition');
    this.contentEl.style.left = 'auto';
    this.contentEl.style.top = 'auto';
    
    // add/remove class "open" to the button wraper
    setTimeout( function() { 
      self.contentEl.style.left = buttonPos.left + 'px';
      self.contentEl.style.top = buttonPos.top + 'px';
      
      if( self.expanded ) {
        // classie.removeClass( self.contentEl, 'no-transition' );
        // classie.removeClass( self.el, 'open' );
        $(self.contentEl).removeClass('no-transition');
        $(self.el).removeClass('open');
      }
      else {
        setTimeout( function() {
          $(self.contentEl).removeClass('no-transition');
          $(self.el).addClass('open');
          // classie.removeClass( self.contentEl, 'no-transition' );
          // classie.addClass( self.el, 'open' ); 

          $(self.contentEl).removeClass('no-transition');
          $(self.el).addClass('open');
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
.directive('morphable', ['$compile', function ($compile) {
 return {
  link: function () {
    
  }
 };
}])
.directive('morphContent', ['$compile', function ($compile) {
 
}])
.directive('morphWrapper', ['MorphEngine', function (MorphEngine) {

}]);