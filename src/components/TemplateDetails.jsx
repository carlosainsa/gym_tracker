import React, { useState } from 'react';
import { FaPlus, FaTrash, FaCheck, FaInfoCircle, FaCalendarAlt, FaDumbbell, FaWeight, FaChartLine } from 'react-icons/fa';
import { toast } from 'react-toastify';

/**
 * Componente para mostrar detalles de una plantilla de plan de entrenamiento
 */
const TemplateDetails = ({ template, onCreatePlan, onDeleteTemplate }) => {
  const [planName, setPlanName] = useState(template?.name || '');
  const [planDescription, setPlanDescription] = useState(template?.description || '');
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  
  if (!template) {
    return (
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 text-center">
        <FaInfoCircle className="mx-auto text-gray-400 dark:text-gray-500 text-3xl mb-2" />
        <p className="text-gray-600 dark:text-gray-400">Selecciona una plantilla para ver sus detalles</p>
      </div>
    );
  }
  
  // Manejar la creación de un plan
  const handleCreatePlan = () => {
    if (!planName.trim()) {
      toast.error('Por favor, introduce un nombre para el plan');
      return;
    }
    
    if (onCreatePlan) {
      onCreatePlan(template.id, {
        name: planName,
        description: planDescription
      });
    }
  };
  
  // Manejar la eliminación de una plantilla
  const handleDeleteTemplate = () => {
    if (onDeleteTemplate) {
      onDeleteTemplate(template.id);
      setShowConfirmDelete(false);
    }
  };
  
  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
      <div className="p-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white">
        <h3 className="font-bold text-lg">{template.name}</h3>
        <p className="text-white text-opacity-90 mt-1">{template.description}</p>
      </div>
      
      <div className="p-4">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Nombre personalizado para tu plan:
            </label>
            <input
              type="text"
              value={planName}
              onChange={(e) => setPlanName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
              placeholder="Ej: Mi plan de hipertrofia"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Descripción personalizada (opcional):
            </label>
            <textarea
              value={planDescription}
              onChange={(e) => setPlanDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
              rows={3}
              placeholder="Describe brevemente el propósito de este plan..."
            />
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <h4 className="font-medium text-gray-800 dark:text-white mb-3">Características del plan</h4>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-start">
                <FaCalendarAlt className="text-primary-500 mt-0.5 mr-2" />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Duración</p>
                  <p className="text-sm font-medium text-gray-800 dark:text-white">{template.planDuration} semanas</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <FaDumbbell className="text-primary-500 mt-0.5 mr-2" />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Frecuencia</p>
                  <p className="text-sm font-medium text-gray-800 dark:text-white">{template.weeklyFrequency} días/semana</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <FaWeight className="text-primary-500 mt-0.5 mr-2" />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Objetivo principal</p>
                  <p className="text-sm font-medium text-gray-800 dark:text-white">
                    {template.primaryGoal === 'hypertrophy' ? 'Hipertrofia' :
                     template.primaryGoal === 'strength' ? 'Fuerza' :
                     template.primaryGoal === 'fat_loss' ? 'Pérdida de grasa' :
                     template.primaryGoal === 'endurance' ? 'Resistencia' : 'General'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <FaChartLine className="text-primary-500 mt-0.5 mr-2" />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Periodización</p>
                  <p className="text-sm font-medium text-gray-800 dark:text-white">
                    {template.periodizationType === 'linear' ? 'Lineal' :
                     template.periodizationType === 'undulating' ? 'Ondulante' :
                     template.periodizationType === 'block' ? 'Por bloques' : 'Personalizada'}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-3">
              <p className="text-xs text-gray-500 dark:text-gray-400">Distribución</p>
              <p className="text-sm font-medium text-gray-800 dark:text-white">
                {template.splitConfiguration === 'fullbody' ? 'Cuerpo completo' :
                 template.splitConfiguration === 'upper_lower' ? 'Superior/Inferior' :
                 template.splitConfiguration === 'push_pull_legs' ? 'Empuje/Tracción/Piernas' : 'Personalizada'}
              </p>
            </div>
            
            {template.secondaryGoals && template.secondaryGoals.length > 0 && (
              <div className="mt-3">
                <p className="text-xs text-gray-500 dark:text-gray-400">Objetivos secundarios</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {template.secondaryGoals.map(goal => (
                    <span 
                      key={goal}
                      className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded-full text-gray-700 dark:text-gray-300"
                    >
                      {goal === 'hypertrophy' ? 'Hipertrofia' :
                       goal === 'strength' ? 'Fuerza' :
                       goal === 'fat_loss' ? 'Pérdida de grasa' :
                       goal === 'endurance' ? 'Resistencia' : 'General'}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {template.equipment && template.equipment.length > 0 && (
              <div className="mt-3">
                <p className="text-xs text-gray-500 dark:text-gray-400">Equipamiento</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {template.equipment.map(eq => (
                    <span 
                      key={eq}
                      className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded-full text-gray-700 dark:text-gray-300"
                    >
                      {eq === 'bodyweight' ? 'Peso corporal' :
                       eq === 'dumbbell' ? 'Mancuernas' :
                       eq === 'barbell' ? 'Barra' :
                       eq === 'machine' ? 'Máquinas' :
                       eq === 'cable' ? 'Poleas' :
                       eq === 'kettlebell' ? 'Kettlebells' :
                       eq === 'all' ? 'Todo' : eq}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div className="flex space-x-2 pt-2">
            <button
              onClick={handleCreatePlan}
              className="flex-1 py-2 px-4 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors flex items-center justify-center"
            >
              <FaPlus className="mr-2" />
              Crear plan
            </button>
            
            {!template.isSystem && onDeleteTemplate && (
              <button
                onClick={() => setShowConfirmDelete(true)}
                className="py-2 px-4 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center justify-center"
              >
                <FaTrash />
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Confirmación de eliminación */}
      {showConfirmDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Confirmar eliminación</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              ¿Estás seguro de que deseas eliminar la plantilla <span className="font-medium">{template.name}</span>? Esta acción no se puede deshacer.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowConfirmDelete(false)}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteTemplate}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TemplateDetails;
