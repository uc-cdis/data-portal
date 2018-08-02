module.exports = {
  //"extends": "eslint:recommended",
  "extends": "airbnb",
  "root":true,
  "env": {
      "browser": true,
      "es6": true,
      "jest": true
  },
  "parser": "babel-eslint",
  "parserOptions": {
      "sourceType": "module",
      "ecmaVersion": 6,
      "ecmaFeatures": {
        "jsx": true,
        "spread": true
      },
  },
  "rules": {
      "indent": [
          "error",
          2
      ],
      "linebreak-style": [
          "error",
          "unix"
      ],
      "quotes": [
          "error",
          "single"
      ],
      "semi": [
          "error",
          "always"
      ],
      // see https://github.com/clayne11/eslint-import-resolver-meteor/issues/17
      // - seems to affect Codacy :-(
      "import/extensions": ["off", "never"],
      "react/jsx-indent": "off",
      "react/forbid-prop-types": "off",
      "react/prefer-stateless-function": "off",
      "react/jsx-curly-brace-presence": ["off", "ignore"],
      "function-paren-newline": ["off", "ignore"],
      "react/no-array-index-key" : ["off, ignore"],
  },
  "overrides": [
    {
      "files": [
        "src/Submission/SubmitTSV.test.jsx",
        "src/DataModelGraph/utils.js",
        "src/DataModelGraph/utils.test.js",
        "src/actions.js",
      ],
      "rules": {
        "no-console": "off" // for logging errors
      }
    },
    {
      "files": [
        "src/Submission/SubmitTSV.jsx",
        "src/Submission/SubmissionResult.jsx",
      ],
      "rules": {
        "no-unused-vars": "off" // for 'brace' - required by AceEditor
      }
    },
    {
      "files": [
        "src/DataDictionary/GraphCreator.js",
        "src/DataModelGraph/SvgGraph.jsx",
        "src/DataModelGraph/testData.js",
      ],
      "rules": {
        "no-param-reassign": "off" // for D3 charts
      }
    },
    {
      "files": [
        "src/DataModelGraph/testData.js",
      ],
      "rules": {
        "no-underscore-dange": "off" // for previously name var
      }
    }
  ],
};
