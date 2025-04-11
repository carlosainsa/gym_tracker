import { useState, useEffect } from 'react';
import { FaBell, FaRegBell, FaTimes, FaCheck, FaClock } from 'react-icons/fa';

const Notifications = () => {
  const [showSettings, setShowSettings] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [reminderDays, setReminderDays] = useState([]);
  const [reminderTime, setReminderTime] = useState('18:00');
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');

  const daysOfWeek = [
    { id: 1, name: 'L', fullName: 'Lunes' },
    { id: 2, name: 'M', fullName: 'Martes' },
    { id: 3, name: 'X', fullName: 'Miércoles' },
    { id: 4, name: 'J', fullName: 'Jueves' },
    { id: 5, name: 'V', fullName: 'Viernes' },
    { id: 6, name: 'S', fullName: 'Sábado' },
    { id: 0, name: 'D', fullName: 'Domingo' }
  ];

  // Cargar configuración de notificaciones desde localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('notificationSettings');
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      setNotificationsEnabled(settings.enabled);
      setReminderDays(settings.days || []);
      setReminderTime(settings.time || '18:00');
    }
  }, []);

  // Guardar configuración de notificaciones en localStorage
  useEffect(() => {
    if (notificationsEnabled) {
      localStorage.setItem('notificationSettings', JSON.stringify({
        enabled: notificationsEnabled,
        days: reminderDays,
        time: reminderTime
      }));
    }
  }, [notificationsEnabled, reminderDays, reminderTime]);

  // Verificar si se debe mostrar una notificación
  useEffect(() => {
    if (notificationsEnabled && reminderDays.length > 0) {
      const now = new Date();
      const currentDay = now.getDay(); // 0 = Domingo, 1 = Lunes, etc.
      
      // Verificar si hoy es un día de recordatorio
      if (reminderDays.includes(currentDay)) {
        const [reminderHour, reminderMinute] = reminderTime.split(':').map(Number);
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();
        
        // Verificar si es hora de mostrar la notificación (dentro de un rango de 5 minutos)
        if (
          (currentHour === reminderHour && currentMinute >= reminderMinute && currentMinute <= reminderMinute + 5) ||
          (currentHour === reminderHour + 1 && reminderMinute >= 55 && currentMinute <= (reminderMinute + 5) % 60)
        ) {
          // Obtener el nombre del día actual
          const dayName = daysOfWeek.find(day => day.id === currentDay)?.fullName;
          setNotificationMessage(`¡Es hora de entrenar! Hoy es ${dayName} y tienes programado un entrenamiento.`);
          setShowNotification(true);
          
          // Solicitar permiso para notificaciones del navegador
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('Gym Tracker', {
              body: `¡Es hora de entrenar! Hoy es ${dayName} y tienes programado un entrenamiento.`,
              icon: '/favicon.ico'
            });
          }
        }
      }
    }
  }, [notificationsEnabled, reminderDays, reminderTime]);

  // Manejar cambios en los días de recordatorio
  const handleDayToggle = (dayId) => {
    if (reminderDays.includes(dayId)) {
      setReminderDays(reminderDays.filter(id => id !== dayId));
    } else {
      setReminderDays([...reminderDays, dayId]);
    }
  };

  // Solicitar permiso para notificaciones
  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        setNotificationsEnabled(true);
      } else {
        alert('Para recibir recordatorios, necesitas permitir las notificaciones en tu navegador.');
        setNotificationsEnabled(false);
      }
    } else {
      alert('Tu navegador no soporta notificaciones.');
      setNotificationsEnabled(false);
    }
  };

  // Manejar cambio en el estado de notificaciones
  const handleNotificationsToggle = () => {
    if (!notificationsEnabled) {
      requestNotificationPermission();
    } else {
      setNotificationsEnabled(false);
    }
  };

  return (
    <>
      {/* Botón de notificaciones */}
      <button
        onClick={() => setShowSettings(!showSettings)}
        className="relative p-2 text-gray-600 hover:text-primary-600 transition-colors"
        aria-label="Configurar notificaciones"
      >
        {notificationsEnabled ? (
          <FaBell className="text-xl" />
        ) : (
          <FaRegBell className="text-xl" />
        )}
        {notificationsEnabled && (
          <span className="absolute top-0 right-0 w-2 h-2 bg-primary-500 rounded-full"></span>
        )}
      </button>

      {/* Modal de configuración de notificaciones */}
      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6 relative">
            <button
              onClick={() => setShowSettings(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
            >
              <FaTimes />
            </button>
            
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <FaBell className="mr-2 text-primary-500" />
              Recordatorios de entrenamiento
            </h3>
            
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <span className="font-medium text-gray-700">Activar recordatorios</span>
                <button
                  onClick={handleNotificationsToggle}
                  className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none ${
                    notificationsEnabled ? 'bg-primary-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block w-4 h-4 transform transition-transform bg-white rounded-full ${
                      notificationsEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
              
              {notificationsEnabled && (
                <>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Días de entrenamiento
                    </label>
                    <div className="flex justify-between">
                      {daysOfWeek.map(day => (
                        <button
                          key={day.id}
                          onClick={() => handleDayToggle(day.id)}
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                            reminderDays.includes(day.id)
                              ? 'bg-primary-600 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                          title={day.fullName}
                        >
                          {day.name}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Hora del recordatorio
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <FaClock className="text-gray-400" />
                      </div>
                      <input
                        type="time"
                        value={reminderTime}
                        onChange={(e) => setReminderTime(e.target.value)}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2.5"
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
            
            <div className="flex justify-end">
              <button
                onClick={() => setShowSettings(false)}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg shadow-button hover:bg-primary-700 transition-all"
              >
                <FaCheck className="mr-1 inline-block" />
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notificación */}
      {showNotification && (
        <div className="fixed bottom-20 right-4 max-w-xs bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-50 animate-slide-up">
          <div className="flex">
            <div className="flex-shrink-0">
              <FaBell className="h-5 w-5 text-primary-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">{notificationMessage}</p>
            </div>
            <button
              type="button"
              className="ml-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-500 rounded-lg p-1.5"
              onClick={() => setShowNotification(false)}
            >
              <span className="sr-only">Cerrar</span>
              <FaTimes className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Notifications;
