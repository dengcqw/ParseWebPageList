//var ExtractTextPlugin = require('extract-text-webpack-plugin'); seperate css with bundle.js
var webpack = require('webpack');
var path = require('path');
var CleanWebpackPlugin = require('clean-webpack-plugin');
var CopyWebpackPlugin = require("copy-webpack-plugin");

var productionConfig = {
  entry: {
    "frontpage.js": './client/frontpage',
  },
  output: {
    filename: './[name]',
    path: path.resolve(__dirname, './public'),
    publicPath: '/'
  },
  module: {
    rules: [{
      test: /\.(png|jpg)$/,
      use: 'url-loader?limit=8192&context=client&name=[path][name].[ext]'
    }, {
      test: /\.css$/,
      use: [ 'style-loader', 'css-loader' ]
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
    new CleanWebpackPlugin(['public']),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: false
    }),
    new CopyWebpackPlugin([
      { from: './node_modules/react/dist/react.min.js'},
      { from: './node_modules/react-dom/dist/react-dom.min.js'},
      { from: './node_modules/antd/dist/antd.min.js'},
      { from: './node_modules/antd/dist/antd.min.css'},
      { from: './client/common/reset.css'}
    ], {copyUnmodified: true})
  ],
  externals: {
    "react": "React",
    "react-dom": "ReactDOM",
    "antd": "andtd",
    "antd.css": "antd.css"
  },
};

module.exports = productionConfig;
