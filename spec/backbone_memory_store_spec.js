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

    it('when reading, calls original sync on cache miss', function() {
      Backbone._cache = {};
      Backbone.sync('read', post, {success: function() {}});
      expect($.ajax).wasCalled();
    });

    it('when reading, does not call original sync on cache hit', function() {
      Backbone._cache = {
        '/posts/123' : {title: 'My Awesome Post'}
      };
      Backbone.sync('read', post, {success: function() {}});
      expect($.ajax).wasNotCalled();
    });

    it('when creating, calls original sync', function() {
      Backbone.sync('create', post, {success: function() {}});
      expect($.ajax).wasCalled();
    });

    it('when updating, calls original sync', function() {
      Backbone.sync('update', post, {success: function() {}});
      expect($.ajax).wasCalled();
    });

    it('when deleting, calls original sync', function() {
      Backbone.sync('delete', post, {success: function() {}});
      expect($.ajax).wasCalled();
    });

  });
});

