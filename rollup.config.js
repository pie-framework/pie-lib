import path from 'path';
import babel from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

const extensions = ['.js', '.jsx', '.ts', '.tsx'];

const outputDir = path.resolve(__dirname, 'dist');
const input = path.resolve(
  __dirname,
  './packages/pie-toolbox/src/editable-html.js'
);

export default () => ({
  input: input,
  output: [
    {
      file: path.resolve(outputDir, 'index.cjs.js'),
      format: 'cjs',
      sourcemap: true,
      exports: 'named',
    },
    {
      file: path.resolve(outputDir, 'index.esm.js'),
      format: 'esm',
      sourcemap: true,
    },
  ],
  external: ['react', 'react-dom'], // add other externals as needed
  plugins: [
    resolve({ extensions }),
    commonjs(),
    babel({
      babelHelpers: 'runtime',
      extensions,
      include: ['packages/**/*', 'node_modules/**/*'], // make sure deps are transpiled
      presets: [
        [
          '@babel/preset-env',
          {
            targets: {
              browsers: 'defaults', // or adjust to your needs
            },
          },
        ],
      ],
      plugins: [
        '@babel/plugin-transform-runtime',
        '@babel/plugin-syntax-optional-catch-binding',
      ],
    }),
  ],
});
