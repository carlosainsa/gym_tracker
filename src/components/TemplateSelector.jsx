import React, { useState, useEffect } from 'react';
import { FaChevronRight, FaChevronDown, FaPlus, FaDownload, FaUpload, FaSave, FaTrash, FaCheck } from 'react-icons/fa';
import templateService from '../services/templateService';

/**
 * Componente para seleccionar plantillas de planes de entrenamiento
 */
const TemplateSelector = ({ onSelectTemplate, onCreatePlan }) => {
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [planName, setPlanName] = useState('');
  const [showImportExport, setShowImportExport] = useState(false);
  const [importText, setImportText] = useState('');
  const [importError, setImportError] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  
  // Cargar plantillas
  useEffect(() => {
    const allTemplates = templateService.getAllTemplates();
    setTemplates(allTemplates);
  }, []);
  
  // Categorías disponibles
  const categories = [
    { id: 'all', name: 'Todas las plantillas' },
    { id: 'muscle', name: 'Hipertrofia' },
    { id: 'strength', name: 'Fuerza' },
    { id: 'fat_loss', name: 'Pérdida de grasa' },
    { id: 'endurance', name: 'Resistencia' },
    { id: 'beginner', name: 'Principiantes' },
    { id: 'custom', name: 'Mis plantillas' }
  ];
  
  // Filtrar plantillas por categoría
  const filteredTemplates = selectedCategory === 'all'
    ? templates
    : templates.filter(template => template.category === selectedCategory);
  
  // Seleccionar una plantilla
  const handleSelectTemplate = (template) => {
    setSelectedTemplate(template);
    setPlanName(template.name);
    
    if (onSelectTemplate) {
      onSelectTemplate(template);
    }
  };
  
  // Crear un plan a partir de la plantilla seleccionada
  const handleCreatePlan = () => {
    if (!selectedTemplate) return;
    
    try {
      const plan = templateService.createPlanFromTemplate(selectedTemplate.id, {
        name: planName || selectedTemplate.name
      });
      
      if (onCreatePlan) {
        onCreatePlan(plan);
      }
      
      // Mostrar confirmación
      setShowConfirmation(true);
      setTimeout(() => setShowConfirmation(false), 3000);
    } catch (error) {
      console.error('Error al crear plan:', error);
    }
  };
  
  // Importar plantilla
  const handleImportTemplate = () => {
    try {
      setImportError('');
      
      if (!importText.trim()) {
        setImportError('El texto de importación está vacío');
        return;
      }
      
      const template = templateService.importTemplate(importText);
      
      // Actualizar la lista de plantillas
      setTemplates(templateService.getAllTemplates());
      
      // Seleccionar la plantilla importada
      setSelectedTemplate(template);
      setPlanName(template.name);
      
      // Limpiar el texto de importación
      setImportText('');
      
      // Mostrar confirmación
      setShowConfirmation(true);
      setTimeout(() => setShowConfirmation(false), 3000);
    } catch (error) {
      console.error('Error al importar plantilla:', error);
      setImportError('Error al importar: formato inválido');
    }
  };
  
  // Exportar plantilla
  const handleExportTemplate = () => {
    if (!selectedTemplate) return;
    
    try {
      const json = templateService.exportTemplate(selectedTemplate.id);
      
      // Copiar al portapapeles
      navigator.clipboard.writeText(json).then(() => {
        // Mostrar confirmación
        setShowConfirmation(true);
        setTimeout(() => setShowConfirmation(false), 3000);
      });
    } catch (error) {
      console.error('Error al exportar plantilla:', error);
    }
  };
  
  // Eliminar plantilla
  const handleDeleteTemplate = () => {
    if (!selectedTemplate || selectedTemplate.isSystem) return;
    
    try {
      const success = templateService.deleteTemplate(selectedTemplate.id);
      
      if (success) {
        // Actualizar la lista de plantillas
        setTemplates(templateService.getAllTemplates());
        
        // Deseleccionar la plantilla
        setSelectedTemplate(null);
        setPlanName('');
        
        // Mostrar confirmación
        setShowConfirmation(true);
        setTimeout(() => setShowConfirmation(false), 3000);
      }
    } catch (error) {
      console.error('Error al eliminar plantilla:', error);
    }
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
      <div className="p-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
        <h2 className="font-medium text-gray-800 dark:text-white">Plantillas de planes</h2>
      </div>
      
      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Lista de categorías */}
          <div className="md:col-span-1 border-r border-gray-200 dark:border-gray-700 pr-4">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Categorías</h3>
            <ul className="space-y-1">
              {categories.map(category => (
                <li key={category.id}>
                  <button
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full text-left py-2 px-3 rounded-lg text-sm ${
                      selectedCategory === category.id
                        ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 font-medium'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    {category.name}
                  </button>
                </li>
              ))}
            </ul>
            
            <div className="mt-4">
              <button
                onClick={() => setShowImportExport(!showImportExport)}
                className="flex items-center text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
              >
                {showImportExport ? <FaChevronDown className="mr-1" /> : <FaChevronRight className="mr-1" />}
                Importar/Exportar
              </button>
              
              {showImportExport && (
                <div className="mt-2 space-y-2">
                  <div>
                    <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                      Pegar JSON de plantilla:
                    </label>
                    <textarea
                      value={importText}
                      onChange={(e) => setImportText(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                      rows={3}
                      placeholder="Pega aquí el JSON de la plantilla..."
                    />
                    {importError && (
                      <p className="text-xs text-red-500 mt-1">{importError}</p>
                    )}
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={handleImportTemplate}
                      className="flex-1 py-1 px-2 bg-blue-600 text-white rounded-lg text-xs flex items-center justify-center hover:bg-blue-700 transition-colors"
                    >
                      <FaUpload className="mr-1" />
                      Importar
                    </button>
                    
                    <button
                      onClick={handleExportTemplate}
                      disabled={!selectedTemplate}
                      className="flex-1 py-1 px-2 bg-green-600 text-white rounded-lg text-xs flex items-center justify-center hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FaDownload className="mr-1" />
                      Exportar
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Lista de plantillas */}
          <div className="md:col-span-2">
            {filteredTemplates.length > 0 ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {filteredTemplates.map(template => (
                    <button
                      key={template.id}
                      onClick={() => handleSelectTemplate(template)}
                      className={`text-left p-3 rounded-lg border ${
                        selectedTemplate?.id === template.id
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      <h3 className="font-medium text-gray-800 dark:text-white">{template.name}</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                        {template.description}
                      </p>
                      <div className="flex items-center mt-2">
                        <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-600 dark:text-gray-400">
                          {template.primaryGoal === 'hypertrophy' ? 'Hipertrofia' :
                           template.primaryGoal === 'strength' ? 'Fuerza' :
                           template.primaryGoal === 'fat_loss' ? 'Pérdida de grasa' :
                           template.primaryGoal === 'endurance' ? 'Resistencia' : 'General'}
                        </span>
                        <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-600 dark:text-gray-400 ml-2">
                          {template.difficulty === 'beginner' ? 'Principiante' :
                           template.difficulty === 'intermediate' ? 'Intermedio' : 'Avanzado'}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
                
                {selectedTemplate && (
                  <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-4">
                    <h3 className="font-medium text-gray-800 dark:text-white mb-2">Detalles de la plantilla</h3>
                    
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                          Nombre del plan:
                        </label>
                        <input
                          type="text"
                          value={planName}
                          onChange={(e) => setPlanName(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                          placeholder="Nombre personalizado para tu plan"
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <p className="text-xs text-gray-600 dark:text-gray-400">Duración:</p>
                          <p className="text-sm text-gray-800 dark:text-white">{selectedTemplate.planDuration} semanas</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 dark:text-gray-400">Frecuencia:</p>
                          <p className="text-sm text-gray-800 dark:text-white">{selectedTemplate.weeklyFrequency} días/semana</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 dark:text-gray-400">Periodización:</p>
                          <p className="text-sm text-gray-800 dark:text-white">
                            {selectedTemplate.periodizationType === 'linear' ? 'Lineal' :
                             selectedTemplate.periodizationType === 'undulating' ? 'Ondulante' :
                             selectedTemplate.periodizationType === 'block' ? 'Por bloques' : 'Personalizada'}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 dark:text-gray-400">Distribución:</p>
                          <p className="text-sm text-gray-800 dark:text-white">
                            {selectedTemplate.splitConfiguration === 'fullbody' ? 'Cuerpo completo' :
                             selectedTemplate.splitConfiguration === 'upper_lower' ? 'Superior/Inferior' :
                             selectedTemplate.splitConfiguration === 'push_pull_legs' ? 'Empuje/Tracción/Piernas' : 'Personalizada'}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2 pt-2">
                        <button
                          onClick={handleCreatePlan}
                          className="flex-1 py-2 px-4 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors flex items-center justify-center"
                        >
                          <FaPlus className="mr-2" />
                          Crear plan
                        </button>
                        
                        {!selectedTemplate.isSystem && (
                          <button
                            onClick={handleDeleteTemplate}
                            className="py-2 px-4 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center justify-center"
                          >
                            <FaTrash />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400">No hay plantillas disponibles en esta categoría.</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Notificación de confirmación */}
      {showConfirmation && (
        <div className="fixed bottom-24 left-1/2 transform -translate-x-1/2 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 py-2 px-4 rounded-lg shadow-lg flex items-center">
          <FaCheck className="mr-2" />
          Operación completada con éxito
        </div>
      )}
    </div>
  );
};

export default TemplateSelector;
