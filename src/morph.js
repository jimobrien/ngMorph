angular.module('morph', ['morph.transitions'])
.factory('Morph', ['ModalTransition', function (ModalTransition) {
  return {
    modal: ModalTransition,
    // overlay: OverlayTransition,
    // expand: ExpandTransition
  };
}]);