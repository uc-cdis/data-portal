const path = require('path');
const basename = process.env.BASENAME || '/';
const webpack = require('webpack');

module.exports = {
  entry: '../src/index.jsx',
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
          'style-loader',
          'css-loader',
          'less-loader',
        ]
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader',
      },
      {
        test: /\.svg$/,
        // loaders: ['babel-loader', 'react-svg-loader'], // to address the `css-what` vulnerability issue, after updating to webpack 5 and latest `react-svg-loader` we can switch back to this
        loader: 'svg-react-loader',
      },
      {
        test: /\.(png|jpg|eot|ttf|woff)$/,
        loader: 'url-loader',
      },
      { test: /\.flow$/, loader: 'ignore-loader' },
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
