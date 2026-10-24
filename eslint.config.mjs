import eslint from '@eslint/js';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTypescript from 'eslint-config-next/typescript';
import importPlugin from 'eslint-plugin-import-x';
import lodashPlugin from 'eslint-plugin-lodash';
import prettierRecommended from 'eslint-plugin-prettier/recommended';
import unusedImports from 'eslint-plugin-unused-imports';
import tseslint from 'typescript-eslint';

const eslintConfig = [
  eslint.configs.recommended,
  ...nextVitals,
  ...nextTypescript,
  prettierRecommended,

  {
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      'import-x': importPlugin,
      lodash: lodashPlugin,
      'unused-imports': unusedImports,
    },

    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          args: 'after-used',
          argsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
          ignoreRestSiblings: true,
          vars: 'all',
          varsIgnorePattern: '^_',
        },
      ],
      curly: ['error', 'all'],
      eqeqeq: ['error', 'always'],
      'import-x/no-duplicates': 'error',
      'import-x/order': [
        'error',
        {
          alphabetize: {
            caseInsensitive: true,
            order: 'asc',
          },
          groups: [['builtin', 'external'], ['internal'], ['parent', 'sibling', 'index']],
          'newlines-between': 'always',
          pathGroups: [{ group: 'internal', pattern: '@/**' }],
          pathGroupsExcludedImportTypes: ['builtin'],
        },
      ],
      'import/order': 'off',
      'lodash/import-scope': ['error', 'method'],
      'sort-imports': [
        'error',
        {
          allowSeparatedGroups: true,
          ignoreCase: true,
          ignoreDeclarationSort: true,
          ignoreMemberSort: false,
          memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single'],
        },
      ],
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': 'off',
    },
  },
  {
    rules: {
      'prettier/prettier': ['error', { endOfLine: 'auto' }],
    },
  },
  {
    ignores: ['node_modules/**', '.next/**', 'out/**', 'build/**', 'coverage/**', 'next-env.d.ts'],
  },
  {
    files: ['src/**/*.json'],
    rules: {
      '@typescript-eslint/no-unused-expressions': 'off',
      'sort-keys': ['error', 'asc', { caseSensitive: false, natural: false }],
    },
  },
];

export default eslintConfig;
