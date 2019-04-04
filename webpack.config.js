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
  new webpack.optimize.AggressiveMergingPlugin(), //Merge chunks
];

let optimization = {};

if (process.env.NODE_ENV !== 'dev' && process.env.NODE_ENV !== 'auto') {
  optimization = {
    splitChunks: {
      chunks: 'all'
    }
  }
}

module.exports = {
  entry: ['babel-polyfill', './src/index.jsx'],
  target: 'web',
  externals: [nodeExternals()],
  mode: process.env.NODE_ENV !== 'dev' && process.env.NODE_ENV !== 'auto' ? 'production' : 'development',
  output: {
    path: path.resolve(__dirname, 'bundle'),
    filename: '[name].[hash].js',
  },
  optimization: optimization,
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
    rules: [{
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
        },
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
        loaders: ['babel-loader', 'react-svg-loader'],
      },
      {
        test: /\.(png|jpg)$/,
        loaders: 'url-loader',
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
    extensions: ['.mjs', '.js', '.jsx', '.json']
  },
  plugins,
  externals: [{
    xmlhttprequest: '{XMLHttpRequest:XMLHttpRequest}'
  }]
};
