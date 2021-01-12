const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const nodeExternals = require('webpack-node-externals');
const path = require('path');
const basename = process.env.BASENAME || '/';
const pathPrefix = basename.endsWith('/')
  ? basename.slice(0, basename.length - 1)
  : basename;

const plugins = [
  new webpack.EnvironmentPlugin(['NODE_ENV']),
  new webpack.EnvironmentPlugin({ MOCK_STORE: null }),
  new webpack.EnvironmentPlugin(['APP']),
  new webpack.EnvironmentPlugin({ BASENAME: '/' }),
  new webpack.EnvironmentPlugin(['LOGOUT_INACTIVE_USERS']),
  new webpack.EnvironmentPlugin(['WORKSPACE_TIMEOUT_IN_MINUTES']),
  new webpack.EnvironmentPlugin(['REACT_APP_PROJECT_ID']),
  new webpack.EnvironmentPlugin(['REACT_APP_ARRANGER_API']),
  new webpack.EnvironmentPlugin(['REACT_APP_DISABLE_SOCKET']),
  new webpack.EnvironmentPlugin(['TIER_ACCESS_LEVEL']),
  new webpack.EnvironmentPlugin(['TIER_ACCESS_LIMIT']),
  new webpack.EnvironmentPlugin(['FENCE_URL']),
  new webpack.EnvironmentPlugin(['INDEXD_URL']),
  new webpack.EnvironmentPlugin(['USE_INDEXD_AUTHZ']),
  new webpack.EnvironmentPlugin(['WORKSPACE_URL']),
  new webpack.EnvironmentPlugin(['WTS_URL']),
  new webpack.EnvironmentPlugin(['MANIFEST_SERVICE_URL']),
  new webpack.DefinePlugin({
    // <-- key to reducing React's size
    'process.env': {
      NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'dev'),
      LOGOUT_INACTIVE_USERS: !(process.env.LOGOUT_INACTIVE_USERS === 'false'),
      WORKSPACE_TIMEOUT_IN_MINUTES:
        process.env.WORKSPACE_TIMEOUT_IN_MINUTES || 480,
      REACT_APP_PROJECT_ID: JSON.stringify(
        process.env.REACT_APP_PROJECT_ID || 'search'
      ),
      REACT_APP_ARRANGER_API: JSON.stringify(
        process.env.REACT_APP_ARRANGER_API || '/api/v0/flat-search'
      ),
      REACT_APP_DISABLE_SOCKET: JSON.stringify(
        process.env.REACT_APP_DISABLE_SOCKET || 'true'
      ),
    },
  }),
  new HtmlWebpackPlugin({
    title: process.env.TITLE || 'PCDC Data Portal',
    basename: pathPrefix,
    template: 'src/index.ejs',
    connect_src: (function () {
      let rv = {};
      if (typeof process.env.FENCE_URL !== 'undefined') {
        rv[new URL(process.env.FENCE_URL).origin] = true;
      }
      if (typeof process.env.INDEXD_URL !== 'undefined') {
        rv[new URL(process.env.INDEXD_URL).origin] = true;
      }
      if (typeof process.env.WORKSPACE_URL !== 'undefined') {
        rv[new URL(process.env.WORKSPACE_URL).origin] = true;
      }
      if (typeof process.env.WTS_URL !== 'undefined') {
        rv[new URL(process.env.WTS_URL).origin] = true;
      }
      if (typeof process.env.MANIFEST_SERVICE_URL !== 'undefined') {
        rv[new URL(process.env.MANIFEST_SERVICE_URL).origin] = true;
      }
      return Object.keys(rv).join(' ');
    })(),
    hash: true,
  }),
  new webpack.optimize.AggressiveMergingPlugin(), //Merge chunks
];

let optimization = {};
let devtool = false;

if (process.env.NODE_ENV !== 'dev' && process.env.NODE_ENV !== 'auto') {
  // optimization for production mode
  optimization = {
    splitChunks: {
      chunks: 'all',
    },
  };
} else {
  // add sourcemap tools for development mode
  devtool = 'eval-source-map';
}

module.exports = {
  entry: ['babel-polyfill', './src/index.jsx'],
  target: 'web',
  bail: process.env.NODE_ENV !== 'dev' && process.env.NODE_ENV !== 'auto',
  externals: [
    nodeExternals({
      whitelist: ['graphiql', 'graphql-language-service-parser'],
    }),
  ],
  mode:
    process.env.NODE_ENV !== 'dev' && process.env.NODE_ENV !== 'auto'
      ? 'production'
      : 'development',
  output: {
    path: __dirname,
    filename: 'bundle.js',
    publicPath:
      process.env.NODE_ENV !== 'dev' && process.env.NODE_ENV !== 'auto'
        ? basename
        : 'https://localhost:9443/',
  },
  optimization,
  devtool,
  devServer: {
    historyApiFallback: {
      index: 'dev.html',
    },
    disableHostCheck: true,
    compress: true,
    hot: true,
    port: 9443,
    https: true,
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules\/(?!(graphiql|graphql-language-service-parser)\/).*/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.less$/,
        loaders: ['style-loader', 'css-loader', 'less-loader'],
      },
      {
        test: /\.css$/,
        loader: ['style-loader', 'css-loader', 'postcss-loader'],
      },
      {
        test: /\.svg$/,
        loaders: ['babel-loader', 'react-svg-loader'],
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
      graphiql: path.resolve('./node_modules/graphiql'),
      'graphql-language-service-parser': path.resolve(
        './node_modules/graphql-language-service-parser'
      ),
    },
    extensions: ['.mjs', '.js', '.jsx', '.json'],
  },
  plugins,
  externals: [
    {
      xmlhttprequest: '{XMLHttpRequest:XMLHttpRequest}',
    },
  ],
};
