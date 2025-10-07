/**
 * Rollup configuration for ESM builds - SIMPLE VERSION
 * 
 * Strategy: Bundle EVERYTHING except what's 100% proven safe
 * 
 * Safe External (proven to work):
 * - React (universal, always works)
 * - @pie-lib/* (our packages, we control the ESM)
 * - @pie-framework/* (our packages, we control the ESM)
 * 
 * Everything Else: BUNDLED
 * - react-dom (Slate needs it)
 * - Material-UI (old versions)
 * - Lodash (works but bundle for safety)
 * - Slate ecosystem (no ESM)
 * - All third-party deps
 * 
 * Benefits:
 * - Maximum compatibility
 * - Zero CDN transformation issues
 * - Predictable behavior
 * - Optimize later based on real data
 */

const { nodeResolve } = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');
const { babel } = require('@rollup/plugin-babel');
const postcss = require('rollup-plugin-postcss');

const isProduction = process.env.NODE_ENV === 'production';

// MINIMAL external list - Only 100% proven safe dependencies
const external = [
  // React core - Universal, always works fine external
  'react',
  
  // PIE packages - Our own, we control the ESM builds
  /^@pie-lib\//,
  /^@pie-framework\//,
];

const plugins = [
  nodeResolve({
    extensions: ['.js', '.jsx'],
    browser: true,
    preferBuiltins: false,
  }),
  // CommonJS MUST come BEFORE Babel
  // Convert require() to import FIRST, then transpile
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
      ['@babel/preset-env', {
        targets: {
          esmodules: true,
        },
        modules: false,
        bugfixes: true,
      }],
    ],
    extensions: ['.js', '.jsx'],
  }),
  // CommonJS SECOND PASS: Clean up any Babel-emitted CommonJS helpers
  // Exclude node_modules to avoid re-processing already-converted ESM
  commonjs({
    exclude: /node_modules/,
  }),
].filter(Boolean);

module.exports.default = function createConfig(input, output) {
  return {
    input,
    output: {
      file: output,
      format: 'esm',
      sourcemap: true,
      exports: 'auto',
    },
    external,
    plugins,
  };
};

