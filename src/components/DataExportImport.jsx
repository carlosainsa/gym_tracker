import React, { useState } from 'react';
import { FaDownload, FaUpload, FaCheck, FaTimes, FaSync, FaMobileAlt, FaDesktop, FaCalendarAlt } from 'react-icons/fa';
import { useWorkout } from '../context/WorkoutContext';

const DataExportImport = () => {
  const { plan, workoutLogs, importData } = useWorkout();
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('export'); // 'export', 'import', o 'sync'
  const [importFile, setImportFile] = useState(null);
  const [importError, setImportError] = useState('');
  const [importSuccess, setImportSuccess] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);
  const [syncOptions, setSyncOptions] = useState({
    workoutLogs: true,
    plan: false,
    settings: false,
    mergeStrategy: 'newer' // 'newer', 'device', 'all'
  });

  // Función para exportar datos completos
  const handleExport = () => {
    try {
      // Recopilar todos los datos que queremos exportar
      const dataToExport = {
        plan,
        workoutLogs,
        settings: {
          notificationSettings: localStorage.getItem('notificationSettings'),
          notificationsEnabled: localStorage.getItem('notificationsEnabled'),
          reminderTime: localStorage.getItem('reminderTime'),
          currentPhase: localStorage.getItem('currentPhase')
        },
        exportDate: new Date().toISOString(),
        version: '1.0',
        exportType: 'full'
      };

      // Exportar el archivo
      exportToFile(dataToExport, 'gym_tracker_backup');

      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 3000);
    } catch (error) {
      console.error('Error al exportar datos:', error);
      alert('Error al exportar datos. Por favor, intenta de nuevo.');
    }
  };

  // Función para exportar datos para sincronización
  const handleSyncExport = () => {
    try {
      // Crear objeto con solo los datos seleccionados
      const dataToExport = {
        exportDate: new Date().toISOString(),
        version: '1.0',
        exportType: 'sync'
      };

      // Añadir solo los datos seleccionados
      if (syncOptions.workoutLogs) {
        dataToExport.workoutLogs = workoutLogs;
      }

      if (syncOptions.plan) {
        dataToExport.plan = plan;
      }

      if (syncOptions.settings) {
        dataToExport.settings = {
          notificationSettings: localStorage.getItem('notificationSettings'),
          notificationsEnabled: localStorage.getItem('notificationsEnabled'),
          reminderTime: localStorage.getItem('reminderTime'),
          currentPhase: localStorage.getItem('currentPhase')
        };
      }

      // Exportar el archivo
      exportToFile(dataToExport, 'gym_tracker_sync');

      setExportSuccess(true);
      setTimeout(() => {
        setExportSuccess(false);
        setShowModal(false);
      }, 2000);
    } catch (error) {
      console.error('Error al exportar datos para sincronización:', error);
      alert('Error al exportar datos. Por favor, intenta de nuevo.');
    }
  };

  // Función auxiliar para exportar a archivo
  const exportToFile = (data, fileNamePrefix) => {
    try {
      // Convertir a JSON
      const jsonData = JSON.stringify(data, null, 2);

      // Crear un blob y un enlace de descarga
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);

      // Crear un enlace temporal y hacer clic en él
      const a = document.createElement('a');
      a.href = url;
      a.download = `${fileNamePrefix}_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();

      // Limpiar
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error al exportar a archivo:', error);
      alert('Error al exportar datos. Por favor, intenta de nuevo.');
    }
  };

  // Función para manejar la selección de archivo
  const handleFileChange = (e) => {
    setImportFile(e.target.files[0]);
    setImportError('');
    setImportSuccess(false);
  };

  // Función para importar datos completos
  const handleImport = () => {
    if (!importFile) {
      setImportError('Por favor, selecciona un archivo para importar.');
      return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target.result);

        // Validar que el archivo tenga la estructura correcta
        if (!importedData.plan && !importedData.workoutLogs) {
          setImportError('El archivo no contiene datos válidos de Gym Tracker.');
          return;
        }

        // Determinar si es una importación completa o una sincronización
        const isSync = importedData.exportType === 'sync';

        if (isSync) {
          // Importar datos selectivamente según la estrategia de sincronización
          handleSyncImport(importedData);
        } else {
          // Importar todos los datos (importación completa)
          importData(importedData);

          // Importar configuraciones
          if (importedData.settings) {
            const { notificationSettings, notificationsEnabled, reminderTime, currentPhase } = importedData.settings;

            if (notificationSettings) localStorage.setItem('notificationSettings', notificationSettings);
            if (notificationsEnabled) localStorage.setItem('notificationsEnabled', notificationsEnabled);
            if (reminderTime) localStorage.setItem('reminderTime', reminderTime);
            if (currentPhase) localStorage.setItem('currentPhase', currentPhase);
          }
        }

        setImportSuccess(true);
        setTimeout(() => {
          setImportSuccess(false);
          setShowModal(false);
          // Recargar la página para aplicar los cambios
          window.location.reload();
        }, 2000);
      } catch (error) {
        console.error('Error al importar datos:', error);
        setImportError('Error al procesar el archivo. Asegúrate de que es un archivo JSON válido.');
      }
    };

    reader.onerror = () => {
      setImportError('Error al leer el archivo.');
    };

    reader.readAsText(importFile);
  };

  // Función para manejar la importación selectiva (sincronización)
  const handleSyncImport = (importedData) => {
    // Crear un objeto con los datos actuales
    const currentData = {
      plan,
      workoutLogs,
      settings: {
        notificationSettings: localStorage.getItem('notificationSettings'),
        notificationsEnabled: localStorage.getItem('notificationsEnabled'),
        reminderTime: localStorage.getItem('reminderTime'),
        currentPhase: localStorage.getItem('currentPhase')
      }
    };

    // Objeto para almacenar los datos fusionados
    const mergedData = {};

    // Sincronizar registros de entrenamiento si están incluidos
    if (importedData.workoutLogs) {
      if (syncOptions.mergeStrategy === 'newer') {
        // Fusionar registros de entrenamiento, manteniendo los más recientes
        const allLogs = [...currentData.workoutLogs.logs, ...importedData.workoutLogs.logs];

        // Eliminar duplicados, manteniendo la versión más reciente
        const uniqueLogs = [];
        const logIds = new Set();

        // Ordenar por fecha (más reciente primero)
        allLogs.sort((a, b) => new Date(b.date) - new Date(a.date));

        // Mantener solo la versión más reciente de cada registro
        for (const log of allLogs) {
          const logKey = `${log.exerciseId}-${log.date.split('T')[0]}`;
          if (!logIds.has(logKey)) {
            uniqueLogs.push(log);
            logIds.add(logKey);
          }
        }

        mergedData.workoutLogs = { logs: uniqueLogs };
      } else if (syncOptions.mergeStrategy === 'device') {
        // Mantener solo los datos del dispositivo actual
        mergedData.workoutLogs = currentData.workoutLogs;
      } else if (syncOptions.mergeStrategy === 'all') {
        // Combinar todos los registros
        mergedData.workoutLogs = {
          logs: [...currentData.workoutLogs.logs, ...importedData.workoutLogs.logs]
        };
      }
    }

    // Sincronizar plan si está incluido
    if (importedData.plan && syncOptions.plan) {
      mergedData.plan = importedData.plan;
    } else {
      mergedData.plan = currentData.plan;
    }

    // Sincronizar configuraciones si están incluidas
    if (importedData.settings && syncOptions.settings) {
      mergedData.settings = importedData.settings;

      // Aplicar configuraciones
      const { notificationSettings, notificationsEnabled, reminderTime, currentPhase } = importedData.settings;
      if (notificationSettings) localStorage.setItem('notificationSettings', notificationSettings);
      if (notificationsEnabled) localStorage.setItem('notificationsEnabled', notificationsEnabled);
      if (reminderTime) localStorage.setItem('reminderTime', reminderTime);
      if (currentPhase) localStorage.setItem('currentPhase', currentPhase);
    }

    // Importar los datos fusionados
    importData(mergedData);
  };

  // Abrir modal de exportación
  const openExportModal = () => {
    setModalType('export');
    setShowModal(true);
  };

  // Abrir modal de importación
  const openImportModal = () => {
    setModalType('import');
    setImportFile(null);
    setImportError('');
    setImportSuccess(false);
    setShowModal(true);
  };

  // Abrir modal de sincronización
  const openSyncModal = () => {
    setModalType('sync');
    setImportFile(null);
    setImportError('');
    setImportSuccess(false);
    setShowModal(true);
  };

  return (
    <div>
      {/* Botones de exportación, importación y sincronización */}
      <div className="flex flex-wrap gap-2" role="group" aria-label="Opciones de datos">
        <button
          onClick={openExportModal}
          className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
          aria-label="Exportar datos"
        >
          <FaDownload className="mr-2" aria-hidden="true" />
          <span>Exportar</span>
        </button>
        <button
          onClick={openImportModal}
          className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
          aria-label="Importar datos"
        >
          <FaUpload className="mr-2" aria-hidden="true" />
          <span>Importar</span>
        </button>
        <button
          onClick={openSyncModal}
          className="flex items-center justify-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
          aria-label="Sincronizar entre dispositivos"
        >
          <FaSync className="mr-2" aria-hidden="true" />
          <span>Sincronizar</span>
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg max-w-md w-full p-6 relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 rounded-full p-1"
              aria-label="Cerrar"
            >
              <FaTimes aria-hidden="true" />
            </button>

            <h3 id="modal-title" className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center">
              {modalType === 'export' ? (
                <>
                  <FaDownload className="mr-2 text-blue-500" aria-hidden="true" />
                  Exportar datos
                </>
              ) : modalType === 'import' ? (
                <>
                  <FaUpload className="mr-2 text-green-500" aria-hidden="true" />
                  Importar datos
                </>
              ) : (
                <>
                  <FaSync className="mr-2 text-purple-500" aria-hidden="true" />
                  Sincronizar entre dispositivos
                </>
              )}
            </h3>

            {modalType === 'export' ? (
              <div>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Exporta todos tus datos de entrenamiento, registros y configuraciones para hacer una copia de seguridad o transferirlos a otro dispositivo.
                </p>

                {exportSuccess ? (
                  <div
                    className="bg-green-100 dark:bg-green-800 border border-green-400 dark:border-green-700 text-green-700 dark:text-green-200 px-4 py-3 rounded relative mb-4"
                    role="alert"
                  >
                    <span className="block sm:inline">Datos exportados correctamente.</span>
                  </div>
                ) : null}

                <button
                  onClick={handleExport}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                  aria-label="Descargar copia de seguridad"
                >
                  <FaDownload className="mr-2 inline-block" aria-hidden="true" />
                  Descargar copia de seguridad
                </button>
              </div>
            ) : modalType === 'import' ? (
              <div>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Importa tus datos de entrenamiento, registros y configuraciones desde un archivo de copia de seguridad.
                </p>

                <div className="mb-4">
                  <label htmlFor="import-file" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Selecciona un archivo de copia de seguridad
                  </label>
                  <input
                    id="import-file"
                    type="file"
                    accept=".json"
                    onChange={handleFileChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    aria-describedby={importError ? 'import-error' : undefined}
                  />
                </div>

                {importError && (
                  <div
                    id="import-error"
                    className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-3 rounded relative mb-4"
                    role="alert"
                  >
                    <span className="block sm:inline">{importError}</span>
                  </div>
                )}

                {importSuccess && (
                  <div
                    className="bg-green-100 dark:bg-green-800 border border-green-400 dark:border-green-700 text-green-700 dark:text-green-200 px-4 py-3 rounded relative mb-4"
                    role="status"
                  >
                    <span className="block sm:inline">Datos importados correctamente. Recargando...</span>
                  </div>
                )}

                <button
                  onClick={handleImport}
                  disabled={!importFile || importSuccess}
                  className={`w-full px-4 py-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 ${
                    !importFile || importSuccess
                      ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                  aria-label="Importar datos"
                >
                  <FaUpload className="mr-2 inline-block" aria-hidden="true" />
                  Importar datos
                </button>
              </div>
            ) : (
              <div>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Sincroniza datos específicos entre tus dispositivos. Selecciona qué datos quieres sincronizar.
                </p>

                <div className="mb-6 space-y-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="sync-workouts"
                      checked={syncOptions.workoutLogs}
                      onChange={(e) => setSyncOptions({...syncOptions, workoutLogs: e.target.checked})}
                      className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                    />
                    <label htmlFor="sync-workouts" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                      <span className="font-medium">Registros de entrenamiento</span>
                      <span className="block text-xs text-gray-500 dark:text-gray-400">Tus series, repeticiones y pesos registrados</span>
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="sync-plan"
                      checked={syncOptions.plan}
                      onChange={(e) => setSyncOptions({...syncOptions, plan: e.target.checked})}
                      className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                    />
                    <label htmlFor="sync-plan" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                      <span className="font-medium">Plan de entrenamiento</span>
                      <span className="block text-xs text-gray-500 dark:text-gray-400">Tu plan y rutinas personalizadas</span>
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="sync-settings"
                      checked={syncOptions.settings}
                      onChange={(e) => setSyncOptions({...syncOptions, settings: e.target.checked})}
                      className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                    />
                    <label htmlFor="sync-settings" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                      <span className="font-medium">Configuraciones</span>
                      <span className="block text-xs text-gray-500 dark:text-gray-400">Preferencias y ajustes de la aplicación</span>
                    </label>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Estrategia de sincronización
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setSyncOptions({...syncOptions, mergeStrategy: 'newer'})}
                      className={`px-3 py-2 text-xs rounded-lg ${syncOptions.mergeStrategy === 'newer' ? 'bg-purple-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
                    >
                      <FaCalendarAlt className="mx-auto mb-1" />
                      Más recientes
                    </button>
                    <button
                      type="button"
                      onClick={() => setSyncOptions({...syncOptions, mergeStrategy: 'device'})}
                      className={`px-3 py-2 text-xs rounded-lg ${syncOptions.mergeStrategy === 'device' ? 'bg-purple-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
                    >
                      <FaDesktop className="mx-auto mb-1" />
                      Este dispositivo
                    </button>
                    <button
                      type="button"
                      onClick={() => setSyncOptions({...syncOptions, mergeStrategy: 'all'})}
                      className={`px-3 py-2 text-xs rounded-lg ${syncOptions.mergeStrategy === 'all' ? 'bg-purple-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
                    >
                      <FaMobileAlt className="mx-auto mb-1" />
                      Combinar todo
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={handleSyncExport}
                    className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                    aria-label="Exportar para sincronizar"
                  >
                    <FaSync className="mr-2 inline-block" aria-hidden="true" />
                    Exportar para sincronizar
                  </button>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">o</span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <label htmlFor="sync-file" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Importar archivo de sincronización
                    </label>
                    <input
                      type="file"
                      id="sync-file"
                      accept=".json"
                      onChange={handleFileChange}
                      className="w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-50 dark:file:bg-purple-900 file:text-purple-700 dark:file:text-purple-300 hover:file:bg-purple-100 dark:hover:file:bg-purple-800"
                    />
                  </div>

                  <button
                    onClick={handleImport}
                    disabled={!importFile || importSuccess}
                    className={`w-full px-4 py-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 ${
                      !importFile || importSuccess
                        ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                        : 'bg-purple-600 text-white hover:bg-purple-700'
                    }`}
                    aria-label="Importar y sincronizar"
                  >
                    <FaUpload className="mr-2 inline-block" aria-hidden="true" />
                    Importar y sincronizar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DataExportImport;
