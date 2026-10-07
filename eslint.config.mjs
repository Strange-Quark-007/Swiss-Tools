import eslint from '@eslint/js';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTypescript from 'eslint-config-next/typescript';
import prettier from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import';
import lodashPlugin from 'eslint-plugin-lodash';
import unusedImports from 'eslint-plugin-unused-imports';
import tseslint from 'typescript-eslint';

const eslintConfig = [
  eslint.configs.recommended,

  ...nextVitals,
  ...nextTypescript,

  {
    plugins: {
      import: importPlugin,
      lodash: lodashPlugin,
      'unused-imports': unusedImports,
      '@typescript-eslint': tseslint.plugin,
    },

    rules: {
      curly: ['error', 'all'],
      eqeqeq: ['error', 'always'],
      'lodash/import-scope': ['error', 'method'],
      'unused-imports/no-unused-vars': 'off',
      'unused-imports/no-unused-imports': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          vars: 'all',
          args: 'after-used',
          ignoreRestSiblings: true,
          varsIgnorePattern: '^_',
          argsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      'import/order': [
        'error',
        {
          groups: [['builtin', 'external'], ['internal'], ['parent', 'sibling', 'index']],
          'newlines-between': 'always',
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],
    },
  },
  prettier,
  {
    ignores: ['node_modules/**', '.next/**', 'out/**', 'build/**', 'next-env.d.ts'],
  },
  {
    files: ['src/**/*.json'],
    rules: {
      'sort-keys': ['error', 'asc', { caseSensitive: true, natural: false }],
      '@typescript-eslint/no-unused-expressions': 'off',
    },
  },
];

export default eslintConfig;
