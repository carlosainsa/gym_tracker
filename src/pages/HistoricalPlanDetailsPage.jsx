import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaArrowLeft, FaArchive, FaCalendarAlt, FaDumbbell, FaChartLine, FaUndo, FaFileExport, FaChevronDown, FaChevronUp, FaCheck, FaTrophy } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useTrainingContext } from '../contexts/TrainingContext';
import planService from '../services/planService';
import historicalPlanService from '../services/historicalPlanService';

/**
 * Página para ver los detalles de un plan histórico
 */
const HistoricalPlanDetailsPage = () => {
  const { planId } = useParams();
  const { refreshPlans } = useTrainingContext();
  
  // Estados
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedMicrocycleId, setExpandedMicrocycleId] = useState(null);
  const [expandedSessionId, setExpandedSessionId] = useState(null);
  const [showConfirmRestore, setShowConfirmRestore] = useState(false);
  
  // Cargar el plan histórico
  useEffect(() => {
    if (planId) {
      loadHistoricalPlan();
    }
  }, [planId]);
  
  // Cargar el plan histórico
  const loadHistoricalPlan = async () => {
    setLoading(true);
    
    try {
      const plan = planService.getPlanById(planId);
      
      if (!plan) {
        toast.error('Plan no encontrado');
        return;
      }
      
      if (plan.status !== 'archived') {
        toast.error('Este plan no está archivado');
        return;
      }
      
      setPlan(plan);
    } catch (error) {
      console.error('Error al cargar plan histórico:', error);
      toast.error('Error al cargar plan histórico: ' + error.message);
    } finally {
      setLoading(false);
    }
  };
  
  // Restaurar el plan
  const handleRestorePlan = async () => {
    try {
      const restoredPlan = historicalPlanService.restorePlan(planId);
      
      toast.success(`Plan "${restoredPlan.name}" restaurado correctamente`);
      
      // Actualizar la lista de planes
      refreshPlans();
      
      // Actualizar el plan en la página
      setPlan(restoredPlan);
      
      // Cerrar el diálogo
      setShowConfirmRestore(false);
    } catch (error) {
      console.error('Error al restaurar plan:', error);
      toast.error('Error al restaurar plan: ' + error.message);
    }
  };
  
  // Exportar el plan
  const handleExportPlan = async () => {
    try {
      const exportedPlan = historicalPlanService.exportHistoricalPlan(planId);
      
      // Crear un blob con el contenido JSON
      const blob = new Blob([JSON.stringify(exportedPlan, null, 2)], { type: 'application/json' });
      
      // Crear un enlace para descargar el archivo
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `plan_historico_${exportedPlan.plan.name.replace(/\\s+/g, '_')}.json`;
      
      // Simular clic en el enlace para iniciar la descarga
      document.body.appendChild(a);
      a.click();
      
      // Limpiar
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 0);
      
      toast.success('Plan exportado correctamente');
    } catch (error) {
      console.error('Error al exportar plan:', error);
      toast.error('Error al exportar plan: ' + error.message);
    }
  };
  
  // Alternar la expansión de un microciclo
  const toggleMicrocycle = (microcycleId) => {
    if (expandedMicrocycleId === microcycleId) {
      setExpandedMicrocycleId(null);
      setExpandedSessionId(null);
    } else {
      setExpandedMicrocycleId(microcycleId);
      setExpandedSessionId(null);
    }
  };
  
  // Alternar la expansión de una sesión
  const toggleSession = (sessionId) => {
    if (expandedSessionId === sessionId) {
      setExpandedSessionId(null);
    } else {
      setExpandedSessionId(sessionId);
    }
  };
  
  // Formatear fecha
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };
  
  return (
    <div className="container mx-auto px-4 py-6">
      {/* Encabezado */}
      <div className="mb-6">
        <Link to="/plans/history" className="text-primary-600 hover:text-primary-700 flex items-center mb-4">
          <FaArrowLeft className="mr-2" />
          Volver a planes históricos
        </Link>
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center">
            <FaArchive className="mr-3 text-primary-500" />
            {loading ? 'Cargando plan...' : plan?.name}
          </h1>
          
          {plan && (
            <div className="flex items-center space-x-2 mt-4 md:mt-0">
              <Link
                to={`/plan/stats/${plan.id}`}
                className="flex items-center px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <FaChartLine className="mr-1.5" />
                Estadísticas
              </Link>
              
              <button
                onClick={() => setShowConfirmRestore(true)}
                className="flex items-center px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <FaUndo className="mr-1.5" />
                Restaurar
              </button>
              
              <button
                onClick={handleExportPlan}
                className="flex items-center px-3 py-1.5 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
              >
                <FaFileExport className="mr-1.5" />
                Exportar
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Contenido principal */}
      {loading ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 text-center">
          <p className="text-gray-500 dark:text-gray-400">Cargando plan histórico...</p>
        </div>
      ) : !plan ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 text-center">
          <p className="text-gray-500 dark:text-gray-400">Plan no encontrado</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Información general */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Información General</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h3 className="font-medium text-gray-800 dark:text-white mb-2 flex items-center">
                  <FaCalendarAlt className="mr-2 text-primary-500" />
                  Fechas
                </h3>
                <div className="space-y-1 text-sm">
                  <p className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Creado:</span>
                    <span className="text-gray-800 dark:text-white">{formatDate(plan.createdAt)}</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Archivado:</span>
                    <span className="text-gray-800 dark:text-white">{formatDate(plan.archivedAt)}</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Última actualización:</span>
                    <span className="text-gray-800 dark:text-white">{formatDate(plan.updatedAt)}</span>
                  </p>
                </div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h3 className="font-medium text-gray-800 dark:text-white mb-2 flex items-center">
                  <FaDumbbell className="mr-2 text-primary-500" />
                  Estructura
                </h3>
                <div className="space-y-1 text-sm">
                  <p className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Microciclos:</span>
                    <span className="text-gray-800 dark:text-white">{plan.microcycles?.length || 0}</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Sesiones:</span>
                    <span className="text-gray-800 dark:text-white">
                      {plan.microcycles?.reduce((total, micro) => total + micro.trainingSessions.length, 0) || 0}
                    </span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Ejercicios únicos:</span>
                    <span className="text-gray-800 dark:text-white">
                      {new Set(plan.microcycles?.flatMap(micro => 
                        micro.trainingSessions.flatMap(session => 
                          session.exercises.map(exercise => exercise.name)
                        )
                      )).size || 0}
                    </span>
                  </p>
                </div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h3 className="font-medium text-gray-800 dark:text-white mb-2">Razón de archivado</h3>
                <p className="text-gray-700 dark:text-gray-300 text-sm">
                  {plan.archiveReason || 'No especificada'}
                </p>
              </div>
            </div>
            
            {/* Descripción */}
            {plan.description && (
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <h3 className="font-medium text-gray-800 dark:text-white mb-2">Descripción</h3>
                <p className="text-gray-700 dark:text-gray-300 text-sm whitespace-pre-line">
                  {plan.description}
                </p>
              </div>
            )}
          </div>
          
          {/* Resumen y logros */}
          {plan.summary && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Resumen y Logros</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Estadísticas clave */}
                <div>
                  <h3 className="font-medium text-gray-800 dark:text-white mb-3">Estadísticas Clave</h3>
                  
                  <div className="space-y-3">
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-400">Duración total</span>
                        <span className="text-gray-800 dark:text-white font-medium">
                          {plan.summary.duration.weeks} semanas
                        </span>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-400">Sesiones completadas</span>
                        <span className="text-gray-800 dark:text-white font-medium">
                          {plan.summary.duration.completedSessions} / {plan.summary.duration.sessions}
                        </span>
                      </div>
                      <div className="mt-2 h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary-500" 
                          style={{ 
                            width: `${(plan.summary.duration.completedSessions / plan.summary.duration.sessions) * 100}%` 
                          }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-400">Volumen total</span>
                        <span className="text-gray-800 dark:text-white font-medium">
                          {Math.round(plan.summary.volume.total).toLocaleString()} kg
                        </span>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-400">Progresión de peso</span>
                        <span className="text-gray-800 dark:text-white font-medium">
                          {(plan.summary.progression.weightProgression * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Logros */}
                <div>
                  <h3 className="font-medium text-gray-800 dark:text-white mb-3 flex items-center">
                    <FaTrophy className="mr-2 text-amber-500" />
                    Logros Destacados
                  </h3>
                  
                  {plan.summary.achievements && plan.summary.achievements.length > 0 ? (
                    <div className="space-y-3">
                      {plan.summary.achievements.map((achievement, index) => (
                        <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                          <div className="flex items-start">
                            <div className="bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 p-2 rounded-full mr-3">
                              <FaCheck />
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-800 dark:text-white">{achievement.title}</h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400">{achievement.description}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-center">
                      <p className="text-gray-500 dark:text-gray-400">No hay logros registrados</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {/* Estructura del plan */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Estructura del Plan</h2>
            
            {plan.microcycles && plan.microcycles.length > 0 ? (
              <div className="space-y-4">
                {plan.microcycles.map(microcycle => (
                  <div key={microcycle.id} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                    <button
                      onClick={() => toggleMicrocycle(microcycle.id)}
                      className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-750 text-left"
                    >
                      <div>
                        <h3 className="font-medium text-gray-800 dark:text-white">
                          {microcycle.name || `Microciclo ${microcycle.weekNumber}`}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {microcycle.trainingSessions.length} sesiones
                        </p>
                      </div>
                      {expandedMicrocycleId === microcycle.id ? (
                        <FaChevronUp className="text-gray-500 dark:text-gray-400" />
                      ) : (
                        <FaChevronDown className="text-gray-500 dark:text-gray-400" />
                      )}
                    </button>
                    
                    {expandedMicrocycleId === microcycle.id && (
                      <div className="p-4 space-y-3">
                        {microcycle.trainingSessions.map(session => (
                          <div key={session.id} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                            <button
                              onClick={() => toggleSession(session.id)}
                              className="w-full flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-750 text-left"
                            >
                              <div>
                                <h4 className="font-medium text-gray-800 dark:text-white">
                                  {session.name || `Sesión ${session.day}`}
                                </h4>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  {session.exercises.length} ejercicios
                                </p>
                              </div>
                              {expandedSessionId === session.id ? (
                                <FaChevronUp className="text-gray-500 dark:text-gray-400" />
                              ) : (
                                <FaChevronDown className="text-gray-500 dark:text-gray-400" />
                              )}
                            </button>
                            
                            {expandedSessionId === session.id && (
                              <div className="p-3">
                                <table className="w-full text-sm">
                                  <thead>
                                    <tr className="text-left text-xs text-gray-500 dark:text-gray-400">
                                      <th className="pb-2">Ejercicio</th>
                                      <th className="pb-2">Series</th>
                                      <th className="pb-2">Repeticiones</th>
                                      <th className="pb-2">Peso (kg)</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {session.exercises.map(exercise => (
                                      <tr key={exercise.id} className="border-t border-gray-200 dark:border-gray-700">
                                        <td className="py-2 font-medium text-gray-800 dark:text-white">
                                          {exercise.name}
                                        </td>
                                        <td className="py-2 text-gray-700 dark:text-gray-300">
                                          {exercise.sets.length}
                                        </td>
                                        <td className="py-2 text-gray-700 dark:text-gray-300">
                                          {exercise.sets[0]?.repsMin && exercise.sets[0]?.repsMax
                                            ? `${exercise.sets[0].repsMin}-${exercise.sets[0].repsMax}`
                                            : exercise.sets[0]?.reps || '-'}
                                        </td>
                                        <td className="py-2 text-gray-700 dark:text-gray-300">
                                          {exercise.sets[0]?.weight || '-'}
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-gray-500 dark:text-gray-400">No hay microciclos en este plan</p>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Diálogo de confirmación para restaurar */}
      {showConfirmRestore && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Confirmar restauración</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              ¿Estás seguro de que deseas restaurar este plan? El plan se moverá a la lista de planes disponibles.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowConfirmRestore(false)}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleRestorePlan}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Restaurar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HistoricalPlanDetailsPage;
