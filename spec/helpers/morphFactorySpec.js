describe('Morph Factory', function(){
  var morphFactory;

  var elements = {
    wrapper: angular.element('<div />'),
    content: angular.element('<div />'),
    morphable: angular.element('<div />')
  };

  var settings = {
    MorphableBoundingRect: {top: 0, left: 0, width: 0, height: 0, },
    ContentBoundingRect: {top: 0, left: 0, width: 0, height: 0, }
  };

  beforeEach(module('morph'));

  beforeEach(function (){
    inject(function (Morph){
      morphFactory = Morph;
    });
  });

  it('should create a new Modal instance', function(){
    var modal = morphFactory('Modal', elements, settings);
    expect(modal.toggle).to.be.a('function');
  });

  it('should create a new Overlay instance', function(){
    var overlay = morphFactory('Overlay', elements, settings);
    expect(overlay.toggle).to.be.a('function');
  });

});