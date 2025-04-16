import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import './styles/animations.css'
import App from './App.jsx'
import { registerSW } from 'virtual:pwa-register'
import './i18n/i18n' // Importar configuración de i18n

// Registrar el Service Worker para PWA
const updateSW = registerSW({
  onNeedRefresh() {
    if (confirm('Hay una nueva versión disponible. ¿Quieres actualizar?')) {
      updateSW(true)
    }
  },
  onOfflineReady() {
    console.log('La aplicación está lista para uso offline')
  },
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
