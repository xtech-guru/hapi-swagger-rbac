let util = require('util');

function traverse(o, pattern, parents, func){
  parents = parents || [];

  if (o.hasOwnProperty(pattern)) {
    func(o[pattern], parents);
  }

  Object.keys(o).forEach(function(key){
    if (!!o[key] && typeof(o[key]) == "object"){
      traverse(o[key], pattern, parents.concat(key), func);
    }
  });
}

const configPlugin = {
  register: function (Server, options, next) {

    const hapiRbac = options.hapiRbac;
    const spec = options.spec;

    Server.register({
      register: require('hapi-rbac'),
      options: {
        responseCode: hapiRbac.responseCode
      }
    }, function(err) {
        if (err) {
            console.log(err);
            throw err;
        }
    });

    Promise.resolve(spec)
      .then(function(derefencedSpec){
        traverse(derefencedSpec.paths, "x-rbac", null, function(x_rbac, parents){
          let route = {
            method: parents[1],
            path: derefencedSpec.basePath+parents[0],
            x_rbac: x_rbac
          };

          Server.connections[0].table().every(function(element){
             if(element.public.method === route.method && element.public.path === route.path){
               element.settings.plugins.rbac = route.x_rbac;
               return;
             }
             return true;
          })
        })
        next();
      })
      .catch(next);
  }
};

configPlugin.register.attributes = {
  name: 'hapi-swagger-rbac',
  version: '1.0.0'
};

exports.register = configPlugin.register;
