var path = require('path');

module.exports = {
  mode: 'development',
  entry: './entry.jsx',
  devtool: 'cheap-eval-source-map',
  output: {
    path: path.resolve(__dirname),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.jsx$/,
        loader: 'babel-loader',
        query: {
          babelrc: false,
          presets: ['es2015', 'react', 'stage-0']
        }
      },
      {
        test: /\.less$/,
        loader: 'style-loader!css-loader!less-loader'
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx']
  }
};
