import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  // Determine if we're running in dev or production
  const isDevelopment = command === 'serve';
  
  return {
    plugins: [react()],
    // In development, use /homelab/ as the base path
    // In production, use /sprite_spinner/ as the base path
    base: isDevelopment ? '/homelab/' : '/sprite_spinner/',
    build: {
      rollupOptions: {
        output: {
          entryFileNames: 'assets/[name].js',
          chunkFileNames: 'assets/[name]-[hash].js',
          assetFileNames: 'assets/[name][extname]'
        }
      }
    }
  }
})
