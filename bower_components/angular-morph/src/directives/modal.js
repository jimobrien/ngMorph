(function (angular){
  "use strict";

  angular.module('morph.directives')
  .directive('ngMorphModal', ['TemplateHandler', '$compile', 'Morph', function (TemplateHandler, $compile, Morph) {
    var isMorphed = false;

    return {
      restrict: 'A',
      scope: {
        settings: '=ngMorphModal'
      },
      link: function (scope, element, attrs) {
        
        var wrapper = angular.element('<div></div>').css('visibility', 'hidden');
        var modalSettings = scope.settings.modal;

        var compile = function (results) {
          var morphTemplate = results.data ? results.data : results;

          return $compile(morphTemplate)(scope);
        };

        var initMorphable = function (content) {
          var closeEl  = angular.element(content[0].querySelector(scope.settings.closeEl));
          var elements = {
            morphable: element,
            wrapper: wrapper,
            content: content
          };

          // create element for modal fade
          if ( scope.settings.modal.fade !== false ) {
            var fade = angular.element('<div></div>');
            elements.fade = fade;
          }

          // add to dom
          wrapper.append(content);
          element.after(wrapper);
          if ( fade ) wrapper.after(fade);
          

          // set the wrapper bg color
          wrapper.css('background', getComputedStyle(content[0]).backgroundColor);

          // get bounding rectangles
          scope.settings.MorphableBoundingRect = element[0].getBoundingClientRect();
          scope.settings.ContentBoundingRect = content[0].getBoundingClientRect();
          
          // bootstrap the modal
          var modal = new Morph('Modal', elements, scope.settings);
          
          // attach event listeners
          element.bind('click', function () {
            scope.settings.MorphableBoundingRect = element[0].getBoundingClientRect();
            isMorphed = modal.toggle(isMorphed);
          });

          if ( closeEl ) {
            closeEl.bind('click', function (event) {
              scope.settings.MorphableBoundingRect = element[0].getBoundingClientRect();
              isMorphed = modal.toggle(isMorphed);
            });
          }

          // remove event handlers when scope is destroyed
          scope.$on('$destroy', function () {
            element.unbind('click');
            closeEl.unbind('click');
          });
        };

        if ( modalSettings.template ) {
          initMorphable(compile(modalSettings.template));

        } else if ( modalSettings.templateUrl ){
          var loadContent = TemplateHandler.get(modalSettings.templateUrl);

          loadContent.then(compile)
          .then(initMorphable);

        } else {
          throw new Error('No template found.');
        }

      }
    };
  }]);
})(angular);