const path = require('path');
const { loadLinks } = require('./config/load-links');
const gitInfo = require('./config/git-info')();
const links = loadLinks();
const packageInfo = require('./config/package-info');

const withTM = require('next-transpile-modules')([
  '@pie-framework/mathquill',
  '@pie-lib/charting',
  '@pie-lib/config-ui',
  '@pie-lib/correct-answer-toggle',
  '@pie-lib/drag',
  '@pie-lib/editable-html-tip-tap',
  '@pie-lib/graphing',
  '@pie-lib/icons',
  '@pie-lib/mask-markup',
  '@pie-lib/math-evaluator',
  '@pie-lib/math-input',
  '@pie-lib/math-rendering',
  '@pie-lib/math-toolbar',
  '@pie-lib/plot',
  '@pie-lib/render-ui',
  '@pie-lib/rubric',
  '@pie-lib/scoring-config',
  '@pie-lib/style-utils',
  '@pie-lib/text-select',
  '@pie-lib/tools',
  '@pie-lib/translator',
  '@mapbox/point-geometry',
]);

const getAssetPrefix = () => {
  if (process.env.NODE_ENV !== 'production') {
    return '';
  }
  return process.env.ASSET_PREFIX || '';
};

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    esmExternals: 'loose',
  },
  webpack: (config) => {
    config.cache = false;
    const publicPath = `${getAssetPrefix()}/_next/static`;

    config.resolve.mainFields = ['browser', 'main'];

    // Ensure all modules use the same React instance
    config.resolve.alias = {
      ...config.resolve.alias,
      react: path.resolve(__dirname, '../../node_modules/react'),
      'react-dom': path.resolve(__dirname, '../../node_modules/react-dom'),
    };

    // Optional: keep url-loader rule if you still want inlined assets
    config.module.rules.push({
      test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2|otf)$/,
      loader: 'url-loader',
      options: {
        limit: 10000,
        outputPath: 'static',
        publicPath,
      },
    });

    // Optional: if you have "fullySpecified" errors
    config.module.rules.forEach((rule) => {
      if (rule.resolve) {
        rule.resolve.fullySpecified = false;
      }
    });

    return config;
  },

  // Only runs when using `next export`
  exportPathMap: async () => {
    return links.reduce(
      (acc, l) => {
        acc[l.path] = { page: l.path };
        return acc;
      },
      { '/': { page: '/' } },
    );
  },

  assetPrefix: getAssetPrefix(),

  // env must be flat strings now
  env: {
    links: links,
    gitInfo: gitInfo,
    packageInfo: packageInfo.load(),
  },
};

module.exports = withTM(nextConfig);
