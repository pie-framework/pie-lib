const { nodeResolve } = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');
const { babel } = require('@rollup/plugin-babel');

const isProduction = process.env.NODE_ENV === 'production';

// External dependencies that should not be bundled
const external = [
  'react', 'react-dom', 'prop-types',
  '@material-ui/core', '@material-ui/icons',
  'classnames', 'lodash', 'debug',
  /^@pie-lib\//,
  /^@pie-framework\//,
  /^react\//,
  /^react-dom\//,
  /^lodash\//,
];

const plugins = [
  nodeResolve({
    extensions: ['.js', '.jsx'],
    browser: true,
    preferBuiltins: false,
  }),
  commonjs({
    include: /node_modules/,
  }),
  babel({
    babelHelpers: 'runtime',
    exclude: /node_modules/,
    plugins: [['@babel/plugin-transform-runtime', { regenerator: false }]],
    presets: [
      ['@babel/preset-react'],
      ['@babel/preset-env', {
        targets: {
          esmodules: true,
        },
        modules: false,
      }],
    ],
    extensions: ['.js', '.jsx'],
  }),
].filter(Boolean);

module.exports.default = function createConfig(input, output) {
  return {
    input,
    output: {
      file: output,
      format: 'esm',
      sourcemap: true,
    },
    external,
    plugins,
  };
};

