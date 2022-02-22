module.exports = {
  // "extends": "eslint:recommended",
  extends: 'airbnb',
  settings: {
    react: {
      pragma: 'React',
      version: '16.14',
    },
    'import/resolver': {
      typescript: {}, // this loads <rootdir>/tsconfig.json to eslint
    },
  },
  root: true,
  env: {
    browser: true,
    es6: true,
    jest: true,
  },
  globals: {
    JSX: true,
  },
  plugins: [
    'react',
    'react-hooks',
    'jsx-a11y',
    'import',
  ],
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 6,
    ecmaFeatures: {
      jsx: true,
      spread: true,
    },
  },
  rules: {
    'no-underscore-dangle': 'off',
    indent: [
      'error',
      2,
    ],
    'linebreak-style': [
      'error',
      'unix',
    ],
    quotes: [
      'error',
      'single',
    ],
    'jsx-quotes': [
      'error',
      'prefer-single',
    ],
    semi: [
      'error',
      'always',
    ],
    'max-classes-per-file': ['error', 2],
    'max-len': [
      'error',
      {
        code: 150,
        ignoreComments: true,
        ignoreTrailingComments: true,
        ignoreUrls: true,
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
      },
    ],
    'prefer-destructuring': [
      'error',
      { object: true, array: false },
    ],
    'react/jsx-fragments': [
      'error',
      'element',
    ],
    'jsx-a11y/label-has-associated-control': [2, {
      labelAttributes: ['label'],
      controlComponents: ['Switch', 'Input'],
      depth: 3,
    }],
    'jsx-a11y/anchor-is-valid': ['off'],
    // see https://github.com/clayne11/eslint-import-resolver-meteor/issues/17
    // - seems to affect Codacy :-(
    'import/extensions': ['off', 'never'],
    'import/no-cycle': 'off',
    'prefer-promise-reject-errors': 'off',
    'react/jsx-indent': 'off',
    'react/forbid-prop-types': 'off',
    'react/prefer-stateless-function': 'off',
    'react/jsx-curly-brace-presence': ['off'],
    'function-paren-newline': ['off'],
    'react/no-array-index-key': ['off'],
    'react/destructuring-assignment': ['off'],
    'react/jsx-one-expression-per-line': ['off'],
    'react/jsx-props-no-spreading': ['off'],
    'react-hooks/rules-of-hooks': 'error', // Checks rules of Hooks
    'react-hooks/exhaustive-deps': 'warn', // Checks effect dependencies
  },
  overrides: [
    {
      files: [
        'src/Submission/SubmitTSV.test.jsx',
        'src/GraphUtils/utils.js',
        'src/GraphUtils/utils.test.js',
        'src/actions.js',
        'data/getSchema.js',
        'data/getTexts.js',
        'data/gqlSetup.js',
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
        'src/Submission/SubmitTSV.jsx',
        'src/Submission/SubmissionResult.jsx',
        'src/CoreMetadata/reduxer.js', // for reducer
      ],
      rules: {
        'no-unused-vars': 'off', // for 'brace' - required by AceEditor
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
      files: [
        'src/GraphUtils/testData.js',
      ],
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
      files: ['data/getTexts.js'],
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
    // Linting settings for Typescript
    {
      files: ['*.ts', '*.tsx'],
      parser: '@typescript-eslint/parser',
      plugins: ['@typescript-eslint'],
      parserOptions: {
        ecmaversion: 2018,
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
      settings: {
        react: {
          version: 'detect',
        },
      },
      rules: {
        'no-use-before-define': 'off',
        '@typescript-eslint/no-use-before-define': ['error'],
        '@typescript-eslint/no-explicit-any': 'off',
        'no-unused-vars': 'off',
        '@typescript-eslint/no-unused-vars': ['error'],
        'no-shadow': 'off',
        '@typescript-eslint/no-shadow': ['error'],
        'react/jsx-filename-extension': [1, { extensions: ['.tsx', '.ts', '.d.ts'] }],
        'react/prop-types': 'off', // prefer declaring props with interfaces
      },
    },
  ],
};
