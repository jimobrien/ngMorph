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