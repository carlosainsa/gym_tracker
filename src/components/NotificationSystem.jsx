import React, { useState, useEffect } from 'react';
import { FaBell, FaTimes } from 'react-icons/fa';

const NotificationSystem = () => {
  const [notifications, setNotifications] = useState([]);
  const [showSettings, setShowSettings] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(
    localStorage.getItem('notificationsEnabled') === 'true'
  );
  const [reminderTime, setReminderTime] = useState(
    localStorage.getItem('reminderTime') || '08:00'
  );

  // Cargar notificaciones guardadas al iniciar
  useEffect(() => {
    const savedNotifications = localStorage.getItem('notifications');
    if (savedNotifications) {
      try {
        setNotifications(JSON.parse(savedNotifications));
      } catch (error) {
        console.error('Error al cargar notificaciones:', error);
      }
    }
  }, []);

  // Guardar configuración de notificaciones
  useEffect(() => {
    localStorage.setItem('notificationsEnabled', notificationsEnabled);
    localStorage.setItem('reminderTime', reminderTime);
  }, [notificationsEnabled, reminderTime]);

  // Solicitar permiso para notificaciones
  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
      alert('Este navegador no soporta notificaciones de escritorio');
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }

    return false;
  };

  // Habilitar o deshabilitar notificaciones
  const toggleNotifications = async () => {
    if (!notificationsEnabled) {
      const permissionGranted = await requestNotificationPermission();
      if (permissionGranted) {
        setNotificationsEnabled(true);
        scheduleWorkoutReminder();
      } else {
        alert('Se requiere permiso para enviar notificaciones');
      }
    } else {
      setNotificationsEnabled(false);
      // Cancelar cualquier recordatorio programado
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
          type: 'CANCEL_REMINDERS'
        });
      }
    }
  };

  // Programar recordatorio de entrenamiento
  const scheduleWorkoutReminder = () => {
    if (!notificationsEnabled) return;

    // Si tenemos un service worker, le enviamos un mensaje para programar la notificación
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      const [hours, minutes] = reminderTime.split(':').map(Number);
      
      navigator.serviceWorker.controller.postMessage({
        type: 'SCHEDULE_REMINDER',
        payload: {
          time: { hours, minutes },
          title: '¡Hora de entrenar!',
          body: 'No olvides tu entrenamiento de hoy'
        }
      });
    }
  };

  // Enviar notificación de prueba
  const sendTestNotification = async () => {
    if (await requestNotificationPermission()) {
      new Notification('Prueba de notificación', {
        body: 'Las notificaciones están funcionando correctamente',
        icon: '/favicon.ico'
      });
    }
  };

  // Añadir una nueva notificación al sistema
  const addNotification = (title, message, type = 'info') => {
    const newNotification = {
      id: Date.now(),
      title,
      message,
      type,
      read: false,
      date: new Date().toISOString()
    };
    
    const updatedNotifications = [newNotification, ...notifications];
    setNotifications(updatedNotifications);
    
    // Guardar en localStorage
    localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
    
    return newNotification.id;
  };

  // Marcar notificación como leída
  const markAsRead = (id) => {
    const updatedNotifications = notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    );
    
    setNotifications(updatedNotifications);
    localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
  };

  // Eliminar notificación
  const removeNotification = (id) => {
    const updatedNotifications = notifications.filter(
      notification => notification.id !== id
    );
    
    setNotifications(updatedNotifications);
    localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
  };

  // Contar notificaciones no leídas
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="relative">
      {/* Botón de notificaciones */}
      <button 
        onClick={() => setShowSettings(!showSettings)}
        className="relative p-2 text-gray-600 hover:text-gray-800 focus:outline-none"
        aria-label="Notificaciones"
      >
        <FaBell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Panel de configuración de notificaciones */}
      {showSettings && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl z-50">
          <div className="p-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Notificaciones</h3>
              <button 
                onClick={() => setShowSettings(false)}
                className="text-gray-400 hover:text-gray-500"
                aria-label="Cerrar"
              >
                <FaTimes />
              </button>
            </div>
          </div>

          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Activar notificaciones</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer"
                  checked={notificationsEnabled}
                  onChange={toggleNotifications}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            {notificationsEnabled && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hora del recordatorio diario
                </label>
                <input 
                  type="time" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={reminderTime}
                  onChange={(e) => setReminderTime(e.target.value)}
                />
                <button
                  onClick={sendTestNotification}
                  className="mt-2 w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Enviar notificación de prueba
                </button>
              </div>
            )}
          </div>

          {/* Lista de notificaciones */}
          <div className="max-h-60 overflow-y-auto">
            {notifications.length > 0 ? (
              notifications.map(notification => (
                <div 
                  key={notification.id} 
                  className={`p-4 border-b border-gray-200 ${notification.read ? 'bg-white' : 'bg-blue-50'}`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex justify-between">
                    <h4 className="text-sm font-medium text-gray-900">{notification.title}</h4>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        removeNotification(notification.id);
                      }}
                      className="text-gray-400 hover:text-gray-500"
                      aria-label="Eliminar notificación"
                    >
                      <FaTimes size={14} />
                    </button>
                  </div>
                  <p className="mt-1 text-sm text-gray-600">{notification.message}</p>
                  <p className="mt-1 text-xs text-gray-500">
                    {new Date(notification.date).toLocaleString()}
                  </p>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-gray-500">
                No hay notificaciones
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Exportar componente y funciones útiles
export default NotificationSystem;

// Función para añadir notificaciones desde cualquier parte de la aplicación
export const addGlobalNotification = (title, message, type = 'info') => {
  const event = new CustomEvent('addNotification', { 
    detail: { title, message, type } 
  });
  window.dispatchEvent(event);
};
