const js = require('@eslint/js');
const playwright = require('eslint-plugin-playwright');
const globals = require('globals');

module.exports = [
  { ignores: ['playwright-report/', 'test-results/', 'node_modules/'] },
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'commonjs',
      globals: { ...globals.node },
    },
  },
  {
    ...playwright.configs['flat/recommended'],
    files: ['tests/**'],
    rules: {
      ...playwright.configs['flat/recommended'].rules,
      'playwright/expect-expect': 'off',
    },
  },
];
