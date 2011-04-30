Backbone.Controller.prototype._composeParameters = function (route) {
  var args = _.toArray(arguments).slice(1);
  _.each(route.match(/:[^\/]+/gi), function(match, i) {
    route = route.replace(match, args.shift());
  });
  return _.isEmpty(args) ? route : route + '?' + $.param(args.shift());
};

Backbone.Controller.prototype._bindRoutes = (function(original) {
  return function() {
    var routes = [], routeGenerators = {};
    for(var route in this.routes) {
      routes.unshift([route, this.routes[route]]);
    }

    _.each(routes, function(route, i) {
      var path = name = route[0], options = callback = route[1];
      if($.type(options) == 'object'){
        if(options.as){
          delete this.routes[name];
          name = options.as;
        }

        if(options.to){
          callback = options.to;
        }
      }

      routeGenerators[name + 'Path'] = function() {
        var args = _.toArray(arguments);
        args.unshift(path);
        return Backbone.Controller.prototype._composeParameters.apply(this, args);
      };

      delete this.routes[path];
      this.routes[path] = callback;
    }.bind(this));

    _.each([Backbone.Controller.prototype, Backbone.Model.prototype, Backbone.View.prototype],
      function(obj, i) {
        _.extend(obj, routeGenerators);
      }
    );
    
    original.call(this);
  };
})(Backbone.Controller.prototype._bindRoutes);

