const path = require('path');
const { loadLinks } = require('./config/load-links');
const gitInfo = require('./config/git-info')();
const links = loadLinks();
const packageInfo = require('./config/package-info');

const withTM = require('next-transpile-modules')([
  '@pie-framework/mathquill', // 👈 your package name
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
  webpack: (config) => {
    const publicPath = `${getAssetPrefix()}/_next/static`;

    config.resolve.mainFields = ['browser', 'main'];

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

    config.module.rules.push({
      test: /\.[jt]sx?$/,
      include: [
        path.resolve(__dirname, '../../node_modules/@tiptap/core'),
        path.resolve(__dirname, '../../node_modules/@tiptap/pm'),
        path.resolve(__dirname, '../../node_modules/@tiptap/extension-color'),
        path.resolve(__dirname, '../../node_modules/@tiptap/extension-text-style'),
        path.resolve(__dirname, '../../node_modules/@tiptap/extension-list-item'),
        path.resolve(__dirname, '../../node_modules/@tiptap/starter-kit'),
      ],
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['next/babel'],
        },
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
      { '/': { page: '/' } }
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
