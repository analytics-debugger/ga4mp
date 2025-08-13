import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'ga4mp',
      formats: ['es', 'iife', 'umd'],
      fileName: (format) => `ga4mp.${format}.js`
    },
    rollupOptions: {
      output: {
        globals: {
          // Add any global dependencies here if needed
        }
      }
    },
    target: 'es2015'
  },
  plugins: [
    dts({ include: ['src'] })
  ],  
})