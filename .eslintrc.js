module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    "preact",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: [
    "@typescript-eslint",
  ],
  rules: {
  },
  ignorePatterns: ['public/*'],
  overrides: [
    {
      files: "*",
      rules: {
        "jest/no-deprecated-functions": "off",
        "no-unused-vars": "off",
        "@typescript-eslint/no-unused-vars": ["error"]
      }
    }
  ]
};
