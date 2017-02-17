'use strict';

module.exports = function traverse(node, pattern, cb) {
  return recurse(node, pattern, null, cb);
};

function recurse(node, pattern, parents, cb) {
  parents = parents || [];

  if (node === undefined || node === null)
    return;

  if (node.hasOwnProperty(pattern))
    cb(node[pattern], parents);

  Object.keys(node).forEach(function(key) {
    if (!!node[key] && typeof(node[key]) === 'object')
      recurse(node[key], pattern, parents.concat(key), cb);
  });
}
