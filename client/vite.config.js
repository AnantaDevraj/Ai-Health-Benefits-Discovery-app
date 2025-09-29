import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Simple Vite config. In dev, the server runs on 5173.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:5000'
    }
  }
})


