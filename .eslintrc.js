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
        ]
    }
};
