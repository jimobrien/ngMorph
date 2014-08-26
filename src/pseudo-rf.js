angular.module('ngMorph', [])
.directive('ngMorphable', function () {
  return {
    scope: {
      morph: '='
    },
    template: '<ng-morph-content template="{{template}}"/>',
    link: function(scope, ele, attrs, ctrl) {

    }
  }
})
.animation('.ng-morph', function () {
  return {
    enter: function () {

    },
    leave: function () {
      
    }
  }
})

// <button class="ng-morph" morph-into="loginForm"> Log In </button>