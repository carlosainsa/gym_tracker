import React, { useState, useRef } from 'react';
import { FaFileExport, FaFileImport, FaFileDownload, FaCheck, FaTimes, FaFileCsv, FaInfoCircle } from 'react-icons/fa';
import { useTraining } from '../context/TrainingContext';
import importExportService from '../services/importExportService';

/**
 * Componente para importar y exportar planes de entrenamiento
 */
const ImportExportPlans = ({ planId = null, onSuccess = null, buttonStyle = 'default', showAllOptions = false }) => {
  const { exportPlanToJson, downloadPlanAsJson, importPlanFromJson, trainingPlans } = useTraining();
  const [importStatus, setImportStatus] = useState(null);
  const [showExportOptions, setShowExportOptions] = useState(false);
  const fileInputRef = useRef(null);
  const csvFileInputRef = useRef(null);

  // Estilos de botones
  const buttonStyles = {
    default: 'px-3 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors flex items-center',
    small: 'px-2 py-1 bg-primary-600 text-white rounded-lg text-xs font-medium hover:bg-primary-700 transition-colors flex items-center',
    icon: 'p-2 text-primary-600 hover:bg-primary-100 dark:hover:bg-primary-900/30 rounded-full transition-colors',
    link: 'text-primary-600 hover:text-primary-700 transition-colors flex items-center text-sm'
  };

  // Manejar la exportación de un plan
  const handleExportPlan = () => {
    if (showAllOptions) {
      setShowExportOptions(!showExportOptions);
      return;
    }

    try {
      // Si no hay opciones avanzadas, usar la exportación estándar
      downloadPlanAsJson(planId);
    } catch (error) {
      console.error('Error al exportar el plan:', error);
      setImportStatus({
        success: false,
        message: 'Error al exportar el plan: ' + error.message
      });
    }
  };

  // Exportar plan como JSON
  const handleExportAsJson = () => {
    try {
      const plan = trainingPlans.find(p => p.id === planId);
      if (!plan) {
        throw new Error('Plan no encontrado');
      }

      importExportService.downloadPlanAsJson(plan);

      setImportStatus({
        success: true,
        message: 'Plan exportado correctamente como JSON'
      });

      // Ocultar opciones de exportación
      setShowExportOptions(false);

      // Limpiar el mensaje después de 3 segundos
      setTimeout(() => {
        setImportStatus(null);
      }, 3000);
    } catch (error) {
      console.error('Error al exportar el plan como JSON:', error);
      setImportStatus({
        success: false,
        message: 'Error al exportar el plan: ' + error.message
      });
    }
  };

  // Exportar plan como CSV
  const handleExportAsCsv = () => {
    try {
      const plan = trainingPlans.find(p => p.id === planId);
      if (!plan) {
        throw new Error('Plan no encontrado');
      }

      importExportService.downloadPlanAsCsv(plan);

      setImportStatus({
        success: true,
        message: 'Plan exportado correctamente como CSV'
      });

      // Ocultar opciones de exportación
      setShowExportOptions(false);

      // Limpiar el mensaje después de 3 segundos
      setTimeout(() => {
        setImportStatus(null);
      }, 3000);
    } catch (error) {
      console.error('Error al exportar el plan como CSV:', error);
      setImportStatus({
        success: false,
        message: 'Error al exportar el plan: ' + error.message
      });
    }
  };

  // Manejar la importación de un plan
  const handleImportClick = () => {
    if (showAllOptions) {
      // Mostrar opciones de importación
      fileInputRef.current.click();
    } else {
      // Importación estándar
      fileInputRef.current.click();
    }
  };

  // Manejar la importación de un plan desde CSV
  const handleImportCsvClick = () => {
    csvFileInputRef.current.click();
  };

  // Manejar el cambio de archivo JSON
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      // Validar el archivo
      await importExportService.validateImportFile(file);

      // Leer el archivo
      const text = await importExportService.readFileAsText(file);

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

  // Manejar el cambio de archivo CSV
  const handleCsvFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      // Leer el archivo
      const csvContent = await importExportService.readFileAsText(file);

      // Importar el plan desde CSV
      const importedPlan = importExportService.importPlanFromCsv(csvContent, {
        planName: `Plan importado ${new Date().toLocaleDateString()}`
      });

      setImportStatus({
        success: true,
        message: `Plan "${importedPlan.name}" importado correctamente desde CSV`
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
      console.error('Error al importar el plan desde CSV:', error);
      setImportStatus({
        success: false,
        message: 'Error al importar el plan desde CSV: ' + error.message
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
          {buttonStyle !== 'icon' && (showAllOptions ? 'Exportar' : 'Exportar Plan')}
        </button>

        {/* Botón de importar */}
        <button
          onClick={handleImportClick}
          className={buttonStyles[buttonStyle]}
          title="Importar plan"
        >
          <FaFileImport className={buttonStyle === 'icon' ? '' : 'mr-2'} />
          {buttonStyle !== 'icon' && (showAllOptions ? 'Importar' : 'Importar Plan')}
        </button>

        {/* Input de archivo JSON oculto */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".json"
          className="hidden"
        />

        {/* Input de archivo CSV oculto */}
        <input
          type="file"
          ref={csvFileInputRef}
          onChange={handleCsvFileChange}
          accept=".csv"
          className="hidden"
        />
      </div>

      {/* Opciones de exportación */}
      {showExportOptions && (
        <div className="mt-2 bg-gray-50 dark:bg-gray-700 p-3 rounded-lg border border-gray-200 dark:border-gray-600">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
            <FaInfoCircle className="mr-2 text-primary-500" />
            Opciones de exportación
          </h3>

          <div className="flex flex-col space-y-2">
            <button
              onClick={handleExportAsJson}
              className="flex items-center text-sm px-3 py-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-800/50 transition-colors"
            >
              <FaFileExport className="mr-2" />
              Exportar como JSON
            </button>

            <button
              onClick={handleExportAsCsv}
              className="flex items-center text-sm px-3 py-1.5 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg hover:bg-green-100 dark:hover:bg-green-800/50 transition-colors"
            >
              <FaFileCsv className="mr-2" />
              Exportar como CSV
            </button>
          </div>
        </div>
      )}

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
