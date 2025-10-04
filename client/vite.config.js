import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
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
            // Manter React e bibliotecas relacionadas juntas
            if (id.includes('react') || id.includes('react-dom')) {
              return 'vendor-react'
            }
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
