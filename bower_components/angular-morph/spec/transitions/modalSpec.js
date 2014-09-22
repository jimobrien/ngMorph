describe('Modal', function(){

  var tpl = '<div width="width:400px; height: 400px; background:black;display:block;"> <h1> Test Content </h1> </div>';

  beforeEach(module('morph'));
  beforeEach(module('morph.directives'));

  beforeEach(inject(function ($rootScope){
    $rootScope.settings = {
      modal: {
        template: tpl
      }
    };
    $rootScope.$digest();

  }));

  // basic modal functionality tests
  it('should compile a template', function(){
    inject(function ($compile, $document, $rootScope, $rootElement) {
      var morphable = $compile('<div><button ng-morph-modal="settings"> Test </button></div>')($rootScope); 

      $rootElement.append(morphable);
      angular.element($document[0].body).append($rootElement);

      var content = angular.element($document[0].body).find('div')[2];

      expect(content.children.length).to.be(1);

    });
  });

  it('should create a fade element', function(){
    inject(function ($compile, $document, $rootScope, $rootElement) {
      var morphable = $compile('<div><button ng-morph-modal="settings"> Test </button></div>')($rootScope); 

      $rootElement.append(morphable);
      angular.element($document[0].body).append($rootElement);

      expect($rootElement.children()[0].children.length).to.be(3);

    });
  });

  it('should not create a fade element', function(){
    inject(function ($compile, $document, $rootScope, $rootElement) {
      $rootScope.settings.modal.fade = false;

      var morphable = $compile('<div><button ng-morph-modal="settings"> Test </button></div>')($rootScope); 

      $rootElement.append(morphable);
      angular.element($document[0].body).append($rootElement);

      expect($rootElement.children()[0].children.length).to.be(2);

    });
  });

  it('should open modal when directive element is clicked', function() {
    inject(function ($compile, $document, $rootScope, $rootElement) {
      var morphable = $compile('<div><button ng-morph-modal="settings"> Test </button></div>')($rootScope);

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

  it('should close modal when closeEl is clicked', function() {
    inject(function ($compile, $document, $rootScope, $rootElement) {
      var tplWithCloseEl = '<div style="width:400px; height: 400px; background:black;display:block;"> <span class="close-x">x</span> <h1> Test Content </h1> </div>';
     
      $rootScope.settings = {
        closeEl: ".close-x",
        trigger: 'click',
        modal: {
          template: tplWithCloseEl
        }
      };

      var morphable = $compile('<div><button ng-morph-modal="settings"> Test </button></div>')($rootScope);

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
  it('should compile a template containing a nested modal morphable', function () {
    inject(function ($compile, $document, $rootScope, $rootElement) {
      var tplContainingMorphable = '<div style="width:400px; height: 400px; background:black;display:block;"> <button ng-morph-modal="nestedModalSettings"> Nested Morphable </button></div>';
      var nestedModaltpl = '<div id="nested-modal" width="width:400px; height: 400px; background:black;display:block;"> <span class="close-x">x</span></div>';
      
      $rootScope.modalSettings = {
        closeEl: ".close-x",
        trigger: 'click',
        modal: {
          template: tplContainingMorphable
        }
      };

      $rootScope.nestedModalSettings = {
        closeEl: ".close-x",
        trigger: 'click',
        modal: {
          template: nestedModaltpl
        }
      };

      var morphable = $compile('<div><button ng-morph-modal="modalSettings"> Test </button></div>')($rootScope);

      $rootElement.append(morphable);
      angular.element($document[0].body).append($rootElement);

      runs(function() {
        morphable.find("button")[0].click();
      });

      expect(morphable[0].querySelector("#nested-modal").childNodes.length).to.be(2);
    });
  });

  it('should open a modal when a nested directive element is clicked', function () {
    inject(function ($compile, $document, $rootScope, $rootElement) {
      var tplContainingMorphable = '<div id="tpl-containing-morphable" style="width:400px; height: 400px; background:black;display:block;"> <button ng-morph-modal="nestedModalSettings"> Nested Morphable </button></div>';
      var nestedModaltpl = '<div id="nested-modal" width="width:400px; height: 400px; background:black;display:block;"> <span class="close-x">x</span></div>';
      
      $rootScope.modalSettings = {
        closeEl: ".close-x",
        trigger: 'click',
        modal: {
          template: tplContainingMorphable
        }
      };

      $rootScope.nestedModalSettings = {
        closeEl: ".close-x",
        trigger: 'click',
        modal: {
          template: nestedModaltpl
        }
      };

      var morphable = $compile('<div><button ng-morph-modal="modalSettings"> Test </button></div>')($rootScope);

      $rootElement.append(morphable);
      angular.element($document[0].body).append($rootElement);

      // open first modal
      runs(function() {
        morphable.find("button")[0].click();
      });

      waitsFor(function() {
        return getComputedStyle(morphable.find("div")[0], null).opacity === "1";
      }, "wrapper should be visible to user", 35);

      // open nested modal
      runs(function() {
        var tpl = angular.element(morphable[0].querySelector("#tpl-containing-morphable"));
        tpl.find("button")[0].click();
      });

      waitsFor(function() {
        return getComputedStyle(morphable[0].querySelector("#nested-modal"), null).visibility === "visible";
      }, "nested modal should be visible to user", 35);

    });
  });
});