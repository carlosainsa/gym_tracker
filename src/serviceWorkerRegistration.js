// Función para registrar el service worker
export function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/service-worker.js')
        .then(registration => {
          console.log('Service Worker registrado con éxito:', registration.scope);
        })
        .catch(error => {
          console.error('Error al registrar el Service Worker:', error);
        });
    });
  }
}

// Función para enviar un mensaje al service worker
export function sendMessageToSW(message) {
  return new Promise((resolve, reject) => {
    if (!('serviceWorker' in navigator) || !navigator.serviceWorker.controller) {
      reject(new Error('Service Worker no disponible'));
      return;
    }

    const messageChannel = new MessageChannel();
    messageChannel.port1.onmessage = event => {
      if (event.data.error) {
        reject(event.data.error);
      } else {
        resolve(event.data);
      }
    };

    navigator.serviceWorker.controller.postMessage(message, [messageChannel.port2]);
  });
}

// Función para programar un recordatorio
export function scheduleReminder(time, title, body, url) {
  return sendMessageToSW({
    type: 'SCHEDULE_REMINDER',
    payload: { time, title, body, url }
  });
}

// Función para cancelar todos los recordatorios
export function cancelReminders() {
  return sendMessageToSW({
    type: 'CANCEL_REMINDERS'
  });
}
