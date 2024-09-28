module.exports = {
    root: true,
    env: {
        node: true
    },
    parser: "@typescript-eslint/parser",
    plugins: [
        "editorconfig",
        "@typescript-eslint"
    ],
    extends: [
        "eslint:recommended",
        "plugin:editorconfig/all",
        "plugin:@typescript-eslint/recommended"
    ],
    ignorePatterns: [
        "node_modules/",
        "dist/",
        "docs/",
        "doc/",
        "apidoc/"
    ],
    rules: {
        "array-bracket-spacing": [ "error", "always" ],
        "arrow-parens": [ "error", "always" ],
        "brace-style": [ "off" ],
        "keyword-spacing": [ "error", {
            overrides: {
                catch: { after: false },
                for:   { after: false },
                if:    { after: false },
                while: { after: false }
            }
        } ],
        "key-spacing": [ "warn", {
            mode: "minimum"
        } ],
        "lines-between-class-members": [ "off" ],
        "no-multi-spaces": [ "off" ],
        "no-multiple-empty-lines": [ "error", {
            max: 5,
            maxBOF: 3,
            maxEOF: 1
        } ],
        "no-use-before-define": [ "off", { classes: false, functions: false } ],
        "no-useless-constructor": [ "off" ],
        "quotes": [ "error", "double" ],
        "quote-props": [ "error", "consistent-as-needed" ],
        "semi": [ "error", "always" ],
        "space-before-function-paren": [ "error", {
            anonymous:  "never",
            named:      "never",
            asyncArrow: "always"
        } ]
    }
};
