const path = require('path');

module.exports = {
  stories: ['./stories/*.jsx', './stories/gen3-ui-component/index.js'],
  addons: [
    '@storybook/addon-actions',
    {
      name: '@storybook/addon-postcss',
      options: {
        postcssLoaderOptions: {
          implementation: require('postcss'),
        },
      },
    },
  ],
  webpackFinal: (config) => ({
    ...config,
    resolve: {
      ...config.resolve,
      alias: {
        '@src': path.resolve(__dirname, '../src'),
      },
    },
  }),
  core: {
    builder: 'webpack5',
  },
};
