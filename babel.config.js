const config = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: '> 0.25%, not dead',
        shippedProposals: true,
        useBuiltIns: 'usage',
        corejs: '3.10',
      },
    ],
    ['@babel/preset-react', { runtime: 'automatic' }],
  ],
  plugins: [
    ['relay', { compat: true, schema: 'data/schema.json' }],
    '@babel/plugin-transform-runtime',
  ],
  sourceType: 'unambiguous',
};

module.exports = config;
