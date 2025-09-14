import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // Porta personalizada
  },
  build: {
    // Altera limite de aviso (opcional)
    chunkSizeWarningLimit: 700,
    rollupOptions: {
      output: {
        // Manual chunks para separar bibliotecas grandes
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react')) return 'vendor-react'
            if (id.includes('react-dom')) return 'vendor-react-dom'
            if (id.includes('react-admin')) return 'vendor-react-admin'
            if (id.match(/@mui|material|@emotion/)) return 'vendor-mui'
            if (id.includes('zod')) return 'vendor-zod'
            // fallback: agrupar outras dependências em vendor
            return 'vendor'
          }
        },
      },
    },
  },
})
