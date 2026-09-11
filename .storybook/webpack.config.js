const path = require('path');
const basename = process.env.BASENAME || '/';
const webpack = require('webpack');

module.exports = {
  module: {
    rules: [
      {
        test: /\.js$|\.jsx?$|\.tsx?$/,
        exclude: /(node_modules\/(?!marked)|bower_component)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/react'],
            plugins: ['@babel/plugin-proposal-class-properties'],
          },
        },
      },
      {
        test: /\.less$/,
        use: [
          'style-loader',
          'css-loader',
          'less-loader',
        ],
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
        ],
      },
      {
        test: /\.svg$/,
        // loaders: ['babel-loader', 'react-svg-loader'], // to address the `css-what` vulnerability issue, after updating to webpack 5 and latest `react-svg-loader` we can switch back to this
        loader: 'svg-react-loader',
      },
      {
        test: /\.(png|jpg|gif|woff|ttf|eot)$/,
        loaders: 'url-loader',
        query: {
          limit: 8192,
        },
      },
      {
        test: /\.flow$/,
        loader: 'ignore-loader',
      },
    ],
  },
  resolve: {
    alias: {
      graphql: path.resolve('./node_modules/graphql'),
      react: path.resolve('./node_modules/react'), // Same issue.
      // Force CJS builds — enhanced-resolve v4 picks .mjs (ESM) files first,
      // which webpack 4 can't handle when they re-export from CJS modules.
      'msw/node': path.resolve('./node_modules/msw/lib/node/index.js'),
      'msw/native': path.resolve('./node_modules/msw/lib/native/index.js'),
      'headers-polyfill': path.resolve('./node_modules/headers-polyfill/lib/index.js'),
      'outvariant': path.resolve('./node_modules/outvariant/lib/index.js'),
      'is-node-process': path.resolve('./node_modules/is-node-process/lib/index.js'),
    },
    extensions: ['.mjs', '.js', '.jsx', '.ts', '.tsx', '.json'],
  }
};
