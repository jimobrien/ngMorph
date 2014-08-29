angular.module('morph', ['morph.transitions'])
.factory('Morph', [function () {
  return {
    modal: ModalTransition,
    overlay: OverlayTransition,
    expand: ExpandTransition
  };
}]);