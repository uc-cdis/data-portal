const custom = require('./webpack.config.js');

module.exports = {
  staticDirs: ['./public'],
  stories: [
    "../src/**/*.stories.mdx",
    "../src/**/*.stories.@(js|jsx|ts|tsx)"
  ],
  addons: ['@storybook/addon-essentials'],
  framework: {
    name: "@storybook/react-webpack5",
    options: {}
  },
  typescript: {
    reactDocgen: false,
  },
  webpackFinal: (config) => {
    return {
      ...config,
      module: {
        ...config.module,
        rules: custom.module.rules,
      },
      resolve: {
        ...config.resolve,
        ...custom.resolve,
      }
    };
  },
};
