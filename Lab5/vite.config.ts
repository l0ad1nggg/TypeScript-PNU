import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// vite.config.ts
export default defineConfig({
  base: '/', // Для Vercel залишаємо кореневий шлях
  plugins: [react()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      output: {
        assetFileNames: 'assets/[name].[ext]'
      }
    }
  }
})