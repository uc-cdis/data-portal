const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const fs = require('fs');

const basename = process.env.BASENAME || '/';
const basenameWithTrailingSlash = basename.endsWith('/') ? basename : `${basename}/`;
const pathPrefix = basename.endsWith('/') ? basename.slice(0, basename.length - 1) : basename;
const app = process.env.APP || 'dev';

const configFileName = (app === 'dev') ? 'default' : app;
// eslint-disable-next-line import/no-dynamic-require
const configFile = require(`./data/config/${configFileName}.json`);
const { DAPTrackingURL, gaTrackingId } = configFile;
const scriptSrcURLs = [];
const connectSrcURLs = [];
const imgSrcURLs = [];
if (DAPTrackingURL) {
  scriptSrcURLs.push(DAPTrackingURL);
  connectSrcURLs.push(DAPTrackingURL);
}
if (gaTrackingId?.startsWith('UA-') || gaTrackingId?.startsWith('G-')) {
  scriptSrcURLs.push(...['https://www.google-analytics.com', 'https://ssl.google-analytics.com', 'https://www.googletagmanager.com']);
  connectSrcURLs.push(...['https://www.google-analytics.com', 'https://*.analytics.google.com', 'https://analytics.google.com', 'https://*.g.doubleclick.net']);
  imgSrcURLs.push('https://www.google-analytics.com', 'https://*.g.doubleclick.net', 'https://*.google.com');
} else {
  console.log('Unknown GA tag, skipping GA setup...');
}
if (process.env.DATA_UPLOAD_BUCKET) {
  connectSrcURLs.push(`https://${process.env.DATA_UPLOAD_BUCKET}.s3.amazonaws.com`);
}
// add any extra URLs that should be whitelisted
if (configFile.connectSrcCSPWhitelist && configFile.connectSrcCSPWhitelist.length > 0) {
  connectSrcURLs.push(...configFile.connectSrcCSPWhitelist);
}
if (configFile.featureFlags && configFile.featureFlags.discoveryUseAggMDS) {
  connectSrcURLs.push('https://dataguids.org');
}
if (configFile.featureFlags && configFile.featureFlags.studyRegistration) {
  connectSrcURLs.push('https://clinicaltrials.gov');
}
if (process.env.DATADOG_APPLICATION_ID && process.env.DATADOG_CLIENT_TOKEN) {
  connectSrcURLs.push('https://*.logs.datadoghq.com');
  connectSrcURLs.push('https://*.browser-intake-ddog-gov.com');
}
if (configFile.grafanaFaroConfig?.grafanaFaroEnable) {
  if (configFile.grafanaFaroConfig?.grafanaFaroUrl) {
    connectSrcURLs.push(configFile.grafanaFaroConfig.grafanaFaroUrl);
  } else {
    connectSrcURLs.push('https://faro.planx-pla.net');
  }
}
if (process.env.MAPBOX_API_TOKEN) {
  connectSrcURLs.push('https://*.tiles.mapbox.com');
  connectSrcURLs.push('https://api.mapbox.com');
  connectSrcURLs.push('https://events.mapbox.com');
}
const iFrameApplicationURLs = [];
if (configFile && configFile.analysisTools) {
  configFile.analysisTools.forEach((e) => {
    if (e.applicationUrl) {
      iFrameApplicationURLs.push(e.applicationUrl);
    }
  });
}

// returns the last modified time of the CSS file
function getCSSVersion() {
  const overridesCss = './src/css/themeoverrides.css';
  if (!fs.existsSync(overridesCss)) {
    console.warn(`${overridesCss} does not exist`);
    return ('');
  }
  const stats = fs.statSync(overridesCss);
  return (stats.mtime.getTime());
}

