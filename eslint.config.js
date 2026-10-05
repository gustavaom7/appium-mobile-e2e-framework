import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default [
  { ignores: ['node_modules/**', 'reports/**', 'logs/**', 'apps/**'] },
  {
    files: ['eslint.config.js'],
    languageOptions: { sourceType: 'module', globals: globals.node },
    rules: js.configs.recommended.rules,
  },
  js.configs.recommended,
  ...tseslint.configs.recommended.map((config) => ({ ...config, files: config.files ?? ['**/*.ts'] })),
  {
    files: ['**/*.ts'],
    rules: {
      // TypeScript already checks this; avoids false positives on TS-only globals.
      'no-undef': 'off',
      '@typescript-eslint/no-unused-vars': ['error', { ignoreRestSiblings: true, argsIgnorePattern: '^_' }],
      // Fixed sleeps are the #1 source of flaky mobile tests: wait on a condition instead.
      'no-restricted-properties': [
        'error',
        { object: 'driver', property: 'pause', message: 'Use waitForDisplayed / waitUntil instead of a fixed sleep.' },
        { object: 'browser', property: 'pause', message: 'Use waitForDisplayed / waitUntil instead of a fixed sleep.' },
      ],
    },
  },
  {
    // Screen Objects own the selectors; specs talk to screens, not to the driver.
    files: ['tests/**/*.ts'],
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          selector: "CallExpression[callee.name=/^\\$\\$?$/]",
          message: 'Locate elements in a Screen Object (screens/), not in the spec.',
        },
      ],
    },
  },
];
