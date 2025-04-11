import React, { useState } from 'react';
import { FaCloudUploadAlt, FaCloudDownloadAlt, FaFileExport, FaFileImport } from 'react-icons/fa';
import { useWorkout } from '../context/WorkoutContext';

const DataSync = () => {
  const { plan, workoutLogs, routines, setPlan, setWorkoutLogs, setRoutines } = useWorkout();
  const [showModal, setShowModal] = useState(false);
  const [syncStatus, setSyncStatus] = useState('');

  // Exportar todos los datos
  const exportData = () => {
    const data = {
      plan,
      workoutLogs,
      routines,
      exportDate: new Date().toISOString()
    };

    const dataStr = JSON.stringify(data, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    
    const exportFileDefaultName = `gym_tracker_backup_${new Date().toISOString().slice(0, 10)}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    setSyncStatus('Datos exportados correctamente');
    setTimeout(() => setSyncStatus(''), 3000);
  };

  // Importar datos
  const importData = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        
        // Validar que el archivo tenga la estructura correcta
        if (!data.plan || !data.workoutLogs || !data.routines) {
          throw new Error('El archivo no tiene el formato correcto');
        }
        
        // Importar los datos
        setPlan(data.plan);
        setWorkoutLogs(data.workoutLogs);
        setRoutines(data.routines);
        
        setSyncStatus('Datos importados correctamente');
        setTimeout(() => setSyncStatus(''), 3000);
      } catch (error) {
        setSyncStatus(`Error al importar datos: ${error.message}`);
        setTimeout(() => setSyncStatus(''), 5000);
      }
    };
    reader.readAsText(file);
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
      >
        <FaCloudUploadAlt /> Sincronizar Datos
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Sincronización de Datos</h2>
              
              {syncStatus && (
                <div className={`p-3 mb-4 rounded-lg ${syncStatus.includes('Error') ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                  {syncStatus}
                </div>
              )}
              
              <div className="space-y-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-medium text-gray-800 mb-2">Exportar Datos</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Descarga una copia de seguridad de todos tus datos (plan, registros, rutinas).
                  </p>
                  <button
                    onClick={exportData}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors w-full justify-center"
                  >
                    <FaFileExport /> Exportar Datos
                  </button>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-medium text-gray-800 mb-2">Importar Datos</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Restaura tus datos desde una copia de seguridad. Esto reemplazará todos tus datos actuales.
                  </p>
                  <label className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors w-full justify-center cursor-pointer">
                    <FaFileImport /> Importar Datos
                    <input
                      type="file"
                      accept=".json"
                      onChange={importData}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DataSync;
