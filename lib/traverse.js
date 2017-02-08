'use strict';

module.exports = function traverse(o, pattern, parents, func) {
  parents = parents || [];

  if (o === undefined || o === null)
    return;

  if (o.hasOwnProperty(pattern))
    func(o[pattern], parents);

  Object.keys(o).forEach(function(key) {
    if (!!o[key] && typeof(o[key]) === 'object')
      traverse(o[key], pattern, parents.concat(key), func);
  });
};
