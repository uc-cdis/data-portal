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
  webpackFinal: (config) => {
    const index = config.module.rules.findIndex((e) => e.test?.test?.('.svg'));
    const reString = config.module.rules[index].test.source;
    config.module.rules[index].test = new RegExp(reString.replace('svg|', ''));
    config.module.rules.push({ test: /\.svg$/, use: ['@svgr/webpack'] });

    config.resolve.alias = { '@src': path.resolve(__dirname, '../src') };

    return config;
  },
  core: {
    builder: 'webpack5',
  },
};
