describe('Modal Transition', function(){

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
      var tplWithCloseEl = '<div width="width:400px; height: 400px; background:black;display:block;"> <span class="close-x">x</span> <h1> Test Content </h1> </div>';
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
        return getComputedStyle(morphable.find("div")[0], null).visibility === "visible";
      }, "wrapper should be visible to user", 35);

      runs(function() {
        morphable.children(".close-x")[0].click();
      });

      waitsFor(function() {
        return getComputedStyle(morphable.find("div")[0], null).opacity === '0' ;
      }, "wrapper should be hidden to user", 850);
    });
  });
});