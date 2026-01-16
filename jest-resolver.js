// Custom Jest resolver to handle node: protocol imports
module.exports = (request, options) => {
  // Strip 'node:' prefix from built-in module imports
  if (request.startsWith('node:')) {
    request = request.replace(/^node:/, '');
  }

  // Use the default Jest resolver
  return options.defaultResolver(request, options);
};
