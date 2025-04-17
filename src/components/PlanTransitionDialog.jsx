import React, { useState, useEffect } from 'react';
import { FaExchangeAlt, FaInfoCircle, FaArrowRight, FaCalendarAlt, FaWeight, FaChartLine, FaDumbbell } from 'react-icons/fa';
import { toast } from 'react-toastify';
import transitionService from '../services/transitionService';
import planService from '../services/planService';
import { useTrainingContext } from '../contexts/TrainingContext';

/**
 * Componente para crear un plan de transición entre dos planes
 */
const PlanTransitionDialog = ({ isOpen, onClose, sourcePlanId }) => {
  const { trainingPlans } = useTrainingContext();
  
  // Estados
  const [targetPlanId, setTargetPlanId] = useState('');
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  
  // Opciones de transición
  const [transitionName, setTransitionName] = useState('');
  const [transitionDescription, setTransitionDescription] = useState('');
  const [duration, setDuration] = useState(2);
  const [intensity, setIntensity] = useState('moderate');
  const [maintainExercises, setMaintainExercises] = useState(true);
  const [deloadWeek, setDeloadWeek] = useState(true);
  
  // Obtener planes disponibles (excluyendo el plan de origen)
  const availablePlans = trainingPlans.filter(plan => 
    plan.id !== sourcePlanId && plan.status === 'available'
  );
  
  // Obtener detalles del plan de origen
  const sourcePlan = planService.getPlanById(sourcePlanId);
  
  // Actualizar nombre y descripción cuando cambia el plan de destino
  useEffect(() => {
    if (sourcePlan && targetPlanId) {
      const targetPlan = planService.getPlanById(targetPlanId);
      if (targetPlan) {
        setTransitionName(`Transición: ${sourcePlan.name} → ${targetPlan.name}`);
        setTransitionDescription(`Plan de transición entre "${sourcePlan.name}" y "${targetPlan.name}"`);
      }
    }
  }, [sourcePlanId, targetPlanId, sourcePlan]);
  
  // Obtener recomendaciones cuando se selecciona un plan de destino
  useEffect(() => {
    if (sourcePlanId && targetPlanId) {
      setAnalyzing(true);
      
      try {
        const recs = transitionService.getTransitionRecommendations(sourcePlanId, targetPlanId);
        setRecommendations(recs);
        
        // Actualizar valores con las recomendaciones
        setDuration(recs.recommendedDuration);
        setDeloadWeek(recs.recommendDeload);
        setIntensity(recs.recommendedIntensity);
      } catch (error) {
        console.error('Error al obtener recomendaciones:', error);
        toast.error('Error al analizar los planes: ' + error.message);
      } finally {
        setAnalyzing(false);
      }
    }
  }, [sourcePlanId, targetPlanId]);
  
  // Manejar la creación del plan de transición
  const handleCreateTransition = () => {
    if (!sourcePlanId || !targetPlanId) {
      toast.error('Selecciona un plan de destino');
      return;
    }
    
    setLoading(true);
    
    try {
      const transitionPlan = transitionService.createTransitionPlan(
        sourcePlanId,
        targetPlanId,
        {
          name: transitionName,
          description: transitionDescription,
          duration,
          intensity,
          maintainExercises,
          deloadWeek
        }
      );
      
      toast.success('Plan de transición creado correctamente');
      onClose(transitionPlan);
    } catch (error) {
      console.error('Error al crear plan de transición:', error);
      toast.error('Error al crear plan de transición: ' + error.message);
    } finally {
      setLoading(false);
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center">
              <FaExchangeAlt className="mr-2 text-primary-500" />
              Crear Plan de Transición
            </h2>
            <button
              onClick={() => onClose()}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              &times;
            </button>
          </div>
          
          <div className="space-y-6">
            {/* Selección de planes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <h3 className="font-medium text-gray-800 dark:text-white mb-2">Plan de Origen</h3>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                  <p className="font-medium text-gray-800 dark:text-white">{sourcePlan?.name}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{sourcePlan?.description}</p>
                </div>
              </div>
              
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <h3 className="font-medium text-gray-800 dark:text-white mb-2">Plan de Destino</h3>
                <select
                  value={targetPlanId}
                  onChange={(e) => setTargetPlanId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                >
                  <option value="">Selecciona un plan...</option>
                  {availablePlans.map(plan => (
                    <option key={plan.id} value={plan.id}>
                      {plan.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            {/* Análisis y recomendaciones */}
            {analyzing ? (
              <div className="text-center py-4">
                <p className="text-gray-600 dark:text-gray-400">Analizando planes...</p>
              </div>
            ) : recommendations && (
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <h3 className="font-medium text-gray-800 dark:text-white mb-3 flex items-center">
                  <FaInfoCircle className="mr-2 text-primary-500" />
                  Análisis y Recomendaciones
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Similitudes y Diferencias</h4>
                    <ul className="space-y-1 text-sm">
                      <li className="flex items-center">
                        <span className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 flex items-center justify-center mr-2">
                          {recommendations.analysis.commonExercisesCount}
                        </span>
                        <span className="text-gray-600 dark:text-gray-400">
                          Ejercicios comunes
                        </span>
                      </li>
                      <li className="flex items-center">
                        <span className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 flex items-center justify-center mr-2">
                          {recommendations.analysis.uniqueSourceExercisesCount}
                        </span>
                        <span className="text-gray-600 dark:text-gray-400">
                          Ejercicios únicos en plan de origen
                        </span>
                      </li>
                      <li className="flex items-center">
                        <span className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400 flex items-center justify-center mr-2">
                          {recommendations.analysis.uniqueTargetExercisesCount}
                        </span>
                        <span className="text-gray-600 dark:text-gray-400">
                          Ejercicios únicos en plan de destino
                        </span>
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Diferencias Clave</h4>
                    <ul className="space-y-1 text-sm">
                      <li className="flex items-center">
                        <FaChartLine className="text-primary-500 mr-2" />
                        <span className="text-gray-600 dark:text-gray-400">
                          Diferencia de volumen: {recommendations.analysis.volumeDifference.toFixed(1)}%
                        </span>
                      </li>
                      <li className="flex items-center">
                        <FaWeight className="text-primary-500 mr-2" />
                        <span className="text-gray-600 dark:text-gray-400">
                          Diferencia de intensidad: {recommendations.analysis.intensityDifference.toFixed(1)}%
                        </span>
                      </li>
                      <li className="flex items-center">
                        <FaCalendarAlt className="text-primary-500 mr-2" />
                        <span className="text-gray-600 dark:text-gray-400">
                          Diferencia de frecuencia: {recommendations.analysis.frequencyDifference} días/semana
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
            
            {/* Opciones de transición */}
            {targetPlanId && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Nombre del plan de transición
                    </label>
                    <input
                      type="text"
                      value={transitionName}
                      onChange={(e) => setTransitionName(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Duración (semanas)
                    </label>
                    <select
                      value={duration}
                      onChange={(e) => setDuration(parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                    >
                      <option value={1}>1 semana</option>
                      <option value={2}>2 semanas</option>
                      <option value={3}>3 semanas</option>
                      <option value={4}>4 semanas</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Descripción
                  </label>
                  <textarea
                    value={transitionDescription}
                    onChange={(e) => setTransitionDescription(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                    rows={2}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Intensidad
                    </label>
                    <select
                      value={intensity}
                      onChange={(e) => setIntensity(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                    >
                      <option value="light">Ligera</option>
                      <option value="moderate">Moderada</option>
                      <option value="progressive">Progresiva</option>
                    </select>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="maintainExercises"
                      checked={maintainExercises}
                      onChange={(e) => setMaintainExercises(e.target.checked)}
                      className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                    />
                    <label htmlFor="maintainExercises" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                      Mantener ejercicios comunes
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="deloadWeek"
                      checked={deloadWeek}
                      onChange={(e) => setDeloadWeek(e.target.checked)}
                      className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                    />
                    <label htmlFor="deloadWeek" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                      Incluir semana de descarga
                    </label>
                  </div>
                </div>
              </div>
            )}
            
            {/* Botones de acción */}
            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => onClose()}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreateTransition}
                disabled={!targetPlanId || loading}
                className={`px-4 py-2 rounded-lg flex items-center ${
                  !targetPlanId || loading
                    ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                    : 'bg-primary-600 text-white hover:bg-primary-700'
                } transition-colors`}
              >
                <FaExchangeAlt className="mr-2" />
                {loading ? 'Creando...' : 'Crear Plan de Transición'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanTransitionDialog;
