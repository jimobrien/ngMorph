angular.module('morph.directives')
.directive('ngMorphModal', ['$http', '$templateCache', '$compile', 'Morph', function ($http, $templateCache, $compile, Morph) {
  var isMorphed = false;
  
  var postLinking = function (scope, element, attrs) {
    var loadContent = $http.get(scope.settings.template.url, { cache: $templateCache });

    var compile = function (results) {
      if ( results ) scope.morphTemplate = results.data;

      return $compile(scope.morphTemplate)(scope);    
    };

    loadContent.then(compile)
    .then( function (content) {
      var wrapper = angular.element('<div></div>').css('visibility', 'hidden');
      var closeEl = angular.element(content[0].querySelector(scope.settings.closeEl));
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

      // bootstrap modal
      var modal = Morph.modal(elements, scope.settings);

      // attach event listeners
      element.bind('click', function () {
        if ( isMorphed ) { // testing only
          angular.forEach(elements, function (element, elementName) {
            modal.removeClass(element, elementName, scope.settings);
          });
        } else {
          angular.forEach(elements, function (element, elementName) {
            modal.addClass(element, elementName, scope.settings);
          });
        }

        isMorphed = !isMorphed;
      });

      closeEl.bind('click', function (event) {
        if ( isMorphed ) {
          
          angular.forEach(elements, function (element, elementName) {
            modal.removeClass(element, elementName, scope.settings);
          });

          isMorphed = !isMorphed;
        }
      });
      
    });

  };

  return {
    restrict: 'A',
    scope: {
      // morphTemplate: '=',
      settings: '=ngMorphModal'
    },
    link: postLinking
  };
}]);