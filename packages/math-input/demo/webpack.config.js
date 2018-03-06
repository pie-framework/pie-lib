const path = require('path');

module.exports = {
  entry: {
    main: './entry.jsx',
    editable: './editable-math-input.jsx'
  },
  devtool: 'cheap-eval-source-map',
  context: __dirname,
  output: {
    filename: './[name].js',
    path: __dirname
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.jsx$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['react', 'es2015', 'stage-0']
          }
        }
      },
      {
        test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2|otf)$/,
        loader: 'url-loader',
        options: {
          limit: 10000
        }
      }
    ]
  },
  resolve: {
    extensions: [".jsx", ".js", ".json"]
  },
}