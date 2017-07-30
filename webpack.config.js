var webpack = require('webpack');
var nodeExternals = require('webpack-node-externals');
var path = require('path');

module.exports = {
  entry: ['babel-polyfill', './src/index.js'],
  exclude: '/node_modules/',

  output: {
    path: './',
    filename: 'bundle.js',
    publicPath: '/'
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
  ]
};