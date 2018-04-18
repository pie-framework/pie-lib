module.exports = {
  webpack: (config, { buildId, dev, isServer, defaultLoaders }) => {
    return config;
  },
  webpackDevMiddleware: config => {
    //in dev mode - we want to watch for changes in node_modules coming from babel updates
    const out = Object.assign({}, config);
    out.watch = true;
    out.watchOptions = undefined;
    return out;
  }
};