const plugins = [
  new webpack.EnvironmentPlugin(['NODE_ENV']),
  new webpack.EnvironmentPlugin({ MOCK_STORE: null }),
  new webpack.EnvironmentPlugin(['APP']),
  new webpack.EnvironmentPlugin({ BASENAME: '/' }),
  new webpack.EnvironmentPlugin(['LOGOUT_INACTIVE_USERS']),
  new webpack.EnvironmentPlugin(['WORKSPACE_TIMEOUT_IN_MINUTES']),
  new webpack.EnvironmentPlugin(['REACT_APP_PROJECT_ID']),
  new webpack.EnvironmentPlugin(['REACT_APP_DISABLE_SOCKET']),
  new webpack.EnvironmentPlugin(['TIER_ACCESS_LEVEL']),
  new webpack.EnvironmentPlugin(['TIER_ACCESS_LIMIT']),
  new webpack.EnvironmentPlugin(['FENCE_URL']),
  new webpack.EnvironmentPlugin(['INDEXD_URL']),
  new webpack.EnvironmentPlugin(['USE_INDEXD_AUTHZ']),
  new webpack.EnvironmentPlugin(['WORKSPACE_URL']),
  new webpack.EnvironmentPlugin(['WTS_URL']),
  new webpack.EnvironmentPlugin(['MANIFEST_SERVICE_URL']),
  new webpack.EnvironmentPlugin(['MAPBOX_API_TOKEN']),
  new webpack.EnvironmentPlugin(['DATADOG_APPLICATION_ID']),
  new webpack.EnvironmentPlugin(['DATADOG_CLIENT_TOKEN']),
  new webpack.EnvironmentPlugin(['DATA_UPLOAD_BUCKET']),
  new webpack.EnvironmentPlugin(['GEN3_BUNDLE']),
  new webpack.DefinePlugin({ // <-- key to reducing React's size
    'process.env': {
      NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'dev'),
      LOGOUT_INACTIVE_USERS: !(process.env.LOGOUT_INACTIVE_USERS === 'false'),
      WORKSPACE_TIMEOUT_IN_MINUTES: process.env.WORKSPACE_TIMEOUT_IN_MINUTES || 480,
      REACT_APP_PROJECT_ID: JSON.stringify(process.env.REACT_APP_PROJECT_ID || 'search'),
      REACT_APP_DISABLE_SOCKET: JSON.stringify(process.env.REACT_APP_DISABLE_SOCKET || 'true'),
    },
  }),
  new HtmlWebpackPlugin({
    title: configFile.components.appName || 'Generic Data Commons',
    metaDescription: configFile.components.metaDescription || '',
    basename: pathPrefix,
    cssVersion: getCSSVersion(),
    template: 'src/index.ejs',
    connectSrc: ((() => {
      const rv = {};
      if (typeof process.env.FENCE_URL !== 'undefined') {
        rv[(new URL(process.env.FENCE_URL)).origin] = true;
      }
      if (typeof process.env.INDEXD_URL !== 'undefined') {
        rv[(new URL(process.env.INDEXD_URL)).origin] = true;
      }
      if (typeof process.env.WORKSPACE_URL !== 'undefined') {
        rv[(new URL(process.env.WORKSPACE_URL)).origin] = true;
      }
      if (typeof process.env.WTS_URL !== 'undefined') {
        rv[(new URL(process.env.WTS_URL)).origin] = true;
      }
      if (typeof process.env.MANIFEST_SERVICE_URL !== 'undefined') {
        rv[(new URL(process.env.MANIFEST_SERVICE_URL)).origin] = true;
      }
      if (iFrameApplicationURLs.length > 0) {
        iFrameApplicationURLs.forEach((url) => {
          rv[(new URL(url)).origin] = true;
        });
      }
      if (connectSrcURLs.length > 0) {
        connectSrcURLs.forEach((url) => {
          rv[(new URL(url)).origin] = true;
        });
      }
      return Object.keys(rv).join(' ');
    })()),
    scriptSrc: ((() => {
      const rv = {};
      if (scriptSrcURLs.length > 0) {
        scriptSrcURLs.forEach((url) => {
          rv[(new URL(url)).origin] = true;
        });
      }
      return Object.keys(rv).join(' ');
    })()),
    imgSrc: ((() => {
      const rv = {};
      if (imgSrcURLs.length > 0) {
        imgSrcURLs.forEach((url) => {
          rv[(new URL(url)).origin] = true;
        });
      }
      return Object.keys(rv).join(' ');
    })()),
    dapURL: DAPTrackingURL,
    hash: true,
    chunks: ['vendors~bundle', 'bundle'],
  }),
  /*
  Can do this kind of thing to deploy multi-page apps in the future ...
  new HtmlWebpackPlugin({
    title: "Gen3 Workspaces",
    filename: "workspaces.html",
    template: 'src/index.ejs',
    hash: true,
    chunks: ['vendors~bundle~workspaceBundle', 'workspaceBundle']
  }),
  */
  new webpack.optimize.AggressiveMergingPlugin(), // Merge chunks
];

