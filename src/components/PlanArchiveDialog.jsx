import React, { useState } from 'react';
import { FaArchive, FaInfoCircle, FaCheck } from 'react-icons/fa';
import { toast } from 'react-toastify';
import historicalPlanService from '../services/historicalPlanService';

/**
 * Componente para archivar un plan de entrenamiento
 */
const PlanArchiveDialog = ({ isOpen, onClose, plan }) => {
  const [archiveReason, setArchiveReason] = useState('');
  const [includeNotes, setIncludeNotes] = useState(true);
  const [generateSummary, setGenerateSummary] = useState(true);
  const [loading, setLoading] = useState(false);
  
  if (!isOpen || !plan) return null;
  
  // Manejar el archivado del plan
  const handleArchivePlan = async () => {
    if (loading) return;
    
    setLoading(true);
    
    try {
      const archivedPlan = historicalPlanService.archivePlan(plan.id, {
        archiveReason,
        includeNotes,
        generateSummary
      });
      
      toast.success('Plan archivado correctamente');
      onClose(archivedPlan);
    } catch (error) {
      console.error('Error al archivar plan:', error);
      toast.error('Error al archivar plan: ' + error.message);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center">
              <FaArchive className="mr-2 text-primary-500" />
              Archivar Plan
            </h2>
            <button
              onClick={() => onClose()}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              &times;
            </button>
          </div>
          
          <div className="space-y-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 p-3 rounded-lg flex">
              <FaInfoCircle className="text-blue-500 dark:text-blue-400 mt-1 mr-2 flex-shrink-0" />
              <p className="text-sm">
                Al archivar un plan, este se moverá a la sección de planes históricos. 
                Podrás acceder a él en cualquier momento, pero no estará disponible para 
                entrenamientos activos.
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Razón del archivado (opcional)
              </label>
              <textarea
                value={archiveReason}
                onChange={(e) => setArchiveReason(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                placeholder="Ej: Plan completado, Cambio de objetivos, etc."
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="includeNotes"
                  checked={includeNotes}
                  onChange={(e) => setIncludeNotes(e.target.checked)}
                  className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <label htmlFor="includeNotes" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  Incluir notas y comentarios
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="generateSummary"
                  checked={generateSummary}
                  onChange={(e) => setGenerateSummary(e.target.checked)}
                  className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <label htmlFor="generateSummary" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  Generar resumen de resultados
                </label>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={() => onClose()}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleArchivePlan}
              disabled={loading}
              className={`px-4 py-2 rounded-lg flex items-center ${
                loading
                  ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                  : 'bg-primary-600 text-white hover:bg-primary-700'
              } transition-colors`}
            >
              {loading ? (
                <>Archivando...</>
              ) : (
                <>
                  <FaArchive className="mr-2" />
                  Archivar Plan
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanArchiveDialog;
