import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist', 'scripts/**', '_seed_extract.js', 'generate-seed.cjs', 'insert-batch*.cjs']),
  // Browser-side React source
  {
    files: ['src/**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
    },
  },
  // Files exporting both components and helpers: skip Vite Fast Refresh "components only" rule
  {
    files: ['src/lib/**/*.{js,jsx}', 'src/GenericReview.jsx'],
    rules: {
      'react-refresh/only-export-components': 'off',
    },
  },
  // Node-context scripts (Vite config, build helpers)
  {
    files: ['vite.config.js', '_seed_extract.js', '*.cjs', 'scripts/**/*.{js,mjs,cjs}'],
    extends: [js.configs.recommended],
    languageOptions: {
      ecmaVersion: 2022,
      globals: { ...globals.node },
      sourceType: 'module',
    },
    rules: {
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
    },
  },
])
