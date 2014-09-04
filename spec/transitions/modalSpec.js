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

});