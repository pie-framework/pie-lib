var path = require('path');

module.exports = {
  entry: './entry.jsx',
  devtool: 'cheap-eval-source-map',
  output: {
    path: path.resolve(__dirname),
    filename: 'bundle.js',
  },
  module: {
    loaders: [
      {
        test: /\.jsx$/,
        loader: "babel-loader",
        query: {
          babelrc: false,
          presets: ['es2015', 'react']
        }
      },
      {
        test: /\.less$/,
        loader: "style-loader!css-loader!less-loader"
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx']
  }
};
