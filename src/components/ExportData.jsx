import { useState } from 'react';
import { useWorkout } from '../context/WorkoutContext';
import { FaFileExport, FaFileDownload, FaFileCsv, FaFileCode } from 'react-icons/fa';

const ExportData = () => {
  const { workoutLogs, plan } = useWorkout();
  const [exportFormat, setExportFormat] = useState('json');
  const [showModal, setShowModal] = useState(false);

  // Función para encontrar el nombre del ejercicio por su ID
  const findExerciseName = (exerciseId) => {
    for (const day of plan.days) {
      const exercise = day.exercises.find(ex => ex.id === exerciseId);
      if (exercise) return exercise.name;
    }
    return 'Ejercicio desconocido';
  };

  // Función para encontrar el nombre del día por su ID
  const findDayName = (dayId) => {
    const day = plan.days.find(d => d.id === dayId);
    return day ? day.name : 'Día desconocido';
  };

  // Preparar los datos para exportar
  const prepareExportData = () => {
    return workoutLogs.logs.map(log => ({
      id: log.id,
      date: new Date(log.date).toLocaleString(),
      exercise: findExerciseName(log.exerciseId),
      day: findDayName(log.dayId),
      phase: log.phase,
      sets: log.sets,
      notes: log.notes
    }));
  };

  // Exportar como JSON
  const exportAsJSON = () => {
    const data = prepareExportData();
    const jsonString = JSON.stringify(data, null, 2);
    downloadFile(jsonString, 'gym-tracker-data.json', 'application/json');
  };

  // Exportar como CSV
  const exportAsCSV = () => {
    const data = prepareExportData();
    
    // Crear encabezados para el CSV
    let csvContent = 'ID,Fecha,Ejercicio,Día,Fase,Series,Repeticiones,Pesos,Notas\n';
    
    // Agregar cada registro al CSV
    data.forEach(log => {
      const setsInfo = log.sets.map((set, index) => `Serie ${index + 1}: ${set.reps} reps x ${set.weight} kg`).join(' | ');
      const reps = log.sets.map(set => set.reps).join(' | ');
      const weights = log.sets.map(set => set.weight).join(' | ');
      
      const row = [
        log.id,
        log.date,
        log.exercise,
        log.day,
        log.phase,
        log.sets.length,
        reps,
        weights,
        log.notes.replace(/,/g, ';').replace(/\n/g, ' ')
      ];
      
      csvContent += row.join(',') + '\n';
    });
    
    downloadFile(csvContent, 'gym-tracker-data.csv', 'text/csv');
  };

  // Función genérica para descargar archivos
  const downloadFile = (content, fileName, contentType) => {
    const blob = new Blob([content], { type: contentType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setShowModal(false);
  };

  // Si no hay datos para exportar
  if (workoutLogs.logs.length === 0) {
    return null;
  }

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg shadow-button hover:bg-primary-700 transition-all"
      >
        <FaFileExport />
        <span>Exportar datos</span>
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6 relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
            
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <FaFileExport className="mr-2 text-primary-500" />
              Exportar datos de entrenamiento
            </h3>
            
            <p className="text-gray-600 mb-5">
              Selecciona el formato en el que deseas exportar tus datos de entrenamiento.
            </p>
            
            <div className="space-y-3 mb-6">
              <button
                onClick={() => setExportFormat('json')}
                className={`w-full flex items-center p-3 rounded-lg border ${
                  exportFormat === 'json' 
                    ? 'border-primary-500 bg-primary-50 text-primary-700' 
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <FaFileCode className={`mr-3 text-xl ${exportFormat === 'json' ? 'text-primary-500' : 'text-gray-400'}`} />
                <div className="text-left">
                  <div className="font-medium">JSON</div>
                  <div className="text-xs text-gray-500">Formato completo con todos los detalles</div>
                </div>
              </button>
              
              <button
                onClick={() => setExportFormat('csv')}
                className={`w-full flex items-center p-3 rounded-lg border ${
                  exportFormat === 'csv' 
                    ? 'border-primary-500 bg-primary-50 text-primary-700' 
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <FaFileCsv className={`mr-3 text-xl ${exportFormat === 'csv' ? 'text-primary-500' : 'text-gray-400'}`} />
                <div className="text-left">
                  <div className="font-medium">CSV</div>
                  <div className="text-xs text-gray-500">Compatible con Excel y otras hojas de cálculo</div>
                </div>
              </button>
            </div>
            
            <div className="flex justify-end">
              <button
                onClick={() => exportFormat === 'json' ? exportAsJSON() : exportAsCSV()}
                className="flex items-center gap-2 px-5 py-3 bg-primary-600 text-white rounded-lg shadow-button hover:bg-primary-700 transition-all"
              >
                <FaFileDownload />
                <span>Descargar {exportFormat.toUpperCase()}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ExportData;
