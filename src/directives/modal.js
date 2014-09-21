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