describe('Overlay Transition', function(){

  var tpl = '<div width="width:400px; height: 400px; background:black;display:block;"> <h1> Test Content </h1> </div>';

  beforeEach(module('morph'));
  beforeEach(module('morph.directives'));

  beforeEach(inject(function ($rootScope){
    $rootScope.settings = {
      overlay: {
        template: tpl
      }
    };
    $rootScope.$digest();

  }));

  // basic overlay functionality tests
  it('should compile a template', function(){
    inject(function ($compile, $document, $rootScope, $rootElement) {
      var morphable = $compile('<div><button ng-morph-overlay="settings"> Test </button></div>')($rootScope); 

      $rootElement.append(morphable);
      angular.element($document[0].body).append($rootElement);

      var content = angular.element($document[0].body).find('div')[2];

      expect(content.children.length).to.be(1);

    });
  });

  it('should open overlay when directive element is clicked', function() {
    inject(function ($compile, $document, $rootScope, $rootElement) {
      var morphable = $compile('<div><button ng-morph-overlay="settings"> Test </button></div>')($rootScope);

      $rootElement.append(morphable);
      angular.element($document[0].body).append($rootElement);
      runs(function() {
        morphable.find("button")[0].click();
      });

      waitsFor(function() {
        return getComputedStyle(morphable.find("div")[0], null).opacity === "1";
      }, "wrapper should be visible to user", 35);
    });
  });

  it('should close overlay when closeEl is clicked', function() {
    inject(function ($compile, $document, $rootScope, $rootElement) {
      var tplWithCloseEl = '<div background:black;display:block;"> <span class="close-x">x</span> <h1> Test Content </h1> </div>';
     
      $rootScope.settings = {
        closeEl: ".close-x",
        trigger: 'click',
        overlay: {
          template: tplWithCloseEl
        }
      };

      var morphable = $compile('<div><button ng-morph-overlay="settings"> Test </button></div>')($rootScope);

      $rootElement.append(morphable);
      angular.element($document[0].body).append($rootElement);
      runs(function() {
        morphable.find("button")[0].click();
      });

      waitsFor(function() {
        return getComputedStyle(morphable.find("div")[0], null).opacity === "1";
      }, "wrapper should be visible to user", 35);

      runs(function() {
        morphable.children(".close-x")[0].click();
      });

      waitsFor(function() {
        return getComputedStyle(morphable.find("div")[0], null).opacity === '0' ;
      }, "wrapper should be hidden to user", 850);
    });
  });

  // nested morphable tests
  it('should compile a template containing a nested overlay morphable', function () {
    inject(function ($compile, $document, $rootScope, $rootElement) {
      var tplContainingMorphable = '<div style="background:black;display:block;"> <button ng-morph-overlay="nestedOverlaySettings"> Nested Morphable </button></div>';
      var nestedOverlayTpl = '<div id="nested-overlay" style="background:black;display:block;"> <span class="close-x">x</span></div>';
      
      $rootScope.overlaySettings = {
        closeEl: ".close-x",
        trigger: 'click',
        overlay: {
          template: tplContainingMorphable
        }
      };

      $rootScope.nestedOverlaySettings = {
        closeEl: ".close-x",
        trigger: 'click',
        overlay: {
          template: nestedOverlayTpl
        }
      };

      var morphable = $compile('<div><button ng-morph-overlay="overlaySettings"> Test </button></div>')($rootScope);

      $rootElement.append(morphable);
      angular.element($document[0].body).append($rootElement);

      runs(function() {
        morphable.find("button")[0].click();
      });

      expect(morphable[0].querySelector("#nested-overlay").childNodes.length).to.be(2);
    });
  });

  it('should open an overlay when a nested directive element is clicked', function () {
    inject(function ($compile, $document, $rootScope, $rootElement) {
      var tplContainingMorphable = '<div id="tpl-containing-morphable" width="width:400px; height: 400px; background:black;display:block;"> <button ng-morph-overlay="nestedOverlaySettings"> Nested Morphable </button></div>';
      var nestedOverlayTpl = '<div id="nested-overlay" width="width:400px; height: 400px; background:black;display:block;"> <span class="close-x">x</span></div>';
      
      $rootScope.overlaySettings = {
        closeEl: ".close-x",
        trigger: 'click',
        overlay: {
          template: tplContainingMorphable
        }
      };

      $rootScope.nestedOverlaySettings = {
        closeEl: ".close-x",
        trigger: 'click',
        overlay: {
          template: nestedOverlayTpl
        }
      };

      var morphable = $compile('<div><button ng-morph-overlay="overlaySettings"> Test </button></div>')($rootScope);

      $rootElement.append(morphable);
      angular.element($document[0].body).append($rootElement);

      // open first overlay
      runs(function() {
        morphable.find("button")[0].click();
      });

      waitsFor(function() {
        return getComputedStyle(morphable.find("div")[0], null).opacity === "1";
      }, "wrapper should be visible to user", 35);

      // open nested overlay
      runs(function() {
        var tpl = angular.element(morphable[0].querySelector("#tpl-containing-morphable"));
        tpl.find("button")[0].click();
      });

      waitsFor(function() {
        return getComputedStyle(morphable[0].querySelector("#nested-overlay"), null).visibility === "visible";
      }, "nested overlay should be visible to user", 35);

    });
  });
});