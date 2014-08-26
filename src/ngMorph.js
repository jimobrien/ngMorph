angular.module('ngMorph', ['ngAnimate'])
.animation('.ng-morphable', [function () {
  
}])
.animation('.ng-morph-wrapper', [function () {
  
}])
.animation('.ng-morph-content', [function () {
  
}])
.directive('morphable', ['$compile', function ($compile) {
 return {
  restrict: 'A',
  scope: {
    template: '=',
    settings: '=morphable'
  },
  link: function (scope, element, attrs) {
    var isMorphed = false;
    var Morphable = element;
    var MorphableBoundingBox = Morphable[0].getBoundingClientRect();
    var MorphContentWrapper;
    var MorphContent;
    var MorphContentBoundingBox;
    var ClosingEl;

    var ContentStyle = {
      'position': 'fixed',
      'z-index': '900',
      'opacity': '0',
      margin: 0,
      top: MorphableBoundingBox.top + 'px',
      left: MorphableBoundingBox.left + 'px',
      height: MorphableBoundingBox.height + 'px',
      width: MorphableBoundingBox.width + 'px', 
      'pointer-events': 'none',
      '-webkit-transition': 'opacity 0.3s 0.5s, width 0.4s 0.1s, height 0.4s 0.1s, top 0.4s 0.1s, left 0.4s 0.1s, margin 0.4s 0.1s',
      'transition': 'opacity 0.3s 0.5s, width 0.4s 0.1s, height 0.4s 0.1s, top 0.4s 0.1s, left 0.4s 0.1s, margin 0.4s 0.1s'
    };

    MorphContentWrapper = $compile('<morph-content template="{{template}}">')(scope);
    MorphContent = angular.element(MorphContentWrapper[0].children[0]);

    Morphable.after(MorphContentWrapper);
    MorphContentBoundingBox = MorphContent[0].getBoundingClientRect();

    Morphable.css({
      'z-index': '1000',
      'outline': 'none',
      '-webkit-transition': 'opacity 0.1s 0.5s',
      'transition': 'opacity 0.1s 0.5s'
    });

    MorphContentWrapper.css(ContentStyle);

    Morphable.bind('click', function () {
      if ( !isMorphed ) {
        MorphContentWrapper[0].style.left = MorphableBoundingBox.left + 'px';
        MorphContentWrapper[0].style.top = MorphableBoundingBox.top + 'px';

        setTimeout( function() {
          MorphContentWrapper[0].style.width = MorphContentBoundingBox.width + 'px';
          MorphContentWrapper[0].style.height = MorphContentBoundingBox.height + 'px';

          Morphable.css({
            'z-index': 2000,
            'opacity': 0,
            '-webkit-transition': 'opacity 0.1s',
            'transition': 'opacity 0.1s',
          });

          MorphContentWrapper.css({
            'z-index': 1900,
            'opacity': 1,
            'background': '#e75854',
            'pointer-events': 'auto',
            top: '50%',
            left: '50%',
            'margin': '-' + ( MorphContentBoundingBox.height / 2 ) + 'px 0 0 -' + ( MorphContentBoundingBox.width / 2 ) + 'px',
            '-webkit-transition': 'width 0.4s 0.1s, height 0.4s 0.1s, top 0.4s 0.1s, left 0.4s 0.1s, margin 0.4s 0.1s',
            'transition': 'width 0.4s 0.1s, height 0.4s 0.1s, top 0.4s 0.1s, left 0.4s 0.1s, margin 0.4s 0.1s'
          });
          console.log('-' + ( MorphContentBoundingBox.height / 2 ) + 'px 0 0 -' + ( MorphContentBoundingBox.width / 2 ) + 'px');

          MorphContent.css({
            'transition': 'opacity 0.3s 0.4s ease',
            'visibility': 'visible',
            'opacity': '1'
          });

        }, 25);

      } else {

          MorphContentWrapper.css(ContentStyle);

          MorphContent.css({
            'transition': 'opacity 0.3s 0.3s ease',
            '-webkit-transition': 'opacity 0.3s 0.3s ease',
            'height': '0',
            'opacity': '0',
          });

          // setting visibility hidden in the above css() call results in the content being hidden too soon
          setTimeout( function () {
            MorphContent.css('visibility', 'hidden');
          }, 100);

          Morphable.css({
            'z-index': '1000',
            'opacity': 1,
            '-webkit-transition': 'opacity 0.1s 0.5s',
            'transition': 'opacity 0.1s 0.5s'
          });
      }

      isMorphed = !isMorphed;
    });

    if ( scope.settings.closingEl ) {
      var ClosingElement = MorphContentWrapper[0].querySelector(scope.settings.closingEl);
      var $ClosingElement = angular.element(ClosingElement);

      $ClosingElement.bind('click', function () {
        if ( isMorphed ) {
          MorphContentWrapper.css(ContentStyle);

          MorphContent.css({
            'transition': 'opacity 0.3s 0.3s ease',
            '-webkit-transition': 'opacity 0.3s 0.3s ease',
            'height': '0',
            'opacity': '0',
          });

          // setting visibility hidden in the above css() call results in the content being hidden too soon
          setTimeout( function () {
            MorphContent.css('visibility', 'hidden');
          }, 100);

          Morphable.css({
            'z-index': '1000',
            'opacity': 1,
            '-webkit-transition': 'opacity 0.1s 0.5s',
            'transition': 'opacity 0.1s 0.5s'
          });
        } else {
          return;
        }
      });
    }

  }
 };
}])
.directive('morphContent', ['$compile', function ($compile) {
  return {
    restrict: 'E',
    template: '<div></div>',
    replace: true,
    link: function (scope, element, attrs) {
        console.log(attrs.template);
      var content = $compile(attrs.template)(scope);

      content.css({
        'visibility': 'hidden',
        'opacity': '0',
        '-webkit-transition': 'opacity 0.1s, visibility 0s 0.1s, height 0s 0.1s',
        'transition': 'opacity 0.1s, visibility 0s 0.1s, height 0s 0.1s'
      });

      element.append(content);

    }
  }; 
}]);