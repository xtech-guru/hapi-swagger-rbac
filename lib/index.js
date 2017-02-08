'use strict';

const util = require('util');
const traverse = require('./traverse');

exports.register = function(server, options, next) {
  const spec = options.spec;

  if (!spec)
    return next(new Error(`The swagger specification must be provided in the option 'spec'.`));

  server.register({
    register: require('hapi-rbac'),
    options: options.hapiRbac
  }, function(err) {
    if (err)
      return next(err);

    Promise.resolve(spec)
      .then(function(spec) {
        var paths = spec && spec.paths || null;

        if (paths) {
          var basePath = spec && spec.basePath || '';
          var routes = {};

          server.connections[0].table().forEach(function(route) {
            var key = route.public.path + '#' + route.public.method;

            routes[key] = route;
          });

          traverse(paths, 'x-rbac', null, function(rbac, parents) {
            // rbac must be defined on path items, and as we start traversing from 'paths', path items
            // always have exactly 2 parents
            if (parents.length === 2) {
              var key = basePath + parents[0] + '#' + parents[1];
              var route = routes[key];

              if (route)
                route.settings.plugins.rbac = rbac;
            }
          });
        }

        next();
      })
      .catch(next);
  });
};

exports.register.attributes = {
  pkg: require('../package.json')
};
