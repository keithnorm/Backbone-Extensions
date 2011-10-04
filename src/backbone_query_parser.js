//extension: parse query params and named params into hash
//
//this makes routes defined first also respond first, like Rails
Backbone.History.prototype.route = function(route, callback) {
  this.handlers.push({route : route, callback : callback});
};

//this makes router match urls with ?foo=bar params
Backbone.Router.prototype._routeToRegExp = function (d) {
  var e = d.route ? d.route : d;
  var a = /:([\w\d]+)/g;
  d = d.params !== undefined ? d.params : true;
  var f = e.replace(a, "([^/]*)");
  if (d) {
    f = e.replace(a, "([^/\\?]*)");
    e = "[\\S]+";
    if (_.isArray(d)) e = "(" + d.join("|") + ")";
    f += "(\\?(" + e + "=[\\S]+)?(&" + e + "=[\\S]+)*&?)?";
  }
  return RegExp("^" + f + "$");
};

Backbone.Router.prototype._extractParameters = function (route, path) {
  var query = path.indexOf("?"), queryParams = {}, rint = /^\d+$/;
  if (query > -1) {
    var params = path.substr(query + 1).split("&");
    path = path.substr(0, query);
    _.each(params, function(param) {
      param = param.split("=");
      queryParams[param[0]] = param[1];
    });
  }

  var namedParamKeys = route.match(/:[^\/]+/gi), rroute = this._routeToRegExp(route); 
  if (!namedParamKeys) return queryParams;
  var namedParams = rroute.exec(path).slice(1);
  _.each(namedParamKeys, function (param, i) {
    if (rint.test(namedParams[i])) namedParams[i] = parseInt(namedParams[i], 10);
    queryParams[param.substr(1)] = namedParams[i];
  });
  
  return queryParams;
};

