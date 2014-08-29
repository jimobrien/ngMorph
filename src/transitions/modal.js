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
      addClass: function (element, elementName, settings) {
        ModalAssist.addClass[elementName](element, settings);
      },

      removeClass: function (element, elementName, settings) {
        ModalAssist.removeClass[elementName](element, settings);
      }
    };
  };
}]);
