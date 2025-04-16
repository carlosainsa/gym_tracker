import React, { useState, useEffect } from 'react';
import { FaCheck, FaDumbbell, FaFire, FaRunning, FaUser, FaChevronRight, FaInfoCircle } from 'react-icons/fa';
import { GiMuscleUp } from 'react-icons/gi';
import templateService from '../services/templateService';

/**
 * Componente para seleccionar una plantilla de plan de entrenamiento
 */
const PlanTemplateSelector = ({ onSelectTemplate, onBack }) => {
  const [templates, setTemplates] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  
  // Cargar plantillas
  useEffect(() => {
    const allTemplates = templateService.getAllTemplates();
    setTemplates(allTemplates);
    
    // Agrupar plantillas por categoría
    const categories = [...new Set(allTemplates.map(t => t.category))];
    if (categories.length > 0) {
      setSelectedCategory(categories[0]);
    }
  }, []);
  
  // Obtener plantillas de la categoría seleccionada
  const getTemplatesByCategory = (category) => {
    return templates.filter(t => t.category === category);
  };
  
  // Obtener todas las categorías únicas
  const getCategories = () => {
    return [...new Set(templates.map(t => t.category))];
  };
  
  // Manejar la selección de una categoría
  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setSelectedTemplate(null);
    setShowDetails(false);
  };
  
  // Manejar la selección de una plantilla
  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
    setShowDetails(true);
  };
  
  // Manejar la confirmación de la plantilla
  const handleConfirmTemplate = () => {
    if (selectedTemplate && onSelectTemplate) {
      onSelectTemplate(selectedTemplate);
    }
  };
  
  // Obtener icono según la categoría
  const getCategoryIcon = (category) => {
    switch (category) {
      case 'strength':
        return <FaDumbbell className="text-blue-500" />;
      case 'muscle':
        return <GiMuscleUp className="text-purple-500" />;
      case 'fat_loss':
        return <FaFire className="text-red-500" />;
      case 'endurance':
        return <FaRunning className="text-green-500" />;
      case 'beginner':
        return <FaUser className="text-teal-500" />;
      default:
        return <FaDumbbell className="text-gray-500" />;
    }
  };
  
  // Obtener nombre legible de la categoría
  const getCategoryName = (category) => {
    switch (category) {
      case 'strength':
        return 'Fuerza';
      case 'muscle':
        return 'Hipertrofia';
      case 'fat_loss':
        return 'Pérdida de Grasa';
      case 'endurance':
        return 'Resistencia';
      case 'beginner':
        return 'Principiantes';
      case 'custom':
        return 'Personalizados';
      default:
        return category;
    }
  };
  
  // Obtener nombre legible del nivel de dificultad
  const getDifficultyName = (difficulty) => {
    switch (difficulty) {
      case 'beginner':
        return 'Principiante';
      case 'intermediate':
        return 'Intermedio';
      case 'advanced':
        return 'Avanzado';
      default:
        return difficulty;
    }
  };
  
  // Obtener nombre legible del tipo de periodización
  const getPeriodizationName = (type) => {
    switch (type) {
      case 'linear':
        return 'Lineal';
      case 'undulating':
        return 'Ondulante';
      case 'block':
        return 'Por bloques';
      case 'conjugate':
        return 'Conjugada';
      default:
        return type;
    }
  };
  
  // Obtener nombre legible del tipo de división
  const getSplitName = (split) => {
    switch (split) {
      case 'fullbody':
        return 'Cuerpo completo';
      case 'upper_lower':
        return 'Superior/Inferior';
      case 'push_pull_legs':
        return 'Empuje/Tirón/Piernas';
      case 'body_part_split':
        return 'División por grupos musculares';
      default:
        return split;
    }
  };
  
  // Obtener nombre legible del objetivo
  const getGoalName = (goal) => {
    switch (goal) {
      case 'strength':
        return 'Fuerza';
      case 'hypertrophy':
        return 'Hipertrofia';
      case 'fat_loss':
        return 'Pérdida de grasa';
      case 'endurance':
        return 'Resistencia';
      case 'general':
        return 'General';
      default:
        return goal;
    }
  };
  
  // Renderizar la vista de categorías
  if (!showDetails) {
    return (
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Selecciona un tipo de plan</h2>
        
        {/* Lista de categorías */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {getCategories().map(category => (
            <button
              key={category}
              onClick={() => handleCategorySelect(category)}
              className={`flex items-center p-4 rounded-lg border transition-colors ${
                selectedCategory === category
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              <div className="mr-3 text-xl">{getCategoryIcon(category)}</div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-800 dark:text-white">{getCategoryName(category)}</h3>
              </div>
              <FaChevronRight className="text-gray-400" />
            </button>
          ))}
        </div>
        
        {/* Lista de plantillas de la categoría seleccionada */}
        {selectedCategory && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-800 dark:text-white">
              Plantillas de {getCategoryName(selectedCategory)}
            </h3>
            
            <div className="space-y-3">
              {getTemplatesByCategory(selectedCategory).map(template => (
                <button
                  key={template.id}
                  onClick={() => handleTemplateSelect(template)}
                  className="w-full flex items-center p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-800 dark:text-white">{template.name}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{template.description}</p>
                    
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                        {getDifficultyName(template.difficulty)}
                      </span>
                      <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
                        {template.planDuration} semanas
                      </span>
                      <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                        {template.weeklyFrequency}x/semana
                      </span>
                    </div>
                  </div>
                  <FaChevronRight className="text-gray-400" />
                </button>
              ))}
            </div>
          </div>
        )}
        
        {/* Botones de acción */}
        <div className="flex justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onBack}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            Volver
          </button>
        </div>
      </div>
    );
  }
  
  // Renderizar la vista de detalles de la plantilla
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">Detalles de la plantilla</h2>
        <button
          onClick={() => setShowDetails(false)}
          className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
        >
          Volver a la lista
        </button>
      </div>
      
      {selectedTemplate && (
        <div className="space-y-6">
          {/* Encabezado */}
          <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white p-4 rounded-lg">
            <h3 className="text-xl font-bold">{selectedTemplate.name}</h3>
            <p className="mt-1 text-white text-opacity-90">{selectedTemplate.description}</p>
          </div>
          
          {/* Características principales */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <h4 className="font-medium text-gray-800 dark:text-white mb-2">Objetivo principal</h4>
              <p className="text-gray-600 dark:text-gray-400">{getGoalName(selectedTemplate.primaryGoal)}</p>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <h4 className="font-medium text-gray-800 dark:text-white mb-2">Nivel de dificultad</h4>
              <p className="text-gray-600 dark:text-gray-400">{getDifficultyName(selectedTemplate.difficulty)}</p>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <h4 className="font-medium text-gray-800 dark:text-white mb-2">Duración</h4>
              <p className="text-gray-600 dark:text-gray-400">{selectedTemplate.planDuration} semanas</p>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <h4 className="font-medium text-gray-800 dark:text-white mb-2">Frecuencia</h4>
              <p className="text-gray-600 dark:text-gray-400">{selectedTemplate.weeklyFrequency} días por semana</p>
            </div>
          </div>
          
          {/* Detalles adicionales */}
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <h4 className="font-medium text-gray-800 dark:text-white mb-3">Detalles del plan</h4>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Tipo de periodización</span>
                <span className="font-medium text-gray-800 dark:text-white">{getPeriodizationName(selectedTemplate.periodizationType)}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Tipo de división</span>
                <span className="font-medium text-gray-800 dark:text-white">{getSplitName(selectedTemplate.splitConfiguration)}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Duración de sesiones</span>
                <span className="font-medium text-gray-800 dark:text-white">{selectedTemplate.sessionDuration} minutos</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Objetivos secundarios</span>
                <span className="font-medium text-gray-800 dark:text-white">
                  {selectedTemplate.secondaryGoals.map(goal => getGoalName(goal)).join(', ') || 'Ninguno'}
                </span>
              </div>
            </div>
          </div>
          
          {/* Información adicional */}
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <div className="flex items-start">
              <FaInfoCircle className="text-blue-500 mt-1 mr-3 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-1">Información importante</h4>
                <p className="text-sm text-blue-700 dark:text-blue-400">
                  Al seleccionar esta plantilla, se creará un plan de entrenamiento completo basado en los parámetros mostrados.
                  Podrás personalizar el plan después de crearlo.
                </p>
              </div>
            </div>
          </div>
          
          {/* Botones de acción */}
          <div className="flex justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setShowDetails(false)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Volver
            </button>
            
            <button
              onClick={handleConfirmTemplate}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors flex items-center"
            >
              <FaCheck className="mr-2" />
              Seleccionar esta plantilla
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlanTemplateSelector;
