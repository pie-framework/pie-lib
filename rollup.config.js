const { nodeResolve } = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');
const { babel } = require('@rollup/plugin-babel');

const isProduction = process.env.NODE_ENV === 'production';

// External dependencies that should not be bundled
// Generated from: node scripts/discover-esm-imports.mjs
const external = [
  // React ecosystem
  'react',
  'react-dom',
  'prop-types',
  /^react\//,
  /^react-dom\//,
  'react-transition-group',
  /^react-transition-group\//, // CSSTransition, etc.
  'react-beautiful-dnd',
  'react-dnd',
  'react-dnd-html5-backend',
  'react-dnd-touch-backend',
  'react-dnd-multi-backend',
  'react-portal',
  'react-draggable',
  'react-redux',
  'react-input-autosize',
  'react-attr-converter',
  'react-measure',

  // Material-UI core (keep external, but bundle icons)
  '@material-ui/core',
  /^@material-ui\/core\//,
  '@material-ui/styles',
  /^@material-ui\/styles\//,
  // Note: @material-ui/icons are bundled (not external) because old version lacks ESM support

  // Lodash (keep all sub-paths external)
  'lodash',
  /^lodash\//,

  // Slate editor ecosystem
  'slate',
  'slate-react',
  'slate-prop-types',
  'slate-plain-serializer',
  'slate-html-serializer',
  'slate-dev-environment',
  'slate-hotkeys',
  'slate-soft-break',
  /^slate-edit-/, // slate-edit-list, slate-edit-table

  // Visualization libraries
  /^@vx\//, // @vx/axis, @vx/grid, etc.
  /^d3-/, // d3-scale, d3-selection

  // Math libraries
  /^mathjax-full\//,
  /^speech-rule-engine\//,
  'mathjs',

  // State management
  'redux',
  'immutable',

  // Other libraries
  'classnames',
  'debug',
  'enzyme',
  'i18next',
  'invariant',
  'trigonometry-calculator',
  'to-style',
  '@mapbox/point-geometry',

  // PIE framework
  /^@pie-lib\//,
  /^@pie-framework\//,
];

const plugins = [
  nodeResolve({
    extensions: ['.js', '.jsx'],
    browser: true,
    preferBuiltins: false,
    // Only resolve relative/local imports, not node_modules
    moduleDirectories: [], // Don't resolve from node_modules
  }),
  babel({
    babelHelpers: 'bundled', // Inline helpers for pure ESM
    exclude: /node_modules/,
    babelrc: false, // Don't read .babelrc files
    configFile: false, // Don't read babel.config.js
    assumptions: {
      // Force pure ESM output (no CommonJS)
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
          targets: {
            esmodules: true, // Target modern browsers with ESM support
          },
          modules: false, // Keep ES modules
          bugfixes: true, // Use smaller, modern transforms
        },
      ],
    ],
    extensions: ['.js', '.jsx'],
  }),
  commonjs({
    include: /node_modules/,
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
