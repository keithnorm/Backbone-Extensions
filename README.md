# Backbone Extensions
This is a collection of some extensions that [drtangible](https://github.com/drtangible) and I have been working on. 

## Backbone Memory Store
This is a light and simple augmentation of Backbone.sync that caches any fetch requests and avoids making those requests again on subsequent hits to the same path. The use case is an experience where the user may be inclined to hit the back button a lot, or just would want to return to a previous page and see the same results. 

### How to use
Just include the backbone_memory_store.js file and you're good to go

## Backbone Query Parser
This does 2 things:

It augments Backbone.Controller._routeToRegExp to allow your regular routes to match routes with query parameters. So say you have this:

      App.Controllers.ApplicationController = Backbone.Controllers.extend({
        routes: {
          'posts': 'index'
        }
      });

Typically that would match routes like myblog.com/#posts, however it woulnd NOT match routes like myblog.com/#posts?order=popularity. With the query parser it will. 

It overrides Backbone.Controller._extractParameters to parse named params and query params into a params object.
  
      App.Controllers.ApplicationController = Backbone.Controllers.extend({
        routes: {
          'posts/:id': 'show'
        },

        show: function(params) {
          //say the url is myblog.com/#/posts/my-post?comment=10
          console.log(params); // {id: 'my-post', comment: 10}
        }
      });


### How to use
Just include the file backbone_query_parser.js, then update your route callbacks to expect an object instead of n number of arguments.
    
## Backbone Routes
This provides route generation methods so you don't have to concatenate strings in order to generate your routes. This particular module is very experimental at the moment and may change in the future. The gist is this:

      App.Controllers.ApplicationController = Backbone.Controllers.extend({
        routes: {
          'posts/:id': {to: 'show', as: 'post'}
        }
      });

      App.Views.Post = Backbone.View.extend({
        path: function() {
          return this.postPath(this.model.get('id'));
        }
      });

The idea is to make this work as close to the Rails 3 router as possible. So named params are passed in order as arguments, and any arguments after that will be appended as a query string. For example:

    //given this route
    'posts/:id/comments/:comment_id': {to: 'post_comment', as: 'postComment'}

    //will generate this helper method
    postCommentPath(1, 12); // posts/1/comments/12

    //and with query params...
    postCommentPath(1, 12, {user_id: 123, view: 'all'}); // posts/1/comments/12?user_id=123&view=all

### How to use
Include backbone_query_parser.js and backbone_routes.js, then define your routes as specified:

      App.Controllers.ApplicationController = Backbone.Controllers.extend({
        routes: {
          // for routes without named params
          'posts': 'index' // this.postsPath()
          // for routes with named params
          'posts/:id': {to: 'show', as: 'post'} // this.postPath(1)
        }
      });

Currently the routing module is "mixed in" to Controllers, Views and Models. We agree it seems weird for the "model" to know about a route, but it's also the main use case: when rendering a template based off of a model's attributes. We are open to suggestions. 

### Todo
1. add an easy way to specify a resource route
2. make storage a configurable backend so could swap memory with LocalStorage, etc.
3. make the code less jank
    
