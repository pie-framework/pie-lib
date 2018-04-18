// This file is not going through babel transformation.
// So, we write it in vanilla JS
// (But you could use ES2015 features supported by your Node.js version)
const path = require('path');

module.exports = {
  webpack: (config, { buildId, dev, isServer, defaultLoaders }) => {
    // Perform customizations to webpack config
    // Important: return the modified config
    console.log(Array.isArray(defaultLoaders));
    console.log(JSON.stringify(defaultLoaders));
    console.log(JSON.stringify(config.module.rules));
    const babelLoader = defaultLoaders.babel;

    const r = {
      test: /.*(jsx|js)/,
      include: [path.resolve('../packages')],
      exclude: [/.*packages\/.*\/node_modules/],
      use: babelLoader
    };

    config.module.rules.push(r);
    console.log(config.module.rules);
    return config;
  },
  webpackDevMiddleware: config => {
    // Perform customizations to webpack dev middleware config

    // Important: return the modified config
    return config;
  }
};
