describe("Backbone Extensions", function() {
  describe('Backbone.sync', function() {
    beforeEach(function() {
      var Post = Backbone.Model.extend({
        url: '/posts/123'
      });
      post = new Post();

      spyOn($, 'ajax').andCallFake(function() {
        return {
          success: function(){}
        };
      });
    });

    it('calls original sync on cache miss', function() {
      Backbone._cache = {};
      Backbone.sync('read', post, {success: function() {}});
      expect($.ajax).wasCalled();
    });

    it('does not call original sync on cache hit', function() {
      Backbone._cache = {
        '/posts/123' : {title: 'My Awesome Post'}
      };
      Backbone.sync('read', post, {success: function() {}});
      expect($.ajax).wasNotCalled();
    });
  });
});

