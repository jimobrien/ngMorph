(function (angular){
  "use strict";

  angular.module('morph.assist', [])
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
      },
      fade: {
        'display': 'none',
        'opacity': '0',
        'position': 'fixed',
        'top': '0',
        'left': '0',
        'z-index': '800',
        'width': '100%',
        'height': '100%',
        'background': 'rgba(0,0,0,0.5)',
        '-webkit-transition': 'opacity 0.5s',
        'transition': 'opacity 0.5s'
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
        if ( defaultStyles[elementName] ) element.css(defaultStyles[elementName]);
      }

    };
  }]);
})(angular);