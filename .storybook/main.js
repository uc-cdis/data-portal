const custom = require('./webpack.config.js');


module.exports = {
  stories: [
    "../src/**/*.stories.mdx",
    "../src/**/*.stories.@(js|jsx|ts|tsx)"
  ],
  addons: ['@storybook/addon-actions'],
  framework: "@storybook/react",
  webpackFinal: (config) => {
    return {
      ...config,
      module: {
        ...config.module,
        rules: custom.module.rules, // babel, sass, fonts and images loaders
      },
      resolve: {
        ...config.resolve,
        ...custom.resolve, // custom imports resolvers
      }
    };
  },
};
