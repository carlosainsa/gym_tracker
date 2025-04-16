import React, { useState, useRef } from 'react';
import { FaFileExport, FaFileImport, FaFileDownload, FaCheck, FaTimes } from 'react-icons/fa';
import { useTraining } from '../context/TrainingContext';

/**
 * Componente para importar y exportar planes de entrenamiento
 */
const ImportExportPlans = ({ planId = null, onSuccess = null, buttonStyle = 'default' }) => {
  const { exportPlanToJson, downloadPlanAsJson, importPlanFromJson, trainingPlans } = useTraining();
  const [importStatus, setImportStatus] = useState(null);
  const fileInputRef = useRef(null);
  
  // Estilos de botones
  const buttonStyles = {
    default: 'px-3 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors flex items-center',
    small: 'px-2 py-1 bg-primary-600 text-white rounded-lg text-xs font-medium hover:bg-primary-700 transition-colors flex items-center',
    icon: 'p-2 text-primary-600 hover:bg-primary-100 dark:hover:bg-primary-900/30 rounded-full transition-colors',
    link: 'text-primary-600 hover:text-primary-700 transition-colors flex items-center text-sm'
  };
  
  // Manejar la exportación de un plan
  const handleExportPlan = () => {
    try {
      downloadPlanAsJson(planId);
    } catch (error) {
      console.error('Error al exportar el plan:', error);
      setImportStatus({
        success: false,
        message: 'Error al exportar el plan: ' + error.message
      });
    }
  };
  
  // Manejar la importación de un plan
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
      
      // Importar el plan
      const importedPlan = importPlanFromJson(text);
      
      setImportStatus({
        success: true,
        message: `Plan "${importedPlan.name}" importado correctamente`
      });
      
      // Limpiar el input de archivo
      e.target.value = null;
      
      // Llamar al callback de éxito si existe
      if (onSuccess) {
        onSuccess(importedPlan);
      }
      
      // Limpiar el mensaje después de 3 segundos
      setTimeout(() => {
        setImportStatus(null);
      }, 3000);
    } catch (error) {
      console.error('Error al importar el plan:', error);
      setImportStatus({
        success: false,
        message: 'Error al importar el plan: ' + error.message
      });
      
      // Limpiar el input de archivo
      e.target.value = null;
    }
  };
  
  return (
    <div className="flex flex-col">
      <div className="flex items-center space-x-2">
        {/* Botón de exportar */}
        <button
          onClick={handleExportPlan}
          className={buttonStyles[buttonStyle]}
          title="Exportar plan"
        >
          <FaFileExport className={buttonStyle === 'icon' ? '' : 'mr-2'} />
          {buttonStyle !== 'icon' && 'Exportar Plan'}
        </button>
        
        {/* Botón de importar */}
        <button
          onClick={handleImportClick}
          className={buttonStyles[buttonStyle]}
          title="Importar plan"
        >
          <FaFileImport className={buttonStyle === 'icon' ? '' : 'mr-2'} />
          {buttonStyle !== 'icon' && 'Importar Plan'}
        </button>
        
        {/* Input de archivo oculto */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".json"
          className="hidden"
        />
      </div>
      
      {/* Mensaje de estado */}
      {importStatus && (
        <div className={`mt-2 p-2 rounded-lg text-sm flex items-center ${
          importStatus.success 
            ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200' 
            : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200'
        }`}>
          {importStatus.success 
            ? <FaCheck className="mr-2 text-green-600 dark:text-green-400" /> 
            : <FaTimes className="mr-2 text-red-600 dark:text-red-400" />
          }
          {importStatus.message}
        </div>
      )}
    </div>
  );
};

export default ImportExportPlans;
