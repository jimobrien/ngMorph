(function (angular){
  "use strict";
  
  angular.module('morph.transitions', ['morph.assist'])
  .factory('Transitions', ['Modal', 'Overlay', function (Modal, Overlay) {
    return {
      Modal: Modal,
      Overlay: Overlay
    };
  }]);
})(angular);
(function (angular){
  "use strict";

  angular.module('morph.transitions')
  .factory('Modal', [ function () {
    return function (elements, settings) {
      var enter = {
        wrapper: function (element, settings) {
          var ContentBoundingRect = settings.ContentBoundingRect;
          var modalSettings = settings.modal;
          var top = '50%';
          var left = '50%';
          var margin = 0;

          if ( !modalSettings.position || modalSettings.position === 'center' ) {
            margin = '-' + ( ContentBoundingRect.height / 2 ) + 'px 0 0 -' + ( ContentBoundingRect.width / 2 ) + 'px';
          }

          if ( typeof modalSettings.position === 'object' ) {
            top = modalSettings.position.top + '';
            left = modalSettings.position.left + '';

            // set default units if none provided
            if ( top.indexOf('%') < 0 && top.indexOf('px') < 0 ) {
              top += '%';
            }

            if ( left.indexOf('%') < 0 && left.indexOf('px') < 0 ) {
              left += '%';
            }
          }


          element.css({
            'z-index': 1900,
            'opacity': 1,
            'visibility': 'visible',
            'pointer-events': 'auto',
            'top': top,
            'left': left,
            'width': ContentBoundingRect.width + 'px',
            'height': ContentBoundingRect.height + 'px', 
            'margin': margin,
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
        fade: function (element) {
          element.css({
            'display': 'block'
          });
          setTimeout(function() {
            element.css({
              'opacity': '1'
            });
          }, 25);
        }
      };

      var exit = {
        wrapper: function (element, settings) {
          var MorphableBoundingRect = settings.MorphableBoundingRect;
          
          element.css({
            'position': 'fixed',
            'z-index': '900',
            'opacity': '0',
            'margin': 0,
            'top': MorphableBoundingRect.top + 'px',
            'left': MorphableBoundingRect.left + 'px',
            'width': MorphableBoundingRect.width + 'px', 
            'height': MorphableBoundingRect.height + 'px',
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
        fade: function (element) {
          element.css({
            'opacity': '0'
          });
          setTimeout(function() {
            element.css({
              'display': 'none'
            });
          }, 525);
        }
      };

      return {

        toggle: function (isMorphed) {
          if ( !isMorphed ) {
            elements.wrapper.css({
              transition: 'none', // remove any transitions to prevent the relocation from being delayed.
              top: settings.MorphableBoundingRect.top + 'px',
              left: settings.MorphableBoundingRect.left + 'px'
            });

            // wrap in timeout to allow relocation to finish. transition styles are added too soon without this.
            setTimeout( function () {
              angular.forEach(elements, function (element, elementName) {
                enter[elementName](element, settings);
              });
            }, 25 );
          } else {
            angular.forEach(elements, function (element, elementName) {
              exit[elementName](element, settings);
            });
          }

          return !isMorphed;
        }
      };
    };
  }]);

})(angular);
(function (angular){
  "use strict";
  angular.module('morph.transitions')
  .factory('Expand', [ function () {
    // TODO
  }]);
})(angular);
(function (angular){
  "use strict";

  angular.module('morph.transitions')
  .factory('Overlay', [ function () {
    return function (elements, settings) {
      var enter = {
        wrapper: function (element, settings) {
          element.css({
            'z-index': 1900,
            'opacity': 1,
            'visibility': 'visible',
            'pointer-events': 'auto',
            'top': '0',
            'left': '0',
            'width': '100%',
            'height': '100%',
            '-webkit-transition': 'width 0.4s 0.1s, height 0.4s 0.1s, top 0.4s 0.1s, left 0.4s 0.1s, margin 0.4s 0.1s',
            'transition': 'width 0.4s 0.1s, height 0.4s 0.1s, top 0.4s 0.1s, left 0.4s 0.1s, margin 0.4s 0.1s'
          });

          // add vertical scrollbar once full-screen.
          // TODO: add before/after animation hooks.
          if ( settings.overlay.scroll !== false ) {
            setTimeout( function () {
              element.css({'overflow-y': 'scroll'});
            }, 500);
          }
          
        },
        content: function (element, settings) {
          element.css({
            'transition': 'opacity 0.3s 0.5s ease',
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
      };

      var exit = {
        wrapper: function (element, settings) {
          var MorphableBoundingRect = settings.MorphableBoundingRect;
          setTimeout( function () {
            element.css({
              'overflow': 'hidden',
              'position': 'fixed',
              'z-index': '900',
              'opacity': '0',
              'margin': 0,
              'top': MorphableBoundingRect.top + 'px',
              'left': MorphableBoundingRect.left + 'px',
              'width': MorphableBoundingRect.width + 'px', 
              'height': MorphableBoundingRect.height + 'px',
              'pointer-events': 'none',
              '-webkit-transition': 'opacity 0.3s 0.5s, width 0.35s 0.1s, height 0.35s 0.1s, top 0.35s 0.1s, left 0.35s 0.1s, margin 0.35s 0.1s',
              'transition': 'opacity 0.3s 0.5s, width 0.35s 0.1s, height 0.35s 0.1s, top 0.35s 0.1s, left 0.35s 0.1s, margin 0.35s 0.1s'
            });
          }, 100);
        },
        content: function (element, settings) {
          element.css({
            'transition': 'opacity 0.22s ease',
            '-webkit-transition': 'opacity 0.22s ease',         
            'height': '0',
            'opacity': '0'
          });

          setTimeout( function () {
            element.css({'visibility': 'hidden'});
          }, 70);

        },
        morphable: function (element, settings) {
          element.css({
            'z-index': 900,
            'opacity': 1,
            '-webkit-transition': 'opacity 0.1s 0.3s',
            'transition': 'opacity 0.1s 0.3s',
          });
        },
      };

      return {
        toggle: function (isMorphed) {
          if ( !isMorphed ) {
            elements.wrapper.css({
              transition: 'none', // remove any transitions to prevent the relocation from being delayed.
              top: settings.MorphableBoundingRect.top + 'px',
              left: settings.MorphableBoundingRect.left + 'px'
            });

            // wrap in timeout to allow relocation to finish. transition styles are added too soon without this.
            setTimeout( function () {
              angular.forEach(elements, function (element, elementName) {
                enter[elementName](element, settings);
              });
            }, 25 );
          } else {
            angular.forEach(elements, function (element, elementName) {
              exit[elementName](element, settings);
            });
          }

          return !isMorphed;
        }
      };
    };
  }]);
})(angular);
(function (angular){
  "use strict";

  angular.module('morph.directives', ['morph']);
  
})(angular);
(function (angular){
  "use strict";

  angular.module('morph.directives')
  .directive('ngMorphModal', ['TemplateHandler', '$compile', 'Morph', function (TemplateHandler, $compile, Morph) {
    return {
      restrict: 'A',
      scope: true,
      link: function (scope, element, attrs) {
        var wrapper = angular.element('<div></div>').css('visibility', 'hidden');
        var settings = scope[attrs.ngMorphModal];
        var isMorphed = false;

        var compile = function (results) {
          var morphTemplate = results.data ? results.data : results;
          return $compile(morphTemplate)(scope);
        };

        var initMorphable = function (content) {
          var closeEl  = angular.element(content[0].querySelector(settings.closeEl));
          var elements = {
            morphable: element,
            wrapper: wrapper,
            content: content
          };

          // create element for modal fade
          if (settings.modal.fade !== false) {
            var fade = angular.element('<div></div>');
            elements.fade = fade;
          }

          // add to dom
          wrapper.append(content);
          element.after(wrapper);
          if (fade) wrapper.after(fade);
          
          // set the wrapper bg color
          wrapper.css('background', getComputedStyle(content[0]).backgroundColor);

          // get bounding rectangles
          settings.MorphableBoundingRect = element[0].getBoundingClientRect();
          settings.ContentBoundingRect = content[0].getBoundingClientRect();
          
          // bootstrap the modal
          var modal = new Morph('Modal', elements, settings);
          
          // attach event listeners
          element.bind('click', function () {
            settings.MorphableBoundingRect = element[0].getBoundingClientRect();
            isMorphed = modal.toggle(isMorphed);
          });

          if (closeEl) {
            closeEl.bind('click', function (event) {
              settings.MorphableBoundingRect = element[0].getBoundingClientRect();
              isMorphed = modal.toggle(isMorphed);
            });
          }

          // remove event handlers when scope is destroyed
          scope.$on('$destroy', function () {
            element.unbind('click');
            closeEl.unbind('click');
          });
        };

        if (settings.modal.template) {
          initMorphable(compile(settings.modal.template));
        } else if (settings.modal.templateUrl) {
          TemplateHandler
            .get(settings.modal.templateUrl)
            .then(compile)
            .then(initMorphable);
        } else {
          throw new Error('No template found.');
        }

      }
    };
  }]);
})(angular);
(function (angular){
  "use strict";
  
  angular.module('morph.directives')
  .directive('ngMorphOverlay', ['$compile', 'TemplateHandler', 'Morph', function ($compile, TemplateHandler, Morph) {

    return {
      restrict: 'A',
      scope: true,
      link: function (scope, element, attrs) {
        var wrapper = angular.element('<div></div>').css('visibility', 'hidden');
        var settings = scope[attrs.ngMorphOverlay];
        var isMorphed = false;

        var compile = function (results) {
          var morphTemplate = results.data ? results.data : results;
          return $compile(morphTemplate)(scope);
        };

        var initMorphable = function (content) {
          var closeEl  = angular.element(content[0].querySelector(settings.closeEl));
          var elements = {
            morphable: element,
            wrapper: wrapper,
            content: content
          };

          // add to dom
          wrapper.append(content);
          element.after(wrapper);

          // set the wrapper bg color
          wrapper.css('background', getComputedStyle(content[0]).backgroundColor);

          // get bounding rectangles
          settings.MorphableBoundingRect = element[0].getBoundingClientRect();
          settings.ContentBoundingRect = content[0].getBoundingClientRect();
          
          // bootstrap the overlay
          var overlay = new Morph('Overlay', elements, settings);
          
          // attach event listeners
          element.bind('click', function () {
            settings.MorphableBoundingRect = element[0].getBoundingClientRect();
            isMorphed = overlay.toggle(isMorphed);
          });

          if (closeEl) {
            closeEl.bind('click', function (event) {
              settings.MorphableBoundingRect = element[0].getBoundingClientRect();
              isMorphed = overlay.toggle(isMorphed);
            });
          }

          // remove event handlers when scope is destroyed
          scope.$on('$destroy', function () {
            element.unbind('click');
            closeEl.unbind('click');
          });
        };

        if (settings.overlay.template) {
          initMorphable(compile(settings.overlay.template));
        } else if (settings.overlay.templateUrl) {
          TemplateHandler
            .get(settings.overlay.templateUrl)
            .then(compile)
            .then(initMorphable);
        } else {
          throw new Error('No template found.');
        }

      }
    };
  }]);
})(angular);
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
(function (angular){
  "use strict";

  angular.module('morph', [
    'morph.transitions', 
    'morph.assist'
  ])
  .factory('Morph', ['Transitions', 'Assist', function (Transitions, Assist) {

    return function (transition, elements, settings) {
      var MorphableBoundingRect = settings.MorphableBoundingRect;

      // set wrapper bounding rectangle
      Assist.setBoundingRect(elements.wrapper, MorphableBoundingRect);
      
      // apply normal-state styles
      angular.forEach(elements, function (element, elementName) {
        Assist.applyDefaultStyles(element, elementName);
      });

      return Transitions[transition](elements, settings);
    };
  }])
  .factory('TemplateHandler', ['$http', '$templateCache', function ($http, $templateCache) {
    return {
      get: function (path) {
        return $http.get(path, { cache: $templateCache });
      }
    };
  }]);
})(angular);
(function (angular){
  "use strict";

  angular.module('ngMorph', [
    'morph.directives',
    'morph'
  ]);

})(angular);