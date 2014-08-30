angular.module('morph.transitions', ['morph.assist'])
.factory('Transitions', ['Modal', function (Modal) {
  return {
    Modal: Modal 
  };
}]);