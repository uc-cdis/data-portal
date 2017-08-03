var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var nodeExternals = require('webpack-node-externals');
var path = require('path');
var basename = process.env.BASENAME || '/';
var app = process.env.APP || 'dev';
var title = {
  dev: 'Generic Data Commons',
  bpa: 'BPA Data Commons',
  edc: 'Environmental Data Commons',
  acct: 'ACCOuNT Data Commons',
}[app];


module.exports = {
  entry: ['babel-polyfill', './src/index.js'],
  exclude: '/node_modules/',

  output: {
    path: __dirname,
    filename: 'bundle.js',
    publicPath: basename
  },
  devServer: {
    historyApiFallback: true,
    disableHostCheck: true,
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
        test: /\.json$/,
        loader: 'json'
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
        test: /\.svg$/,
        loader: 'file'
      },
      {
        test: /\.(png|jpg)$/,
        loaders: [
          'url'
        ],
        query: {
          limit: 8192
        }
      },
      { test: /\.flow$/, loader: 'ignore-loader' }
    ]
  },
  resolve: {
    alias: {
      graphql:  path.resolve('./node_modules/graphql'),
      react:    path.resolve('./node_modules/react')                // Same issue.
    }
  },
  plugins: [
    new webpack.EnvironmentPlugin(['NODE_ENV']),
    new webpack.EnvironmentPlugin(['MOCK_STORE']),
    new webpack.EnvironmentPlugin(['APP']),
    new webpack.EnvironmentPlugin(['BASENAME']),
    new HtmlWebpackPlugin({
      title: title,
      template: 'src/index.ejs',
      hash: true
    }),

  ]
};