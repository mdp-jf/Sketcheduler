// eslint.config.js
import eslint from '@eslint/js';
import vue from 'eslint-plugin-vue';
import * as tseslint from 'typescript-eslint';
import prettierPlugin from 'eslint-plugin-prettier';
import globals from 'globals';

export default [
  // Ignore patterns
  {
    ignores: ['node_modules/**', 'dist/**', '*.min.js', '*.d.ts'],
  },

  // Global settings for all files
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },

  // Base ESLint config
  eslint.configs.recommended,

  // TypeScript flat configs
  ...tseslint.configs.recommended,

  // Vue config - Updated parser configuration
  {
    files: ['**/*.vue'],
    plugins: {
      vue,
    },
    languageOptions: {
      parser: vue.parser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        parser: {
          // Use TS parser for <script> tags
          ts: tseslint.parser,
          // Use TS parser for <script lang="ts"> blocks
          '<script lang="ts">': tseslint.parser,
        },
        extraFileExtensions: ['.vue'],
      },
    },
    rules: {
      'vue/no-parsing-error': 'off',
      'vue/multi-word-component-names': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },

  // Custom rules for all files
  {
    files: ['**/*.{js,ts,vue}'],
    rules: {
      'no-console': 'off', // Allow console for development
      'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    },
  },

  // Prettier config
  {
    files: ['**/*.{js,ts,vue}'],
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      'prettier/prettier': 'error',
    },
  },
];
