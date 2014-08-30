angular.module('morph.directives')
.directive('ngMorphModal', ['$http', '$templateCache', '$compile', 'Morph', function ($http, $templateCache, $compile, Morph) {
  var isMorphed = false;

  return {
    restrict: 'A',
    scope: {
      settings: '=ngMorphModal'
    },
    link: function (scope, element, attrs) {
      var loadContent = $http.get(scope.settings.template.url, { cache: $templateCache });
      var wrapper     = angular.element('<div></div>').css('visibility', 'hidden');

      var compile = function (results) {
        if ( results ) scope.morphTemplate = results.data;

        return $compile(scope.morphTemplate)(scope);    
      };

      loadContent.then(compile)
      .then( function (content) {
        var closeEl  = angular.element(content[0].querySelector(scope.settings.closeEl));
        var elements = {
          morphable: element,
          wrapper: wrapper,
          content: content
        };

        // add to dom
        wrapper.append(content);
        element.after(wrapper);

        // get bounding rectangles
        scope.settings.MorphableBoundingRect = element[0].getBoundingClientRect();
        scope.settings.ContentBoundingRect = content[0].getBoundingClientRect();
        
        // bootstrap the modal
        var modal = Morph.modal(elements, scope.settings);
        
        // attach event listeners
        element.bind('click', function () {
          scope.settings.MorphableBoundingRect = element[0].getBoundingClientRect();
          isMorphed = modal.toggle(elements, scope.settings, isMorphed);
        });

        if ( closeEl ) {
          closeEl.bind('click', function (event) {
            scope.settings.MorphableBoundingRect = element[0].getBoundingClientRect();
            isMorphed = modal.toggle(elements, scope.settings, isMorphed);
          });
        }

        // remove event handlers when scope is destroyed
        scope.$on('$destroy', function () {
          element.unbind('click');
          closeEl.unbind('click');
        });
      });

    }
  };
}]);