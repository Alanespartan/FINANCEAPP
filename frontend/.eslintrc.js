/* eslint-env node */
require("@rushstack/eslint-patch/modern-module-resolution");

module.exports = {
    root: true,
    plugins: [
        "editorconfig"
    ],
    extends: [
        "plugin:vue/vue3-essential",
        "eslint:recommended",
        "plugin:editorconfig/all",
        "@vue/eslint-config-typescript/recommended"
    ],
    rules: {
        "array-bracket-spacing": [ "error", "always" ],
        "arrow-parens": [ "error", "always" ],
        "brace-style": [ "off" ],
        "keyword-spacing": [ "error", {
            overrides: {
                catch: { after: false },
                for: { after: false },
                if: { after: false },
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
            anonymous: "never",
            named: "never",
            asyncArrow: "always"
        } ],

        "editorconfig/indent": [ "error", {
            SwitchCase: 1
        } ]
    }
};
