var webpack = require('webpack');
var path = require('path');

var publicPath = 'http://localhost:3000/';
var hotMiddlewareScript = 'webpack-hot-middleware/client?reload=true';
var CopyWebpackPlugin = require("copy-webpack-plugin");

var devConfig = {
  entry: {
    "frontpage.js": ['./client/frontpage', hotMiddlewareScript],
  },
  output: {
    filename: './[name]',
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
        'css-loader'
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
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: false
    }),
    new CopyWebpackPlugin([
      { from: './node_modules/react/dist/react.min.js'},
      { from: './node_modules/react-dom/dist/react-dom.min.js'},
      { from: './node_modules/antd/dist/antd.min.js'},
      { from: './node_modules/antd/dist/antd.min.css'},
      { from: './client/common/reset.css'},
      { from: './WX20170510-193405.png'},
      { from: './server/views/tvg-dl-page.html'}
    ], {copyUnmodified: true})
  ],
  externals: {
    "react": "React",
    "react-dom": "ReactDOM",
    "antd": "andtd",
    "antd.css": "antd.css"
  },
};

module.exports = devConfig;
