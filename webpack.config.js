var webpack = require('webpack');
var nodeExternals = require('webpack-node-externals');

module.exports = {
  entry: './src/index.js',
  exclude: '/node_modules/',

  output: {
    path: './src/',
    filename: 'bundle.js',
    publicPath: ''
  },
  devServer: {
    historyApiFallback: true
  },
  module: {
    target: 'node',
    externals: [nodeExternals()],
    loaders: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loaders: [
          'babel',

        ],
      },
      {
        test: /\.less$/,
        loaders: [
          'style',
          'css',
          'less'
        ]
      },
      { 
        test: /\.css$/,
        loader: "style!css"
      },
      {
        test: /\.(png|jpg)$/,
        loaders: [
          'url'
        ],
        query: {
          limit: 8192
        }
      }
    ]
  }
}