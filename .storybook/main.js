const path = require('path');
const customWebpackConfig = require('../webpack.config.js');

module.exports = {
  stories: ['./stories/*.jsx', './stories/gen3-ui-component/index.js'],
  addons: ['@storybook/addon-actions'],
  webpackFinal: (config) => {
    return {
      ...config,
      module: { ...config.module, rules: customWebpackConfig.module.rules },
      resolve: {
        ...config.resolve,
        alias: {
          '@src': path.resolve(__dirname, '../src'),
        },
      },
    };
  },
  core: {
    builder: 'webpack5',
  },
};
