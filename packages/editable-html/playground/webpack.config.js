// const DashboardPlugin = require('webpack-dashboard/plugin');

module.exports = {
  mode: 'development',
  devtool: 'eval-source-map',
  context: __dirname,
  entry: {
    image: './image/index.jsx',
    'schema-override': './schema-override/index.jsx',
    'prod-test': './prod-test/index.jsx',
    mathquill: './mathquill/index.jsx',
    serialization: './serialization/index.jsx'
  },
  output: {
    filename: '[name]/bundle.js',
    path: __dirname
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        loader: 'url-loader'
      },
      {
        test: /\.jsx$/,
        loader: 'babel-loader',
        options: {
          babelrc: false,
          presets: ['react', 'env', 'stage-0']
        }
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  externals: {
    react: 'React',
    'react-dom': 'ReactDOM',
    'react-dom/server': 'ReactDOMServer'
  }
};
