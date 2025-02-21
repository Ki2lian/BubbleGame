import js from "@eslint/js";
import stylisticJs from "@stylistic/eslint-plugin-js";
import stylisticTs from "@stylistic/eslint-plugin-ts";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import github from "eslint-plugin-github";
import html from "eslint-plugin-html";
import prettier from "eslint-plugin-prettier";
import prettierRecommended from "eslint-plugin-prettier/recommended";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import unusedImports from "eslint-plugin-unused-imports";
import tseslint from "typescript-eslint";

export default tseslint.config(
    { ignores: [ "dist" ] },
    {
        extends: [ js.configs.recommended, ...tseslint.configs.recommended, prettierRecommended ],
        files: [ "**/*.{ts,tsx,js,jsx}" ],
        plugins: {
            "react-hooks": reactHooks,
            "react-refresh": reactRefresh,
            react,
            html,
            "@typescript-eslint": typescriptEslint,
            "@stylistic/js": stylisticJs,
            "@stylistic/ts": stylisticTs,
            "unused-imports": unusedImports,
            "simple-import-sort": simpleImportSort,
            github,
            prettier,
        },
        rules: {
            ...reactHooks.configs.recommended.rules,
            "react-refresh/only-export-components": [ "warn", { allowConstantExport: true } ],
            "prettier/prettier": "off",
            "no-console": 1,
            "react/jsx-key": "off",
            "react/no-unknown-property": "off",
            "@typescript-eslint/consistent-type-definitions": "error",
            "@typescript-eslint/no-restricted-types": [
                "error",
                {
                    types: {
                        String: {
                            message: "Use `string` instead.",
                        },
                        Boolean: {
                            message: "Use `boolean` instead.",
                        },
                        Number: {
                            message: "Use `number` instead.",
                        },
                        Symbol: {
                            message: "Use `symbol` instead.",
                        },
                        "{}": {
                            message: "{} is ambiguous; consider using a more specific type.",
                        },
                        Object: {
                            message: "Use `object` instead.",
                        },
                        Function: {
                            message: "Avoid using Function; consider typing more explicitly.",
                        },
                    },
                },
            ],
            "@stylistic/ts/type-annotation-spacing": [ "error", { before: false, after: true, overrides: { arrow: { before: true, after: true }}} ],
            "@stylistic/js/indent": [ "error", 4, { SwitchCase: 1 } ],
            "@stylistic/js/object-curly-spacing": [ "error", "always", { arraysInObjects: true, objectsInObjects: false } ],
            "@stylistic/js/key-spacing": [ "error" ],
            "@stylistic/js/keyword-spacing": [ "error", { before: true, after: true } ],
            "@stylistic/js/comma-dangle": [ "error", "always-multiline" ],
            "@stylistic/js/comma-spacing": "error",
            "@stylistic/js/template-curly-spacing": [ "error", "always" ],
            "@stylistic/js/array-bracket-spacing": [ "error", "always" ],
            "@stylistic/js/no-multi-spaces": [ "error" ],
            "@stylistic/js/arrow-spacing": [ "warn", { before: true, after: true } ],
            "@stylistic/js/comma-style": "error",
            "@stylistic/js/dot-location": [ "error", "property" ],
            "@stylistic/js/max-statements-per-line": [ "error", { max: 2 } ],
            "@stylistic/js/no-floating-decimal": "error",
            "@stylistic/js/no-trailing-spaces": [ "error" ],
            "@stylistic/js/jsx-quotes": [ "error", "prefer-double" ],
            "@stylistic/js/quotes": [
                "error",
                "double",
                {
                    avoidEscape: true,
                    allowTemplateLiterals: true,
                },
            ],
            "@stylistic/js/space-before-blocks": "error",
            "@stylistic/js/space-in-parens": "error",
            "@stylistic/js/space-infix-ops": "error",
            "@stylistic/js/space-unary-ops": "error",
            "@stylistic/js/spaced-comment": "error",
            "@stylistic/js/wrap-regex": "error",
            "react/jsx-curly-spacing": [
                "error",
                {
                    when: "always",
                    spacing: {
                        objectLiterals: "never",
                    },
                },
            ],
            curly: [ "error", "multi-line", "consistent" ],
            "max-nested-callbacks": [ "error", { max: 4 } ],
            "no-empty-function": "error",
            "no-inline-comments": "error",
            "no-lonely-if": "error",
            "no-multiple-empty-lines": [ "error", { max: 2, maxEOF: 1, maxBOF: 0 } ],
            "no-var": "error",
            "prefer-const": "error",
            semi: [ "error", "always" ],
            "space-before-function-paren": [
                "error",
                {
                    anonymous: "never",
                    named: "never",
                    asyncArrow: "always",
                },
            ],
            yoda: "error",
            "react/prop-types": [ "off" ],
            "simple-import-sort/imports": "error",
            "simple-import-sort/exports": "error",
            "github/array-foreach": 2,
            "github/no-implicit-buggy-globals": 2,
            "@typescript-eslint/no-unused-vars": "off",
            "no-unused-vars": "off",
            "unused-imports/no-unused-imports": "error",
            "unused-imports/no-unused-vars": [
                "warn",
                {
                    vars: "all",
                    varsIgnorePattern: "^_",
                    args: "after-used",
                    argsIgnorePattern: "^_",
                },
            ],
            "@typescript-eslint/no-require-imports": [ "error" ],
        },
    },
);
