angular.module('ngMorph', [])
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
    var MorphableBoundingBox = element[0].getBoundingClientRect();
    var MorphWrapper;
    var MorphContentWrapper;
    var MorphContent;
    var ClosingEl;

    var ContentStyle = {
      'position': 'fixed',
      'z-index': '900',
      'opacity': '0',
      height: MorphableBoundingBox.height + 'px',
      width: MorphableBoundingBox.width + 'px', 
      'pointer-events': 'none',
      '-webkit-transition': 'opacity 0.3s 0.5s, width 0.4s 0.1s, height 0.4s 0.1s, top 0.4s 0.1s, left 0.4s 0.1s, margin 0.4s 0.1s',
      'transition': 'opacity 0.3s 0.5s, width 0.4s 0.1s, height 0.4s 0.1s, top 0.4s 0.1s, left 0.4s 0.1s, margin 0.4s 0.1s'
    };

    var WrapperStyle = { 
      height: MorphableBoundingBox.height + 'px',
      width: MorphableBoundingBox.width + 'px',  
      display: 'inline-block'
    };

    MorphWrapper = $compile('<morph-wrapper />')(scope);
    MorphContentWrapper = $compile('<morph-content template="{{template}}">')(scope);
    MorphContent = angular.element(MorphContentWrapper[0].children[0]);
    window.mc = MorphContent[0];

    MorphWrapper.css(WrapperStyle);
    MorphContentWrapper.css(ContentStyle);

    Morphable.css({
      'z-index': '1000',
      'width': '100%',
      'height': '100%',
      'outline': 'none',
      '-webkit-transition': 'opacity 0.1s 0.5s',
      'transition': 'opacity 0.1s 0.5s'
    });

    Morphable.wrap(MorphWrapper);
    Morphable.after(MorphContentWrapper);



    Morphable.bind('click', function () {
      if ( !isMorphed ) {
        setTimeout( function() {
          MorphContentWrapper[0].style.left = MorphableBoundingBox.left + 'px';
          MorphContentWrapper[0].style.top = MorphableBoundingBox.top + 'px';

          setTimeout( function() {
            MorphContentWrapper[0].style.width = 400 + 'px';
            MorphContentWrapper[0].style.height = 400 + 'px';

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
              margin: '-200px 0 0-200px',
              '-webkit-transition': 'width 0.4s 0.1s, height 0.4s 0.1s, top 0.4s 0.1s, left 0.4s 0.1s, margin 0.4s 0.1s',
              'transition': 'width 0.4s 0.1s, height 0.4s 0.1s, top 0.4s 0.1s, left 0.4s 0.1s, margin 0.4s 0.1s'
            });

            MorphContent.css({
              'transition': 'opacity 0.3s 0.3s',
              'visibility': 'visible',
              'height': 'auto',
              'opacity': '1'
            });

          }, 25);

        }, 25);
        

      } else {
        setTimeout( function () {
          MorphWrapper.css(WrapperStyle);
          MorphContentWrapper.css({
            margin: 0,
            top: MorphableBoundingBox.top + 'px',
            left: MorphableBoundingBox.left + 'px'
          });
          MorphContentWrapper.css(ContentStyle);
          MorphContent.css({
            'transition': 'opacity 0.3s 0.3s',
            '-webkit-transition': 'opacity 0.1s 0.5s',
            'visibility': 'hidden',
            'height': '0',
            'opacity': '0'
          });
          Morphable.css({
            'z-index': '1000',
            'opacity': 1,
            '-webkit-transition': 'opacity 0.1s 0.5s',
            'transition': 'opacity 0.1s 0.5s'
          });
        }, 25);
      }

      isMorphed = !isMorphed;
    });

    if ( scope.settings.closingEl ) {
      // set up closing bind
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
    
      var content = $compile(attrs.template)(scope);

      content.css({
        'visibility': 'hidden',
        'height': '0',
        'opacity': '0',
        '-webkit-transition': 'opacity 0.1s, visibility 0s 0.1s, height 0s 0.1s',
        'transition': 'opacity 0.1s, visibility 0s 0.1s, height 0s 0.1s'
      });

      element.append(content);

    }
  }; 
}])
.directive('morphWrapper', [function () {
  return {
    restrict: 'E',
    // template: '<div class="morph-button morph-button-modal morph-button-modal-2 morph-button-fixed"></div>',
    // replace: true,
    link: function (scope, element, attrs) {

      element.addClass('');
      
    }
  };
}]);