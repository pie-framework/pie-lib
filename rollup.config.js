/**
 * Rollup config factory for PIE ESM builds (pie-lib).
 *
 * Design goals:
 * - Produce browser-friendly ESM bundles that work without requiring consumers to run a bundler.
 * - Keep existing CJS build pipeline untouched (lib/ stays as-is).
 * - Prefer bundling third-party deps for compatibility; keep React external to avoid duplicate React instances.
 */

const { nodeResolve } = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');
const { babel } = require('@rollup/plugin-babel');
const postcss = require('rollup-plugin-postcss');

const isProduction = process.env.NODE_ENV === 'production';

// Keep React external so apps don’t end up with multiple React copies.
// Everything else is bundled by default for maximum compatibility with direct browser/CDN imports.
const external = ['react', 'react-dom'];

const plugins = [
  nodeResolve({
    extensions: ['.js', '.jsx', '.mjs', '.cjs', '.json'],
    browser: true,
    preferBuiltins: false,
  }),
  // Convert CJS deps in node_modules first.
  commonjs({
    include: /node_modules/,
  }),
  postcss({
    extract: true,
    minimize: isProduction,
    inject: false,
  }),
  babel({
    babelHelpers: 'bundled',
    exclude: /node_modules/,
    babelrc: false,
    configFile: false,
    assumptions: {
      setPublicClassFields: true,
      constantSuper: true,
      noDocumentAll: true,
      objectRestNoSymbols: true,
      pureGetters: true,
      setSpreadProperties: true,
      skipForOfIteratorClosing: true,
    },
    presets: [
      ['@babel/preset-react'],
      [
        '@babel/preset-env',
        {
          targets: { esmodules: true },
          modules: false,
          bugfixes: true,
        },
      ],
    ],
    extensions: ['.js', '.jsx', '.mjs'],
  }),
  // Second CJS pass for any helpers emitted by Babel.
  commonjs({
    exclude: /node_modules/,
  }),
].filter(Boolean);

module.exports.default = function createConfig(input, outputFile) {
  return {
    input,
    output: {
      file: outputFile,
      format: 'esm',
      sourcemap: true,
      exports: 'auto',
    },
    external,
    plugins,
  };
};


