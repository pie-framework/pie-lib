const { resolve } = require('path');

module.exports = {
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env'],
          },
        },
      },
    ],
  },
  entry: {
    demo: './demo.js',
    main: './main.js',
  },
  output: {
    filename: '[name].bundle.js',
  },
  resolveLoader: {
    modules: ['node_modules', '../../../node_modules'],
  },
};
