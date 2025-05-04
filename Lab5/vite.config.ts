import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// vite.config.ts
export default defineConfig({
  base: '/TypeScript-PNU/Lab5/',
  plugins: [react()],
  build: {
    manifest: true,
    rollupOptions: {
      output: {
        entryFileNames: '[name]-[hash].js',
        chunkFileNames: '[name]-[hash].js',
        assetFileNames: '[name]-[hash].[ext]'
      }
    }
  },
  server: {
    headers: {
      'Content-Type': 'text/javascript'
    }
  }
})