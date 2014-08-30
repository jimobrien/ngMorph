angular.module('morph.transitions')
.factory('ModalTransition', ['ModalAssist', function (ModalAssist) {
  return function (elements, settings) {
    var MorphableBoundingRect = settings.MorphableBoundingRect;
    var ContentBoundingRect = settings.ContentBoundingRect;

    // set wrapper bounding rectangle
    ModalAssist.setBoundingRect(elements.wrapper, MorphableBoundingRect);
    
    // apply normal-state styles
    angular.forEach(elements, function (element, elementName) {
      ModalAssist.applyDefaultStyles(element, elementName);
    });

    return {

      toggle: function (elements, settings, isMorphed) {
        if ( !isMorphed ) {
          elements.wrapper.css({
            transition: 'none', // remove any transitions to prevent the relocation from being delayed.
            top: settings.MorphableBoundingRect.top + 'px',
            left: settings.MorphableBoundingRect.left + 'px'
          });

          setTimeout( function () {
            angular.forEach(elements, function (element, elementName) {
              ModalAssist.addClass[elementName](element, settings);
            });
          }, 25 );
        } else {
          angular.forEach(elements, function (element, elementName) {
            ModalAssist.removeClass[elementName](element, settings);
          });
        }

        return !isMorphed;
      }
    };
  };
}]);
