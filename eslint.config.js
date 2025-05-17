import js from '@eslint/js';
import prettierPlugin from 'eslint-plugin-prettier';
import vuePlugin from 'eslint-plugin-vue';

export default [
  // グローバル設定
  {
    ignores: ['dist/**', 'coverage/**', 'node_modules/**'],
  },

  // JavaScript基本ルール
  js.configs.recommended,

  // CJSファイル用の設定
  {
    files: ['**/*.cjs'],
    languageOptions: {
      sourceType: 'commonjs',
      globals: {
        module: 'writable',
        require: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
      },
    },
  },

  // テスト環境設定
  {
    files: ['tests/**/*.js', 'tests/**/*.ts'],
    languageOptions: {
      globals: {
        describe: 'readonly',
        it: 'readonly',
        expect: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        vi: 'readonly',
      },
    },
  },

  // Vue関連の設定
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        process: 'readonly',
        console: 'readonly',
      },
    },
    rules: {
      'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    },
  },

  // Vueファイル用の設定 - pluginsフォーマットを修正
  ...vuePlugin.configs['flat/essential'],
  {
    files: ['**/*.vue'],
    plugins: {
      vue: vuePlugin,
    },
    languageOptions: {
      globals: {
        process: 'readonly',
        console: 'readonly',
      },
    },
    rules: {
      'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    },
  },

  // Prettier設定
  {
    files: ['**/*.vue', '**/*.js'],
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      'prettier/prettier': 'error',
    },
  },
];
