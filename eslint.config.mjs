import { FlatCompat } from '@eslint/eslintrc';

const compat = new FlatCompat();

const eslintConfig = [
  ...compat.config({
    extends: ['next/core-web-vitals', 'next/typescript', 'prettier'],
    plugins: ['import', 'lodash', 'unused-imports', '@typescript-eslint'],
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
  }),
  {
    files: ['src/**/*.json'],
    rules: {
      'sort-keys': ['error', 'asc', { caseSensitive: true, natural: false }],
      '@typescript-eslint/no-unused-expressions': 'off',
    },
  },
];

export default eslintConfig;
