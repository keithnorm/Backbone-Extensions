describe('Backbone.router', function() {
  beforeEach(function() {
    App = {
      Controllers: {}
    };

    stupidTestBooleans = ['calledSomethingElse', 'calledIndex', 'calledShow', 'calledCreate', 'calledUpdate', 'calledDestroy'];

    _.each(stupidTestBooleans, function(bool, i) {
      window[bool] = false;
    });

    App.Controllers.Posts = Backbone.Controller.extend({
      routes: {
        //'posts'     : {'post'  : 'create',  //postsPath()
        //               'get'   : 'index'},  //postsPath()

        //'posts/:id' : {'get'   : 'show',    //postPath(1)
        //               'put'   : 'update',  //postPath(1)
        //               'delete': 'destroy'},//postPath(1)

        'posts'     : 'resources', 
        'comments'  : 'comments',
        'tasks/:id' : {to: 'tasks', as: 'tasks' },
        'something' : {to: 'something_else', as: 'whatever'} //whateverPath()
      },

      comments: function() {},
      something_else: function() { 
        calledSomethingElse = true;
      },

      index: function() {
        calledIndex = true;
      }
    });
    controller = new App.Controllers.Posts();
  });

  afterEach(function() {
    _.each(stupidTestBooleans, function(bool, i) {
      window[bool] = false;
    });
  });

  describe('route generation', function() {
    it('handles basic routes', function() {
      expect(controller.commentsPath()).toEqual('comments');
    });

    it('handles named routes', function() {
      expect(controller.whateverPath()).toEqual('something');
    });

    it('handles routes with named params', function() {
      expect(controller.tasksPath(1)).toEqual('tasks/1');
    });

    it('handles routes with named params and extra query params', function() {
      expect(controller.tasksPath(1, {filter: 'date'})).toEqual('tasks/1?filter=date');
    });

    describe('resources', function() {
      xit('handles index', function() {
        expect(controller.postsPath()).toEqual('/posts');
      });

      xit('handles show', function() {
        expect(controller.postPath(1)).toEqual('/posts/1');
      });

      xit('handles update', function() {
        expect(controller.postPath(1)).toEqual('/posts/1');
      });

      xit('handles create', function() {
        expect(controller.postsPath()).toEqual('/posts');
      });

      xit('handles delete', function() {
        expect(controller.postPath(1)).toEqual('/posts/1');
      });
    });
  });

  describe('route matching', function() {

    it('handles basic routes', function() {
      var fragment = 'comments';
      spyOn(Backbone.history, 'getFragment').andReturn(fragment);

      var handler = _.detect(Backbone.history.handlers, function(cb, i) {
        return cb.route.test(fragment);
      });

      spyOn(handler, 'callback');
      Backbone.history.loadUrl();
      expect(handler.callback).wasCalled();
    });

    it('handles routes with :to option', function() {
      //'something' : {to: 'something_else', as: 'whatever'}
      var fragment = 'something';
      spyOn(Backbone.history, 'getFragment').andReturn(fragment);

      var handler = _.detect(Backbone.history.handlers, function(cb, i) {
        return cb.route.test(fragment);
      });

      Backbone.history.loadUrl();
      expect(calledSomethingElse).toBeTruthy();
    });

    describe('resources', function() {
      
      xit('handles index', function() {
        var fragment = 'posts';
        spyOn(Backbone.history, 'getFragment').andReturn(fragment);

        var handler = _.detect(Backbone.history.handlers, function(cb, i) {
          return cb.route.test(fragment);
        });

        Backbone.history.loadUrl();
        expect(calledIndex).toBeTruthy();
      });
    });

  });
});
