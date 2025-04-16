import React, { useState } from 'react';
import { FaCopy, FaCheck, FaTimes } from 'react-icons/fa';
import { useTraining } from '../context/TrainingContext';

/**
 * Componente de diálogo para duplicar un plan de entrenamiento
 */
const PlanDuplicateDialog = ({ plan, onClose, onSuccess }) => {
  const { duplicatePlan } = useTraining();
  const [formData, setFormData] = useState({
    name: `Copia de ${plan?.name || ''}`,
    description: plan?.description || '',
    keepProgress: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Manejar cambios en el formulario
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  // Manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Duplicar el plan
      const newPlan = duplicatePlan(plan.id, formData);
      
      // Notificar éxito
      if (onSuccess) {
        onSuccess(newPlan);
      }
      
      // Cerrar el diálogo
      if (onClose) {
        onClose();
      }
    } catch (error) {
      console.error('Error al duplicar el plan:', error);
      setError(error.message || 'Error al duplicar el plan');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full overflow-hidden">
        <div className="p-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white">
          <h2 className="text-xl font-bold flex items-center">
            <FaCopy className="mr-2" />
            Duplicar Plan
          </h2>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg">
              <p className="text-sm">{error}</p>
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Nombre del plan duplicado
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                required
              />
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Descripción
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
              />
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="keepProgress"
                name="keepProgress"
                checked={formData.keepProgress}
                onChange={handleChange}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="keepProgress" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                Mantener el progreso registrado
              </label>
            </div>
            
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Al duplicar un plan, se creará una copia exacta con un nuevo identificador. 
              {!formData.keepProgress && 'El progreso registrado no se copiará al nuevo plan.'}
              {formData.keepProgress && 'Se mantendrá todo el progreso registrado en el plan original.'}
            </p>
          </div>
          
          <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              disabled={loading}
            >
              <FaTimes className="inline mr-1" />
              Cancelar
            </button>
            
            <button
              type="submit"
              className="px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors flex items-center"
              disabled={loading}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Duplicando...
                </>
              ) : (
                <>
                  <FaCheck className="mr-2" />
                  Duplicar Plan
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PlanDuplicateDialog;