const allowedHosts = process.env.HOSTNAME ? [process.env.HOSTNAME] : 'auto';

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

const entry = {
  bundle: './src/index.jsx',
  workspaceBundle: './src/workspaceIndex.jsx',
  covid19Bundle: './src/covid19Index.jsx',
  nctBundle: './src/nctIndex.jsx',
  ecosystemBundle: './src/ecosystemIndex.jsx',
};

// if GEN3_BUNDLE is set with a value
if (process.env.GEN3_BUNDLE) {
  switch (process.env.GEN3_BUNDLE) {
  case 'workspace':
    // Just build the workspace bundle as bundle.js
    entry.bundle = entry.workspaceBundle;
    delete entry.workspaceBundle;
    delete entry.covid19Bundle;
    delete entry.nctBundle;
    delete entry.ecosystemBundle;
    break;
  case 'covid19':
    entry.bundle = entry.covid19Bundle;
    delete entry.workspaceBundle;
    delete entry.covid19Bundle;
    delete entry.nctBundle;
    delete entry.ecosystemBundle;
    break;
  case 'nct':
    entry.bundle = entry.nctBundle;
    delete entry.workspaceBundle;
    delete entry.covid19Bundle;
    delete entry.nctBundle;
    delete entry.ecosystemBundle;
    break;
  case 'heal':
  case 'ecosystem':
    entry.bundle = entry.ecosystemBundle;
    delete entry.workspaceBundle;
    delete entry.covid19Bundle;
    delete entry.nctBundle;
    delete entry.ecosystemBundle;
    break;
  default:
    // by default we build for commons bundle
    delete entry.workspaceBundle;
    delete entry.covid19Bundle;
    delete entry.nctBundle;
    delete entry.ecosystemBundle;
    break;
  }
}
// else - if GEN3_BUNDLE is NOT set then build all entry points
//    note that runWebpack ensures GEN3_BUNDLE is set,
//    and the Dockerfile leaves it unset ...

module.exports = {
  entry,
  target: 'web',
  externals: [{
    xmlhttprequest: '{XMLHttpRequest:XMLHttpRequest}',
  }],
  mode: process.env.NODE_ENV !== 'dev' && process.env.NODE_ENV !== 'auto' ? 'production' : 'development',
  output: {
    path: __dirname,
    filename: '[name].js',
    publicPath: basenameWithTrailingSlash,
  },
  optimization,
  devtool,
  devServer: {
    historyApiFallback: {
      index: 'dev.html',
    },
    compress: true,
    hot: true,
    port: 9443,
    server: 'https',
    host: 'localhost',
    allowedHosts,
    client: {
      overlay: {
        warnings: false,
        errors: true,
      },
    },
  },
  module: {
    rules: [{
    //   test: /\.tsx?$/,
    //   exclude: /node_modules\/(?!(graphiql|graphql-language-service-parser)\/).*/,
    //   use: {
    //     loader: 'ts-loader',
    //   },
    // },
    // {
      test: /\.jsx?$|\.tsx?$/,
      exclude: /node_modules\/(?!(graphiql|graphql-language-service-parser)\/).*/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env', '@babel/react'],
          plugins: ['@babel/plugin-proposal-class-properties'],
        },
      },
    },
    {
      test: /\.js$/,
      include: /node_modules\/(marked\/).*/,
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
      loaders: [
        'style-loader',
        'css-loader',
        'less-loader',
      ],
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
      'graphql-language-service-parser': path.resolve('./node_modules/graphql-language-service-parser'),
    },
    extensions: ['.mjs', '.js', '.jsx', '.ts', '.tsx', '.json'],
  },
  plugins,
};
