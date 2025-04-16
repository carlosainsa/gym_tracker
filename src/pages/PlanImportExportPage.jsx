import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaExchangeAlt } from 'react-icons/fa';
import PlanImportExportManager from '../components/PlanImportExportManager';

/**
 * Página para importar y exportar planes de entrenamiento
 */
const PlanImportExportPage = () => {
  const navigate = useNavigate();
  
  return (
    <div className="container mx-auto px-4 py-8 pt-16 pb-24 max-w-4xl">
      {/* Encabezado */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <FaArrowLeft className="text-gray-600 dark:text-gray-300" />
        </button>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Importar y Exportar Planes</h1>
        <div className="w-8"></div>
      </div>
      
      {/* Contenido principal */}
      <div className="space-y-6">
        {/* Descripción */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden mb-6">
          <div className="p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <div className="flex items-center">
              <FaExchangeAlt className="mr-2" />
              <h2 className="text-lg font-medium">Gestión de Planes</h2>
            </div>
            <p className="text-white text-opacity-90 mt-1">
              Importa y exporta tus planes de entrenamiento para hacer copias de seguridad o compartirlos
            </p>
          </div>
          
          <div className="p-6">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Esta herramienta te permite gestionar tus planes de entrenamiento de forma flexible:
            </p>
            
            <ul className="list-disc pl-6 space-y-2 text-gray-600 dark:text-gray-400">
              <li><span className="font-medium text-gray-700 dark:text-gray-300">Exportar planes:</span> Guarda tus planes como archivos JSON para hacer copias de seguridad o compartirlos con otros usuarios.</li>
              <li><span className="font-medium text-gray-700 dark:text-gray-300">Importar planes:</span> Carga planes que hayas guardado previamente o que te hayan compartido otros usuarios.</li>
              <li><span className="font-medium text-gray-700 dark:text-gray-300">Exportación selectiva:</span> Selecciona qué planes específicos quieres exportar.</li>
              <li><span className="font-medium text-gray-700 dark:text-gray-300">Exportación completa:</span> Exporta todos tus planes de una vez para hacer una copia de seguridad completa.</li>
            </ul>
          </div>
        </div>
        
        {/* Gestor de importación/exportación */}
        <PlanImportExportManager />
      </div>
    </div>
  );
};

export default PlanImportExportPage;
