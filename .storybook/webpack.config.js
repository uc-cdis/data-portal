module.exports = {
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loaders: ['babel-loader'],
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
        test: /\.(png|jpg|eot|ttf|woff|woff2)$/,
        loader: 'url-loader',
      },
      { test: /\.flow$/, loader: 'ignore-loader' },
    ],
  },
};
