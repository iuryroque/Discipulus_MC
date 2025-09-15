import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { CssBaseline, ThemeProvider } from '@mui/material'
import App from './App.jsx'
import './index.css'
import myTheme from './theme/myTheme'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider theme={myTheme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </StrictMode>,
)
