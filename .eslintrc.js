module.exports = {
  extends: ['next/core-web-vitals', 'next'],
  parserOptions: {
    project: './tsconfig.json',
  },
  rules: {
    'react/no-unescaped-entities': 'off',
  },
};
