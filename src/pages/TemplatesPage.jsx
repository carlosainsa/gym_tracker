import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaPlus, FaSave } from 'react-icons/fa';
import { useTraining } from '../context/TrainingContext';
import TemplateSelector from '../components/TemplateSelector';
import templateService from '../services/templateService';

/**
 * Página para gestionar plantillas de planes de entrenamiento
 */
const TemplatesPage = () => {
  const navigate = useNavigate();
  const { trainingPlan, setTrainingPlan } = useTraining();
  const [showSaveForm, setShowSaveForm] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const [templateDescription, setTemplateDescription] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  // Manejar la selección de una plantilla
  const handleSelectTemplate = (template) => {
    // No es necesario hacer nada aquí, solo para referencia
  };
  
  // Manejar la creación de un plan a partir de una plantilla
  const handleCreatePlan = (plan) => {
    setTrainingPlan(plan);
    navigate('/plan/new');
  };
  
  // Manejar el guardado del plan actual como plantilla
  const handleSaveAsTemplate = () => {
    if (!templateName.trim()) return;
    
    try {
      templateService.createTemplateFromPlan(
        trainingPlan,
        templateName,
        templateDescription
      );
      
      // Mostrar mensaje de éxito
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      
      // Limpiar el formulario
      setTemplateName('');
      setTemplateDescription('');
      setShowSaveForm(false);
    } catch (error) {
      console.error('Error al guardar plantilla:', error);
    }
  };
  
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
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Plantillas de Entrenamiento</h1>
        <button
          onClick={() => setShowSaveForm(!showSaveForm)}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          title="Guardar plan actual como plantilla"
        >
          <FaSave className="text-primary-600 dark:text-primary-400" />
        </button>
      </div>

      {/* Formulario para guardar como plantilla */}
      {showSaveForm && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden mb-6">
          <div className="p-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
            <h2 className="font-medium text-gray-800 dark:text-white">Guardar plan actual como plantilla</h2>
          </div>
          
          <div className="p-4">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Nombre de la plantilla:
                </label>
                <input
                  type="text"
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                  placeholder="Ej: Mi plan personalizado"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Descripción:
                </label>
                <textarea
                  value={templateDescription}
                  onChange={(e) => setTemplateDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                  rows={3}
                  placeholder="Describe brevemente el propósito y características de este plan..."
                />
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={handleSaveAsTemplate}
                  className="flex-1 py-2 px-4 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors flex items-center justify-center"
                >
                  <FaSave className="mr-2" />
                  Guardar como plantilla
                </button>
                
                <button
                  onClick={() => setShowSaveForm(false)}
                  className="py-2 px-4 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Selector de plantillas */}
      <TemplateSelector
        onSelectTemplate={handleSelectTemplate}
        onCreatePlan={handleCreatePlan}
      />
      
      {/* Mensaje de éxito */}
      {saveSuccess && (
        <div className="fixed bottom-24 left-1/2 transform -translate-x-1/2 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 py-2 px-4 rounded-lg shadow-lg flex items-center">
          <FaCheck className="mr-2" />
          Plantilla guardada con éxito
        </div>
      )}
    </div>
  );
};

export default TemplatesPage;
