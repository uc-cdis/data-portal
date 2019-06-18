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
      "jsx-quotes": [
        "error",
        "prefer-single",
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
      "react/destructuring-assignment" : ["off, ignore"],
  },
  "overrides": [
    {
      "files": [
        "src/Submission/SubmitTSV.test.jsx",
        "src/GraphUtils/utils.js",
        "src/GraphUtils/utils.test.js",
        "src/actions.js",
        "data/getSchema.js",
        "data/getTexts.js",
        "data/gqlSetup.js",
        "src/SessionMonitor/index.js",
        "src/Index/utils.js",
        "src/Workspace/index.jsx",
      ],
      "rules": {
        "no-console": "off" // for logging errors
      }
    },
    {
      "files": [
        "src/Submission/SubmitTSV.jsx",
        "src/Submission/SubmissionResult.jsx",
        "src/CoreMetadata/reduxer.js", // for reducer
      ],
      "rules": {
        "no-unused-vars": "off" // for 'brace' - required by AceEditor
      }
    },
    {
      "files": [
        "src/DataDictionary/GraphCreator.js",
        "src/GraphUtils/testData.js",
        "src/GraphUtils/utils.js",
        "src/Submission/ReduxMapFiles.js",
        "src/Submission/ReduxSubmissionHeader.js",
      ],
      "rules": {
        "no-param-reassign": "off" // for D3 charts
      }
    },
    {
      "files": [
        "src/GraphUtils/testData.js",
      ],
      "rules": {
        "no-underscore-dangle": "off" // for previously named var
      }
    },
    {
      "files": [ "src/GraphUtils/utils.js" ],
      "rules": {
        "no-loop-func": "off" // for D3 config
      }
    },
    {
      "files": [ "src/Explorer/ExplorerTable.jsx" ],
      "rules": {
        "jsx-a11y/anchor-is-valid": "off" // for relative links
      }
    },
    {
      "files": [ "src/QueryNode/QueryForm.jsx" ],
      "rules": {
        "react/no-unused-state": "off" // state gets passed
      }
    },
    {
      "files": [ "data/getSchema.js" ],
      "rules": {
        "func-names": "off" // for schema
      }
    },
    {
      "files": [ "data/getTexts.js" ],
      "rules": {
        "no-useless-escape": "off",
        "no-template-curly-in-string": "off",
      }
    },
    {
      "files": ["src/components/InputWithIcon.jsx"],
      "rules": {
        "react/no-unused-prop-types": "off"
      }
    }
  ],
};
