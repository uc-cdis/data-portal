const customWebpackConfig = require('../webpack.config.js');

module.exports = {
  stories: [
    '../src/stories/*.jsx',
    '../src/stories/gen3-ui-component/index.js',
  ],
  addons: ['@storybook/addon-actions'],
  webpackFinal: (config) => {
    return {
      ...config,
      module: { ...config.module, rules: customWebpackConfig.module.rules },
    };
  },
  core: {
    builder: 'webpack5',
  },
};
