import { FlatCompat } from '@eslint/eslintrc';

const compat = new FlatCompat();

const eslintConfig = [
  ...compat.config({
    extends: ['next/core-web-vitals', 'next/typescript', 'prettier'],
    plugins: ['import', 'unused-imports'],
    rules: {
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'error',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],
      'import/order': [
        'error',
        {
          groups: [
            ['builtin', 'external'],
            ['internal', 'parent', 'sibling', 'index'],
          ],
          'newlines-between': 'always',
        },
      ],
    },
  }),
  {
    files: ['**/*.json'],
    rules: {
      'sort-keys': ['error', 'asc', { caseSensitive: true, natural: false }],
      '@typescript-eslint/no-unused-expressions': 'off',
    },
  },
];

export default eslintConfig;
