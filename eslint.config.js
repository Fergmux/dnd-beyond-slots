import js from '@eslint/js'
import typescriptEslint from '@typescript-eslint/eslint-plugin'
import eslintConfigPrettier from 'eslint-config-prettier'
import eslintPluginPrettier from 'eslint-plugin-prettier'
import eslintPluginPrettierVue from 'eslint-plugin-prettier-vue'
import eslintPluginVue from 'eslint-plugin-vue'

export default [
  js.configs.recommended,
  eslintConfigPrettier,
  ...eslintPluginVue.configs('flat/recommended'),
  {
    plugins: {
      typescriptEslint,
      vuePlugin,
      prettierPlugin: eslintPluginPrettier,
      eslintPluginPrettierVue
    },
    extends: [
      'eslint:recommended',
      '', // Add this line
      'prettier/vue' // Add this line
    ],
    parserOptions: {
      parser: 'babel-eslint'
    },
    rules: {
      'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off'
    }
  }
]
