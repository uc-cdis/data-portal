module.exports = {
  "plugins": [
    "stylelint-selector-bem-pattern",
  ],
  "rules": {
    "plugin/selector-bem-pattern": {
      "componentName": "[a-z]+",
      "componentSelectors": {
        "initial": "^\\.{componentName}(?:-[a-z]+)?$",
        "combined": "^\\.combined-{componentName}-[a-z]+$"
      },
      "utilitySelectors": "^\\.util-[a-z]+$"
    },
    "color-no-invalid-hex": true,
    "unit-no-unknown": true,
    "property-no-unknown": true,
    "no-descending-specificity": true,
    "no-duplicate-at-import-rules": true,
    "no-duplicate-selectors": true,
    "color-named": "always-where-possible",
    "declaration-no-important": true,
    "length-zero-no-unit": true,
    "declaration-colon-space-after": "always",
    "declaration-colon-space-before": "never",
    "declaration-block-semicolon-newline-after": "always",
    "block-closing-brace-newline-after": "always",
    "block-opening-brace-newline-after": "always",
    "block-opening-brace-space-before": "always",
    "indentation": 2,
  },
};
