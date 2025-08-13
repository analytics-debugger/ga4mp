import { defineConfig } from 'vite'
import { babel } from '@rollup/plugin-babel'

export default defineConfig({
  build: {
    outDir: 'dist',
    emptyOutDir: false, // Don't empty the dist directory
    lib: {
      entry: 'src/index.ts',
      name: 'ga4mp',
      formats: ['iife'],
      fileName: () => 'ga4mp.es5.iife.js'
    },
    rollupOptions: {
      plugins: [
        babel({
          babelHelpers: 'bundled',
          presets: [
            ['@babel/preset-env', { 
              targets: { ie: '11' },
              modules: false
            }]
          ],
          extensions: ['.js', '.ts'],
          exclude: 'node_modules/**'
        })
      ],
      output: {
        format: 'iife',
        name: 'ga4mp',
        globals: {},
        // Force ES5 compatible code generation
        generatedCode: {
          arrowFunctions: false,
          constBindings: false,
          objectShorthand: false
        }
      }
    },
    target: 'es5',
    minify: 'terser' // Use terser for better ES5 compatibility
  },
  esbuild: false, // Disable esbuild, use Babel instead
  plugins: []
})