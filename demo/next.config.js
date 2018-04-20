const withCSS = require('@zeit/next-css');
module.exports = withCSS({
  webpack: (config, { buildId, dev, isServer, defaultLoaders }) => {
    config.module.rules.push({
      test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2|otf)$/,
      loader: 'url-loader',
      options: {
        limit: 10000
      }
    });
    return config;
  },
  webpackDevMiddleware: config => {
    //in dev mode - we want to watch for changes in node_modules coming from babel updates
    const out = Object.assign({}, config);
    out.watch = true;
    out.watchOptions = undefined;
    return out;
  },
  exportPathMap: function(/*defaultPathMap*/) {
    return {
      '/': { page: '/' },
      '/correct-answer-toggle': { page: '/correct-answer-toggle' },
      '/icons': { page: '/icons' },
      '/math-input': { page: '/math-input' },
      '/editable-html': { page: '/editable-html' },
      '/config-ui': { page: '/config-ui' },
      '/charting/plot-points': { page: '/charting/plot-points' },
      '/charting/graph-lines': { page: '/charting/graph-lines' }
    };
  },
  assetPrefix: process.env.NODE_ENV === 'production' ? '/pie-lib' : '' //eslint-disable-line
});
