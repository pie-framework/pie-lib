const withCSS = require('@zeit/next-css');

const { loadLinks } = require('./config/load-links');

const gitInfo = require('./config/git-info')();
const links = loadLinks();

const packageInfo = require('./config/package-info');

const getAssetPrefix = () => {
  //eslint-disable-next-line
  if (process.env.NODE_ENV !== 'production') {
    return '';
  }

  return process.env.ASSET_PREFIX || ''; //eslint-disable-line
};

module.exports = withCSS({
  webpack: (config /*opts*/) => {
    const publicPath = `${getAssetPrefix()}/_next/static`;

    config.resolve.mainFields = ['browser', 'main'];

    config.module.rules.push({
      test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2|otf)$/,
      loader: 'url-loader',
      options: {
        limit: 10000,
        outputPath: 'static',
        publicPath
      }
    });
    return config;
  },
  webpackDevMiddleware: config => {
    //in dev mode - we want to watch for changes in node_modules coming from babel updates
    const out = Object.assign({}, config);
    out.watch = true;
    out.watchOptions = undefined;
    out.devtool = 'inline-cheap-source-map';
    return out;
  },
  exportPathMap: function(/*defaultPathMap*/) {
    return links.reduce(
      (acc, l) => {
        acc[l.path] = { page: l.path };
        return acc;
      },
      { '/': { page: '/' } }
    );
  },
  assetPrefix: getAssetPrefix(),
  env: {
    links,
    gitInfo,
    packageInfo: packageInfo.load()
  }
});
