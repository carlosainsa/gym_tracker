import React, { useState, useRef } from 'react';
import { FaFileExport, FaFileImport, FaDownload, FaUpload, FaCheck, FaTimes, FaInfoCircle } from 'react-icons/fa';
import { useTraining } from '../context/TrainingContext';
import importExportService from '../services/importExportService';

/**
 * Componente para gestionar la importación y exportación de planes de entrenamiento
 */
const PlanImportExportManager = () => {
  const { trainingPlans, importPlanFromJson } = useTraining();
  const [importStatus, setImportStatus] = useState(null);
  const [selectedPlans, setSelectedPlans] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const fileInputRef = useRef(null);
  
  // Manejar la selección de todos los planes
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedPlans([]);
    } else {
      setSelectedPlans(trainingPlans.map(plan => plan.id));
    }
    setSelectAll(!selectAll);
  };
  
  // Manejar la selección de un plan
  const handleSelectPlan = (planId) => {
    if (selectedPlans.includes(planId)) {
      setSelectedPlans(selectedPlans.filter(id => id !== planId));
      setSelectAll(false);
    } else {
      setSelectedPlans([...selectedPlans, planId]);
      if (selectedPlans.length + 1 === trainingPlans.length) {
        setSelectAll(true);
      }
    }
  };
  
  // Manejar la exportación de planes seleccionados
  const handleExportSelectedPlans = () => {
    try {
      if (selectedPlans.length === 0) {
        setImportStatus({
          success: false,
          message: 'Selecciona al menos un plan para exportar'
        });
        return;
      }
      
      const plansToExport = trainingPlans.filter(plan => selectedPlans.includes(plan.id));
      importExportService.downloadAllPlansAsJson(plansToExport);
      
      setImportStatus({
        success: true,
        message: `${plansToExport.length} ${plansToExport.length === 1 ? 'plan exportado' : 'planes exportados'} correctamente`
      });
    } catch (error) {
      console.error('Error al exportar planes:', error);
      setImportStatus({
        success: false,
        message: 'Error al exportar planes: ' + error.message
      });
    }
  };
  
  // Manejar la exportación de todos los planes
  const handleExportAllPlans = () => {
    try {
      importExportService.downloadAllPlansAsJson(trainingPlans);
      
      setImportStatus({
        success: true,
        message: `${trainingPlans.length} ${trainingPlans.length === 1 ? 'plan exportado' : 'planes exportados'} correctamente`
      });
    } catch (error) {
      console.error('Error al exportar todos los planes:', error);
      setImportStatus({
        success: false,
        message: 'Error al exportar todos los planes: ' + error.message
      });
    }
  };
  
  // Manejar la importación de planes
  const handleImportClick = () => {
    fileInputRef.current.click();
  };
  
  // Manejar el cambio de archivo
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    try {
      // Leer el archivo
      const text = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = reject;
        reader.readAsText(file);
      });
      
      // Verificar si el archivo es válido
      const isValid = await importExportService.validateImportFile(text);
      if (!isValid) {
        throw new Error('El archivo no contiene un plan de entrenamiento válido');
      }
      
      // Importar el plan o planes
      const importedPlans = importPlanFromJson(text);
      
      // Determinar el mensaje según si se importó uno o varios planes
      let message;
      if (Array.isArray(importedPlans)) {
        message = `${importedPlans.length} ${importedPlans.length === 1 ? 'plan importado' : 'planes importados'} correctamente`;
      } else {
        message = `Plan "${importedPlans.name}" importado correctamente`;
      }
      
      setImportStatus({
        success: true,
        message
      });
      
      // Limpiar el input de archivo
      e.target.value = null;
    } catch (error) {
      console.error('Error al importar planes:', error);
      setImportStatus({
        success: false,
        message: 'Error al importar planes: ' + error.message
      });
      
      // Limpiar el input de archivo
      e.target.value = null;
    }
  };
  
  // Limpiar el estado de importación
  const clearImportStatus = () => {
    setImportStatus(null);
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
      <div className="p-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white">
        <h2 className="text-xl font-bold">Importación y Exportación de Planes</h2>
        <p className="text-white text-opacity-90 mt-1">
          Gestiona tus planes de entrenamiento: exporta para hacer copias de seguridad o compartir, e importa planes nuevos
        </p>
      </div>
      
      <div className="p-6">
        {/* Mensaje de estado */}
        {importStatus && (
          <div 
            className={`mb-6 p-4 rounded-lg flex items-start justify-between ${
              importStatus.success 
                ? 'bg-green-50 dark:bg-green-900/30 text-green-800 dark:text-green-200' 
                : 'bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-200'
            }`}
          >
            <div className="flex items-center">
              {importStatus.success ? (
                <FaCheck className="mr-2 text-green-500 dark:text-green-400 flex-shrink-0" />
              ) : (
                <FaTimes className="mr-2 text-red-500 dark:text-red-400 flex-shrink-0" />
              )}
              <p>{importStatus.message}</p>
            </div>
            <button 
              onClick={clearImportStatus}
              className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            >
              <FaTimes />
            </button>
          </div>
        )}
        
        {/* Acciones rápidas */}
        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">Acciones Rápidas</h3>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleExportAllPlans}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FaDownload className="mr-2" />
              Exportar Todos los Planes
            </button>
            
            <button
              onClick={handleImportClick}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <FaUpload className="mr-2" />
              Importar Planes
            </button>
            
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".json"
              className="hidden"
            />
          </div>
        </div>
        
        {/* Lista de planes para exportación selectiva */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-800 dark:text-white">Exportación Selectiva</h3>
            <button
              onClick={handleExportSelectedPlans}
              disabled={selectedPlans.length === 0}
              className={`flex items-center px-3 py-1.5 rounded-lg transition-colors ${
                selectedPlans.length === 0
                  ? 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              <FaFileExport className="mr-1.5" />
              Exportar Seleccionados
            </button>
          </div>
          
          {trainingPlans.length > 0 ? (
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th scope="col" className="px-4 py-3 text-left">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectAll}
                          onChange={handleSelectAll}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                      </div>
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Nombre
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Estado
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Tipo
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Duración
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {trainingPlans.map(plan => (
                    <tr key={plan.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={selectedPlans.includes(plan.id)}
                            onChange={() => handleSelectPlan(plan.id)}
                            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                          />
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{plan.name}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{plan.description}</div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          plan.status === 'active' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                            : plan.status === 'archived'
                              ? 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                              : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                        }`}>
                          {plan.status === 'active' ? 'Activo' : 
                           plan.status === 'archived' ? 'Archivado' : 'Disponible'}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {plan.splitType === 'full_body' ? 'Cuerpo completo' :
                         plan.splitType === 'upper_lower' ? 'Superior/Inferior' :
                         plan.splitType === 'push_pull_legs' ? 'Empuje/Tirón/Piernas' :
                         plan.splitType === 'body_part_split' ? 'División por grupos musculares' : 'Personalizado'}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {plan.duration || plan.planDuration || plan.microcycles?.length || '?'} semanas
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <FaInfoCircle className="mx-auto text-gray-400 dark:text-gray-500 text-3xl mb-2" />
              <p className="text-gray-600 dark:text-gray-400">No hay planes de entrenamiento disponibles</p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">Importa planes o crea uno nuevo</p>
            </div>
          )}
        </div>
        
        {/* Información adicional */}
        <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300 flex items-center mb-2">
            <FaInfoCircle className="mr-2" />
            Información sobre importación y exportación
          </h3>
          <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1 ml-6 list-disc">
            <li>Los planes exportados se guardan en formato JSON</li>
            <li>Puedes compartir los planes exportados con otros usuarios</li>
            <li>Al importar planes, se agregarán a tu lista de planes disponibles</li>
            <li>Si importas un plan con el mismo ID que uno existente, se creará una copia</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PlanImportExportManager;
