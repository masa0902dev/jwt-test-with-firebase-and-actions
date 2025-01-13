module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript",
    "google",
    "plugin:@typescript-eslint/recommended",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    // これによってfunctions内のエラーは治った
    project: ["./tsconfig.json"],
    sourceType: "module",
  },
  ignorePatterns: ["/lib/**/*", "/generated/**/*"],
  plugins: ["@typescript-eslint", "import"],
  rules: {
    "quotes": ["error", "double"],
    "import/no-unresolved": 0,
    "indent": ["error", 2],
    "object-curly-spacing": "off",
    "new-cap": ["error", { capIsNew: false }],
    "max-len": ["error", { code: 1000 }],
    "one-var": ["error", { initialized: "never" }],
    // NOTE: https://runebook.dev/ja/docs/eslint/rules/comma-dangle#:~:text=%E6%9C%AB%E5%B0%BE%E3%81%AB%E3%82%AB%E3%83%B3%E3%83%9E%E3%81%8C%E5%BF%85%E8%A6%81%E3%81%A7%E3%81%99
    "comma-dangle": ["error", "always-multiline"],
  },
};
