var webpack = require('webpack');
var path = require('path');

var publicPath = 'http://localhost:3000/';
var hotMiddlewareScript = 'webpack-hot-middleware/client?reload=true';

var devConfig = {
  entry: {
    frontpage: ['./client/frontpage', hotMiddlewareScript],
    login: ['./client/login', hotMiddlewareScript]
  },
  output: {
    filename: './[name]/bundle.js',
    path: path.resolve(__dirname, './public'),
    publicPath: publicPath
  },
  devtool: 'eval-source-map',
  module: {
    rules: [{
      test: /\.(png|jpg)$/,
      use: 'url-loader?limit=8192&context=client&name=[path][name].[ext]'
    }, {
      test: /\.css$/,
      use: [
        'style-loader',
        'css-loader?sourceMap'
      ]
    }, {
      test: /\.(js|jsx)$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['es2015', 'react', 'stage-2'],
          plugins: [
            ['import', [{ libraryName: "antd", style: 'css' }]],
            'transform-runtime'
          ],
          // This is a feature of `babel-loader` for webpack (not Babel itself).
          // It enables caching results in ./node_modules/.cache/babel-loader/
          // directory for faster rebuilds.
          cacheDirectory: true
        }
      }
    }]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  ]
};

module.exports = devConfig;
