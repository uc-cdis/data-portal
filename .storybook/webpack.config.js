const path = require('path');
const basename = process.env.BASENAME || '/';

module.exports = {
  entry: ['babel-polyfill', '../src/index.jsx'],
  output: {
    path: __dirname,
    filename: 'bundle.js',
    publicPath: basename
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loaders: [
          'babel-loader',
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
          'less',
        ]
      },
      {
        test: /\.css$/,
        loader: 'style!css',
      },
      {
        test: /\.svg$/,
        loaders: ['babel-loader', 'react-svg-loader'],
      },
      { test: /\.flow$/, loader: 'ignore-loader' }
    ]
  },
  resolve: {
    alias: {
      graphql:  path.resolve('./node_modules/graphql'),
      react:    path.resolve('./node_modules/react')                // Same issue.
    },
    extensions: [ '.js', '.jsx', '.json' ]
  }
};
