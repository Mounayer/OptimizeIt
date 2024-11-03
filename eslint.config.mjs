import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import prettier from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';
import oxlint from 'eslint-plugin-oxlint';
import jest from 'eslint-plugin-jest';

export default [
  {
    files: ['**/*.{js,mjs,cjs,ts}'],
    ignores: ['dist/**', 'examples/**', 'output/**'],
    languageOptions: {
      parser: tsParser,
      globals: { ...globals.browser, ...globals.node, ...globals.jest },
    },
    plugins: {
      prettier,
      '@typescript-eslint': tseslint,
      oxlint,
      jest,
    },
    rules: {
      ...pluginJs.configs.recommended.rules,
      ...tseslint.configs.recommended.rules,
      ...oxlint.configs.recommended.rules,
      'prettier/prettier': 'error',
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
  prettierConfig,
];
