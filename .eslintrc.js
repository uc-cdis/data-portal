module.exports = {
  plugins: ['react'],
  extends: ['airbnb', 'prettier', 'plugin:react/jsx-runtime', 'plugin:storybook/recommended'],
  root: true,
  env: {
    browser: true,
    es6: true,
    jest: true,
  },
  parser: '@babel/eslint-parser',
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 6,
    ecmaFeatures: {
      jsx: true,
      spread: true,
    },
  },
  rules: {
    'default-param-last': 'off',
    'no-restricted-syntax': 'off',
    'no-underscore-dangle': 'off',
    'import/extensions': 'off',
    'react/destructuring-assignment': 'off',
    'react/forbid-prop-types': 'off',
    'react/jsx-curly-brace-presence': 'off',
    'react/jsx-no-bind': 'off',
    'react/jsx-props-no-spreading': 'off',
    'react/no-array-index-key': 'off',
    'react/no-unstable-nested-components': ['error', { allowAsProps: true }],
    'react/require-default-props': 'off',
    'jsx-a11y/label-has-associated-control': [
      'error',
      { required: { some: ['nesting', 'id'] } },
    ],
  },
  overrides: [
    {
      files: ['src/stories/**/*.jsx'],
      rules: { 'import/no-extraneous-dependencies': 'off' },
    },
    {
      files: [
        'src/Submission/SubmitTSV.test.jsx',
        'src/GraphUtils/utils.js',
        'src/GraphUtils/utils.test.js',
        'src/actions.js',
        'data/getSchema.js',
        'data/getConfigParams.js',
        'data/getGqlHelepr.js',
        'src/SessionMonitor/index.js',
        'src/Index/utils.js',
        'src/Workspace/index.jsx',
      ],
      rules: {
        'no-console': 'off', // for logging errors
      },
    },
    {
      files: [
        'src/DataDictionary/GraphCreator.js',
        'src/GraphUtils/testData.js',
        'src/GraphUtils/utils.js',
        'src/Submission/ReduxMapFiles.js',
        'src/Submission/ReduxSubmissionHeader.js',
      ],
      rules: {
        'no-param-reassign': 'off', // for D3 charts
      },
    },
    {
      files: ['src/GraphUtils/testData.js'],
      rules: {
        'no-underscore-dangle': 'off', // for previously named var
      },
    },
    {
      files: ['src/GraphUtils/utils.js'],
      rules: {
        'no-loop-func': 'off', // for D3 config
      },
    },
    {
      files: ['src/QueryNode/QueryForm.jsx'],
      rules: {
        'react/no-unused-state': 'off', // state gets passed
      },
    },
    {
      files: ['data/getSchema.js'],
      rules: {
        'func-names': 'off', // for schema
      },
    },
    {
      files: ['data/getConfigParams.js'],
      rules: {
        'no-useless-escape': 'off',
        'no-template-curly-in-string': 'off',
      },
    },
    {
      files: ['src/components/InputWithIcon.jsx'],
      rules: {
        'react/no-unused-prop-types': 'off',
      },
    },
    {
      files: ['src/redux/**/*.js'],
      rules: { 'import/prefer-default-export': 'off' },
    },
    {
      files: ['src/redux/**/slice.js'],
      rules: { 'no-param-reassign': 'off' },
    },
  ],
};
