import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { registerSW } from 'virtual:pwa-register'

const updateSW = registerSW({
  onNeedRefresh() {
    // No mostrar el diálogo de actualización automáticamente
    console.log('Nueva versión disponible')
  },
  onOfflineReady() {
    console.log('Aplicación lista para uso offline')
  },
  onRegistered(swRegistration) {
    if (swRegistration) {
      setInterval(() => {
        swRegistration.update().catch(console.error)
      }, 60 * 60 * 1000) // Actualizar cada hora
    }
  },
  onRegisterError(error) {
    console.error('Error durante el registro del SW:', error)
  }
})

// Función para manejar actualizaciones manualmente
window.updateSW = () => updateSW(true)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
