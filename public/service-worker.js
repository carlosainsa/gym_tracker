// Nombre de la caché
const CACHE_NAME = 'gym-tracker-v1';

// Archivos a cachear
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
  '/static/js/main.chunk.js',
  '/static/js/0.chunk.js',
  '/static/js/bundle.js',
];

// Instalación del Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Activación del Service Worker
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Interceptar peticiones
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});

// Manejar notificaciones push
self.addEventListener('push', (event) => {
  const data = event.data.json();
  const options = {
    body: data.body,
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    data: {
      url: data.url || '/'
    }
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Manejar clics en notificaciones
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  event.waitUntil(
    clients.matchAll({ type: 'window' })
      .then((clientList) => {
        // Si ya hay una ventana abierta, enfócala
        for (const client of clientList) {
          if (client.url === event.notification.data.url && 'focus' in client) {
            return client.focus();
          }
        }
        // Si no hay ventanas abiertas, abre una nueva
        if (clients.openWindow) {
          return clients.openWindow(event.notification.data.url);
        }
      })
  );
});

// Almacenar recordatorios programados
let scheduledReminders = [];

// Manejar mensajes desde la aplicación
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SCHEDULE_REMINDER') {
    const { time, title, body, url } = event.data.payload;
    scheduleReminder(time, title, body, url);
  } else if (event.data && event.data.type === 'CANCEL_REMINDERS') {
    scheduledReminders = [];
  }
});

// Programar un recordatorio
function scheduleReminder(time, title, body, url = '/') {
  const { hours, minutes } = time;
  
  // Calcular la próxima ocurrencia de la hora especificada
  const now = new Date();
  let scheduledTime = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    hours,
    minutes,
    0
  );
  
  // Si la hora ya pasó hoy, programarla para mañana
  if (scheduledTime < now) {
    scheduledTime.setDate(scheduledTime.getDate() + 1);
  }
  
  const timeUntilReminder = scheduledTime.getTime() - now.getTime();
  
  // Guardar el recordatorio
  const reminder = {
    id: Date.now(),
    time: scheduledTime,
    title,
    body,
    url,
    timeoutId: setTimeout(() => {
      showReminder(title, body, url);
      // Reprogramar para el día siguiente
      scheduleReminder(time, title, body, url);
    }, timeUntilReminder)
  };
  
  scheduledReminders.push(reminder);
}

// Mostrar una notificación de recordatorio
function showReminder(title, body, url) {
  self.registration.showNotification(title, {
    body,
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    data: { url }
  });
}
