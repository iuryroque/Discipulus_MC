import { CssBaseline, ThemeProvider } from '@mui/material'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import myTheme from './theme/myTheme'
import { registerSW } from 'virtual:pwa-register'

// Register service worker
const updateSW = registerSW({
  onNeedRefresh() {
    if (confirm('Nova versão disponível! Deseja atualizar?')) {
      updateSW(true)
    }
  },
  onOfflineReady() {
    console.log('App pronto para funcionar offline!')
  },
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider theme={myTheme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </StrictMode>,
)
