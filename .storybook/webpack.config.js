module.exports = {
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loaders: ['babel-loader'],
      },
      {
        test: /\.css$/,
        loader: ['style-loader', 'css-loader', 'postcss-loader'],
      },
      {
        test: /\.svg$/,
        loaders: ['babel-loader', '@svgr/webpack'],
      },
      {
        test: /\.(png|jpg|eot|ttf|woff|woff2)$/,
        loader: 'asset/inline',
      },
    ],
  },
};
