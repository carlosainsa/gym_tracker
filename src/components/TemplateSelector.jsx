import React, { useState, useEffect } from 'react';
import { FaChevronRight, FaChevronDown, FaDownload, FaUpload, FaCheck, FaFilter, FaSearch } from 'react-icons/fa';
import TemplateDetails from './TemplateDetails';
import { toast } from 'react-toastify';
import templateService from '../services/templateService';

/**
 * Componente para seleccionar plantillas de planes de entrenamiento
 */
const TemplateSelector = ({ onSelectTemplate, onCreatePlan }) => {
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showImportExport, setShowImportExport] = useState(false);
  const [importText, setImportText] = useState('');
  const [importError, setImportError] = useState('');

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
  const handleCreatePlan = (templateId, customizations) => {
    try {
      const plan = templateService.createPlanFromTemplate(templateId, customizations);

      if (onCreatePlan) {
        onCreatePlan(plan);
      }

      // Mostrar confirmación
      toast.success('Plan creado correctamente');
    } catch (error) {
      console.error('Error al crear plan:', error);
      toast.error('Error al crear plan: ' + error.message);
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

      // Notificación manejada por toast
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
        // Mostrar notificación
        toast.success('Plantilla exportada al portapapeles');
      });
    } catch (error) {
      console.error('Error al exportar plantilla:', error);
    }
  };

  // Eliminar plantilla
  const handleDeleteTemplate = (templateId) => {
    if (!templateId) return;

    try {
      const success = templateService.deleteTemplate(templateId);

      if (success) {
        // Actualizar la lista de plantillas
        setTemplates(templateService.getAllTemplates());

        // Deseleccionar la plantilla si es la que estaba seleccionada
        if (selectedTemplate && selectedTemplate.id === templateId) {
          setSelectedTemplate(null);
        }

        // Mostrar confirmación
        toast.success('Plantilla eliminada correctamente');
      }
    } catch (error) {
      console.error('Error al eliminar plantilla:', error);
      toast.error('Error al eliminar plantilla: ' + error.message);
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

          {/* Lista de plantillas y detalles */}
          <div className="md:col-span-2">
            {/* Barra de búsqueda */}
            <div className="mb-4 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400 dark:text-gray-500" />
              </div>
              <input
                type="text"
                placeholder="Buscar plantillas..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                onChange={(e) => {
                  // Implementar búsqueda local
                  const searchTerm = e.target.value.toLowerCase();
                  if (!searchTerm) {
                    setSelectedCategory('all');
                  } else {
                    // Filtrar por término de búsqueda en todas las categorías
                    const results = templates.filter(template =>
                      template.name.toLowerCase().includes(searchTerm) ||
                      template.description.toLowerCase().includes(searchTerm)
                    );

                    if (results.length > 0) {
                      setSelectedTemplate(results[0]);
                    }
                  }
                }}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Lista de plantillas */}
              <div className="overflow-y-auto max-h-[500px] pr-2">
                {filteredTemplates.length > 0 ? (
                  <div className="space-y-2">
                    {filteredTemplates.map(template => (
                      <button
                        key={template.id}
                        onClick={() => handleSelectTemplate(template)}
                        className={`w-full text-left p-3 rounded-lg border ${
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
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500 dark:text-gray-400">No hay plantillas disponibles en esta categoría.</p>
                  </div>
                )}
              </div>

              {/* Detalles de la plantilla */}
              <div>
                <TemplateDetails
                  template={selectedTemplate}
                  onCreatePlan={handleCreatePlan}
                  onDeleteTemplate={!selectedTemplate?.isSystem ? handleDeleteTemplate : undefined}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* No necesitamos la notificación de confirmación aquí ya que usamos toast */}
    </div>
  );
};

export default TemplateSelector;
