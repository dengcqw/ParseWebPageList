//var ExtractTextPlugin = require('extract-text-webpack-plugin'); seperate css with bundle.js
var path = require('path');
var CleanWebpackPlugin = require('clean-webpack-plugin');

var productionConfig = [{
  entry: {
    frontpage: './client/frontpage',
    login: './client/login'
  },
  output: {
    filename: './[name]/bundle.js',
    path: path.resolve(__dirname, './public'),
    publicPath: '/'
  },
  module: {
    rules: [{
      test: /\.(png|jpg)$/,
      use: 'url-loader?limit=8192&context=client&name=[path][name].[ext]'
    }, {
      test: /\.css$/,
      use: [ 'style-loader', 'css-loader?sourceMap' ]
    }]
  },
  plugins: [
    new CleanWebpackPlugin(['public']),
  ]
}];

module.exports = productionConfig;
