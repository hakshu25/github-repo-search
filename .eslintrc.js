module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: ['plugin:vue/essential', 'eslint:recommended', '@vue/prettier'],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'prettier/prettier': [
      'error',
      {
        semi: true,
        singleQuote: true,
        trailintComma: 'es5',
      },
    ],
  },
  parserOptions: {
    parser: 'babel-eslint',
  },
};
