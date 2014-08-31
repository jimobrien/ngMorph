angular.module('morph.directives')
.directive('ngMorphOverlay', ['$http', '$templateCache', '$compile', 'Morph', function ($http, $templateCache, $compile, Morph) {
  var isMorphed = false;

  return {
    restrict: 'A',
    scope: {
      settings: '=ngMorphOverlay'
    },
    link: function (scope, element, attrs) {
      var wrapper = angular.element('<div></div>').css('visibility', 'hidden');
      var overlaySettings = scope.settings.overlay;

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

        wrapper.append(content);
        element.after(wrapper);

        // set the wrapper bg color
        wrapper.css('background', getComputedStyle(content[0]).backgroundColor);

        // get bounding rectangles
        scope.settings.MorphableBoundingRect =0 element[0].getBoundingClientRect();
        scope.settings.ContentBoundingRect = content[0].getBoundingClientRect();
        
        // bootstrap the overlay
        var overlay = new Morph('Overlay', elements, scope.settings);
        
        // attach event listeners
        element.bind('click', function () {
          scope.settings.MorphableBoundingRect = element[0].getBoundingClientRect();
          isMorphed = overlay.toggle(isMorphed);
        });

        if ( closeEl ) {
          closeEl.bind('click', function (event) {
            scope.settings.MorphableBoundingRect = element[0].getBoundingClientRect();
            isMorphed = overlay.toggle(isMorphed);
          });
        }

        // remove event handlers when scope is destroyed
        scope.$on('$destroy', function () {
          element.unbind('click');
          closeEl.unbind('click');
        });
      };

      if ( overlaySettings.template ) {
        initMorphable(compile(overlaySettings.template));

      } else if ( overlaySettings.templateUrl ){
        var loadContent = $http.get(overlaySettings.templateUrl, { cache: $templateCache });

        loadContent.then(compile)
        .then(initMorphable);

      } else {
        throw new Error('No template found.');
      }

    }
  };
}]);