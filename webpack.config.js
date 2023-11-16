const webpack = require('webpack');
const CompressionPlugin = require('compression-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const portalVersion = require('./package.json').version;

const basename = process.env.BASENAME || '/';
const pathPrefix = basename.endsWith('/')
  ? basename.slice(0, basename.length - 1)
  : basename;

const isProduction = process.env.NODE_ENV === 'production';

const plugins = [
  new CompressionPlugin(),
  new webpack.EnvironmentPlugin({
    MOCK_STORE: null,
    BASENAME: '/',
    PORTAL_VERSION: portalVersion || '',
  }),
  new webpack.DefinePlugin({
    'process.env': {
      LOGOUT_INACTIVE_USERS: !(process.env.LOGOUT_INACTIVE_USERS === 'false'),
      WORKSPACE_TIMEOUT_IN_MINUTES:
        process.env.WORKSPACE_TIMEOUT_IN_MINUTES || 480,
      REACT_APP_PROJECT_ID: JSON.stringify(
        process.env.REACT_APP_PROJECT_ID || 'search'
      ),
      REACT_APP_DISABLE_SOCKET: JSON.stringify(
        process.env.REACT_APP_DISABLE_SOCKET || 'true'
      ),
    },
    // disable React DevTools in production; see https://github.com/facebook/react/pull/11448
    ...(isProduction
      ? { __REACT_DEVTOOLS_GLOBAL_HOOK__: '({ isDisabled: true })' }
      : {}),
  }),
  new HtmlWebpackPlugin({
    title: process.env.TITLE || 'PCDC Data Portal',
    basename: pathPrefix,
    template: 'src/index.ejs',
    connect_src: (() => {
      const rv = {};
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
  new webpack.optimize.AggressiveMergingPlugin(), // Merge chunks
];

let optimization = {};
let devtool = false;

if (isProduction) {
  // optimization for production mode
  optimization = {
    splitChunks: {
      chunks: 'all',
    },
  };
} else {
  // add sourcemap tools for development mode
  devtool = 'eval-source-map';

  // add react-refresh to plugins for development mode
  plugins.push(
    // eslint-disable-next-line global-require
    new (require('@pmmmwh/react-refresh-webpack-plugin'))({ overlay: false })
  );
}

module.exports = {
  entry: './src/index.jsx',
  target: 'web',
  bail: isProduction,
  mode: isProduction ? 'production' : 'development',
  output: {
    path: __dirname,
    filename: isProduction
      ? '[name].[contenthash].bundle.js'
      : '[name].bundle.js',
    publicPath: isProduction ? basename : 'https://localhost:9443/',
  },
  optimization,
  devtool,
  devServer: {
    historyApiFallback: {
      index: 'dev.html',
    },
    allowedHosts: 'all',
    hot: true,
    port: 9443,
    https: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
  module: {
    rules: [
      {
        test: /\.m?js/,
        resolve: {
          fullySpecified: false,
        },
      },
      {
        test: /\.jsx?$/,
        exclude:
          /node_modules\/(?!(graphiql|graphql-language-service-parser)\/).*/,
        loader: 'babel-loader',
        options: isProduction
          ? undefined
          : { plugins: [require.resolve('react-refresh/babel')] },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
      {
        test: /\.svg$/,
        use: ['@svgr/webpack'],
      },
      {
        test: /\.(png|jpg|gif)$/,
        type: 'asset/inline',
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
      },
    ],
  },
  resolve: {
    alias: {
      "@adobe/react-spectrum": path.resolve('./node_modules/@adobe/react-spectrum/dist/main.js'),
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
