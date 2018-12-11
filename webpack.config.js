const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const nodeExternals = require('webpack-node-externals');
const path = require('path');
const basename = process.env.BASENAME || '/';
const pathPrefix = basename.endsWith('/') ? basename.slice(0, basename.length - 1) : basename;
const app = process.env.APP || 'dev';
const title = {
  acct: 'ACCOuNT Data Commons',
  bhc: 'Brain Commons',
  bpa: 'BPA Data Commons',
  dcf: 'National Cancer Institue Data Commons Framework',
  gtex: 'GTEx & TOPMed Data Commons Submission Portal',
  dev: 'Generic Data Commons',
  edc: 'Environmental Data Commons',
  gdc: 'Jamboree Data Access',
  kf: 'Kids First Data Coordinating Center Portal',
  ndh: 'NIAID Data Hub',
} [app];

const plugins = [
  new webpack.EnvironmentPlugin(['NODE_ENV']),
  new webpack.EnvironmentPlugin(['MOCK_STORE']),
  new webpack.EnvironmentPlugin(['APP']),
  new webpack.EnvironmentPlugin(['BASENAME']),
  new webpack.EnvironmentPlugin(['REACT_APP_PROJECT_ID']),
  new webpack.EnvironmentPlugin(['REACT_APP_ARRANGER_API']),
  new webpack.EnvironmentPlugin(['REACT_APP_DISABLE_SOCKET']),
  new webpack.DefinePlugin({ // <-- key to reducing React's size
    'process.env': {
      'NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'dev'),
      REACT_APP_PROJECT_ID: JSON.stringify(process.env.REACT_APP_PROJECT_ID || 'search'),
      REACT_APP_ARRANGER_API: JSON.stringify(process.env.REACT_APP_ARRANGER_API || '/api/v0/flat-search'),
      REACT_APP_DISABLE_SOCKET: JSON.stringify(process.env.REACT_APP_DISABLE_SOCKET || 'true'),
    }
  }),
  new HtmlWebpackPlugin({
    title: title,
    basename: pathPrefix,
    template: 'src/index.ejs',
    hash: true
  }),
  new webpack.optimize.DedupePlugin(), //dedupe similar code
  new webpack.optimize.AggressiveMergingPlugin(), //Merge chunks
];

if (process.env.NODE_ENV !== 'dev') {
  // This slows things down a lot, so avoid when running local dev environment
  plugins.push(new webpack.optimize.UglifyJsPlugin({
    mangle: false,
  })); //minify everything
}

module.exports = {
  entry: ['babel-polyfill', './src/index.jsx'],
  exclude: '/node_modules/',

  output: {
    path: __dirname,
    filename: 'bundle.js',
    publicPath: basename
  },
  devServer: {
    historyApiFallback: {
      index: 'dev.html',
    },
    disableHostCheck: true,
  },
  module: {
    target: 'node',
    externals: [nodeExternals()],
    loaders: [{
        test: /\.jsx?$/,
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
      {
        test: /\.(png|jpg)$/,
        loaders: [
          'url'
        ],
        query: {
          limit: 8192
        }
      },
      {
        test: /\.flow$/,
        loader: 'ignore-loader'
      }
    ]
  },
  resolve: {
    alias: {
      graphql: path.resolve('./node_modules/graphql'),
      react: path.resolve('./node_modules/react') // Same issue.
    },
    extensions: ['', '.js', '.jsx', '.json']
  },
  plugins,
  externals: [{
    xmlhttprequest: '{XMLHttpRequest:XMLHttpRequest}'
  }]
};