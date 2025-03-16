import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  // Set the base path to match your GitHub Pages URL
  base: '/',
  build: {
    // Generate the output to the correct folder
    outDir: 'dist',
    // Make sure asset paths are correctly generated
    assetsDir: 'assets',
  }
})