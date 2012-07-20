describe('Backbone.Router._extractParameters', function() {
  beforeEach(function(){
    router = new Backbone.Router();
  })
  it('parses named params', function() {
    expect(router._extractParameters("search", "search?k=auto&v=audi")).toEqual({k:"auto", v: "audi"});
  });
  
  it('parses named params and replaces plus signs(+) to spaces', function() {
    expect(router._extractParameters("search", "search?k=auto+audi")).toEqual({k:"auto audi"});
  });
  
  it('parses named params and replaces encoded signs(%2c) and rest to real chars', function() {
    expect(router._extractParameters("search", "search?k=auto%2Baudi%2dradio")).toEqual({k:"auto+audi-radio"});
  });
  
  it('parses query params', function() {
    expect(router._extractParameters("search/:k", "search/audi")).toEqual({k:"audi"})
  });
  
  it('parses query numerical params as numbers', function() {
    expect(router._extractParameters("search/:k", "search/123")).toEqual({k:123})
  });
  
  it('parses query float params as strings', function() {
    expect(router._extractParameters("search/:k", "search/2.3")).toEqual({k:'2.3'})
  });
});
