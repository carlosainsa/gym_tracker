import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FaArrowLeft, FaCalendarAlt, FaDumbbell, FaChevronDown, FaChevronUp, FaEdit, FaChartLine, FaClipboardList, FaPlay, FaArchive, FaTrashAlt, FaExchangeAlt, FaFileImport, FaFileExport, FaRandom, FaCopy } from 'react-icons/fa';
import { useTraining } from '../context/TrainingContext';
import { toast } from 'react-toastify';
import ImportExportPlans from '../components/ImportExportPlans';
import PlanDuplicateDialog from '../components/PlanDuplicateDialog';
import PlanShareDialog from '../components/PlanShareDialog';
import PlanTransitionDialog from '../components/PlanTransitionDialog';
import PlanArchiveDialog from '../components/PlanArchiveDialog';
import RecommendedPlanComparisons from '../components/RecommendedPlanComparisons';
import planComparisonService from '../services/planComparisonService';

/**
 * Página para ver los detalles de un plan de entrenamiento
 */
const PlanDetailsPage = () => {
  const { planId } = useParams();
  const navigate = useNavigate();
  const { trainingPlans, activePlanId, activatePlan, archivePlan, deletePlan } = useTraining();

  const [plan, setPlan] = useState(null);
  const [expandedMicrocycleId, setExpandedMicrocycleId] = useState(null);
  const [expandedSessionId, setExpandedSessionId] = useState(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [showProgress, setShowProgress] = useState(false);
  const [showDuplicateDialog, setShowDuplicateDialog] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [showTransitionDialog, setShowTransitionDialog] = useState(false);
  const [showArchiveDialog, setShowArchiveDialog] = useState(false);
  const [recommendedPlans, setRecommendedPlans] = useState([]);

  // Cargar el plan
  useEffect(() => {
    if (trainingPlans && planId) {
      const foundPlan = trainingPlans.find(p => p.id === planId);
      if (foundPlan) {
        setPlan(foundPlan);

        // Expandir el primer microciclo por defecto
        if (foundPlan.microcycles && foundPlan.microcycles.length > 0) {
          setExpandedMicrocycleId(foundPlan.microcycles[0].id);
        }

        // Cargar planes recomendados para comparar
        try {
          const recommendations = planComparisonService.getRecommendedComparisons(planId, 3);
          setRecommendedPlans(recommendations);
        } catch (error) {
          console.error('Error al cargar planes recomendados:', error);
          setRecommendedPlans([]);
        }
      }
    }
  }, [trainingPlans, planId]);

  // Alternar la expansión de un microciclo
  const toggleMicrocycleExpansion = (microcycleId) => {
    setExpandedMicrocycleId(expandedMicrocycleId === microcycleId ? null : microcycleId);
    setExpandedSessionId(null);
  };

  // Alternar la expansión de una sesión
  const toggleSessionExpansion = (sessionId, e) => {
    e.stopPropagation();
    setExpandedSessionId(expandedSessionId === sessionId ? null : sessionId);
  };

  // Ir a la página de registro de entrenamiento
  const goToWorkoutLog = (sessionId) => {
    navigate(`/workout/advanced/${sessionId}`);
  };

  // Activar el plan
  const handleActivatePlan = () => {
    activatePlan(planId);
    navigate('/plans');
  };

  // Mostrar el diálogo de archivado de plan
  const handleArchivePlan = () => {
    setShowArchiveDialog(true);
  };

  // Eliminar el plan
  const handleDeletePlan = () => {
    deletePlan(planId);
    navigate('/plans');
  };

  // Editar el plan
  const handleEditPlan = () => {
    navigate(`/plan/edit/${planId}`);
  };

  // Ver estadísticas del plan
  const handleViewStats = () => {
    setShowProgress(!showProgress);
  };

  // Mostrar el diálogo de transición de planes
  const handleTransitionPlan = () => {
    setShowTransitionDialog(true);
  };

  // Mostrar el diálogo de duplicación de planes
  const handleDuplicatePlan = () => {
    setShowDuplicateDialog(true);
  };

  // Manejar el éxito de la duplicación
  const handleDuplicateSuccess = (newPlan) => {
    toast.success(`Plan "${newPlan.name}" duplicado correctamente`);
    // Navegar al nuevo plan
    navigate(`/plan/${newPlan.id}`);
  };

  // Mostrar el diálogo de compartición de planes
  const handleSharePlan = () => {
    setShowShareDialog(true);
  };

  // Formatear el día de la semana
  const formatWeekday = (day) => {
    const weekdays = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    return weekdays[day] || day;
  };

  // Si no se encuentra el plan, mostrar mensaje de error
  if (!plan) {
    return (
      <div className="container mx-auto px-4 py-8 pt-16 pb-24 max-w-lg">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <FaArrowLeft className="text-gray-600 dark:text-gray-300" />
          </button>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Detalles del Plan</h1>
          <div className="w-8"></div>
        </div>

        <div className="bg-yellow-50 dark:bg-yellow-900/30 p-6 rounded-xl border border-yellow-200 dark:border-yellow-800">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Plan no encontrado</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            No se ha encontrado el plan de entrenamiento solicitado.
          </p>
          <button
            onClick={() => navigate('/plans')}
            className="py-2 px-4 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors"
          >
            Volver a Planes
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 pt-16 pb-24 max-w-lg">
      {/* Encabezado */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <FaArrowLeft className="text-gray-600 dark:text-gray-300" />
        </button>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Detalles del Plan</h1>
        <div className="flex items-center space-x-2">
          {plan.id !== activePlanId ? (
            <button
              onClick={handleActivatePlan}
              className="p-2 rounded-full text-green-600 hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
              title="Activar Plan"
            >
              <FaPlay />
            </button>
          ) : (
            <span className="text-xs font-medium px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-full">
              Activo
            </span>
          )}
        </div>
      </div>

      {/* Información general del plan */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden mb-6">
        <div className="p-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white">
          <h2 className="text-xl font-bold">{plan.name}</h2>
          <p className="text-white text-opacity-90 mt-1">{plan.description}</p>
        </div>

        <div className="p-4">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Objetivo principal</h3>
              <p className="text-gray-800 dark:text-white font-medium">
                {plan.primaryGoal === 'hypertrophy' ? 'Hipertrofia' :
                 plan.primaryGoal === 'strength' ? 'Fuerza' :
                 plan.primaryGoal === 'fat_loss' ? 'Pérdida de grasa' :
                 plan.primaryGoal === 'endurance' ? 'Resistencia' : 'General'}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Objetivos secundarios</h3>
              <p className="text-gray-800 dark:text-white font-medium">
                {plan.secondaryGoals && plan.secondaryGoals.length > 0
                  ? plan.secondaryGoals.map(goal =>
                      goal === 'hypertrophy' ? 'Hipertrofia' :
                      goal === 'strength' ? 'Fuerza' :
                      goal === 'fat_loss' ? 'Pérdida de grasa' :
                      goal === 'endurance' ? 'Resistencia' : 'General'
                    ).join(', ')
                  : 'Ninguno'}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Duración</h3>
              <p className="text-gray-800 dark:text-white font-medium">{plan.planDuration} semanas</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Periodización</h3>
              <p className="text-gray-800 dark:text-white font-medium">
                {plan.periodizationType === 'linear' ? 'Lineal' :
                 plan.periodizationType === 'undulating' ? 'Ondulante' :
                 plan.periodizationType === 'block' ? 'Por bloques' : 'Personalizada'}
              </p>
            </div>
          </div>

          {/* Acciones del plan */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-2">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Acciones</h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={handleViewStats}
                className="flex items-center text-xs px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-800/50 transition-colors"
              >
                <FaChartLine className="mr-1.5" />
                {showProgress ? 'Ocultar Progreso' : 'Ver Progreso'}
              </button>

              <button
                onClick={handleEditPlan}
                className="flex items-center text-xs px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-800/50 transition-colors"
              >
                <FaEdit className="mr-1.5" />
                Editar Plan
              </button>

              <button
                onClick={handleTransitionPlan}
                className="flex items-center text-xs px-3 py-1.5 rounded-lg bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-800/50 transition-colors"
              >
                <FaRandom className="mr-1.5" />
                Crear Transición
              </button>

              <button
                onClick={handleDuplicatePlan}
                className="flex items-center text-xs px-3 py-1.5 rounded-lg bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 hover:bg-teal-100 dark:hover:bg-teal-800/50 transition-colors"
              >
                <FaCopy className="mr-1.5" />
                Duplicar Plan
              </button>

              <button
                onClick={handleSharePlan}
                className="flex items-center text-xs px-3 py-1.5 rounded-lg bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 hover:bg-orange-100 dark:hover:bg-orange-800/50 transition-colors"
              >
                <FaExchangeAlt className="mr-1.5" />
                Compartir Plan
              </button>

              {plan.id === activePlanId ? (
                <button
                  onClick={handleArchivePlan}
                  className="flex items-center text-xs px-3 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-800/50 transition-colors"
                >
                  <FaArchive className="mr-1.5" />
                  Archivar Plan
                </button>
              ) : (
                <button
                  onClick={handleActivatePlan}
                  className="flex items-center text-xs px-3 py-1.5 rounded-lg bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-800/50 transition-colors"
                >
                  <FaPlay className="mr-1.5" />
                  Activar Plan
                </button>
              )}

              <button
                onClick={() => setShowConfirmDelete(true)}
                className="flex items-center text-xs px-3 py-1.5 rounded-lg bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-800/50 transition-colors"
              >
                <FaTrashAlt className="mr-1.5" />
                Eliminar Plan
              </button>
            </div>

            <div className="mt-3">
              <ImportExportPlans planId={planId} buttonStyle="small" />
            </div>
          </div>
        </div>
      </div>

      {/* Progreso del plan */}
      {showProgress && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden mb-6">
          <div className="p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <h2 className="text-xl font-bold">Progreso del Plan</h2>
          </div>

          <div className="p-4">
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Progreso general</h3>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                <div
                  className="bg-blue-600 h-4 rounded-full"
                  style={{ width: `${plan.calculateProgress()}%` }}
                ></div>
              </div>
              <p className="text-right text-sm text-gray-500 dark:text-gray-400 mt-1">{plan.calculateProgress()}%</p>
            </div>

            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Sesiones completadas</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-3xl font-bold text-gray-800 dark:text-white">
                    {plan.getAllSessions().filter(session => session.completed).length}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Completadas</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-gray-800 dark:text-white">
                    {plan.getAllSessions().length}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Total</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Progreso por microciclo</h3>
              <div className="space-y-2">
                {plan.microcycles.map(microcycle => (
                  <div key={microcycle.id} className="flex items-center">
                    <div className="w-24 text-xs text-gray-600 dark:text-gray-400">Semana {microcycle.weekNumber}</div>
                    <div className="flex-1">
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${microcycle.calculateProgress()}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="w-10 text-right text-xs text-gray-600 dark:text-gray-400">
                      {microcycle.calculateProgress()}%
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Microciclos */}
      <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Estructura del Plan</h2>

      {plan.microcycles && plan.microcycles.length > 0 ? (
        plan.microcycles.map(microcycle => {
          const isExpanded = expandedMicrocycleId === microcycle.id;

          return (
            <div
              key={microcycle.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden mb-4"
            >
              <div
                className="p-4 cursor-pointer flex justify-between items-center"
                onClick={() => toggleMicrocycleExpansion(microcycle.id)}
              >
                <div>
                  <h3 className="font-bold text-gray-800 dark:text-white">{microcycle.name}</h3>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <FaCalendarAlt className="mr-1" />
                    <span>Semana {microcycle.weekNumber}</span>
                    <span className="mx-2">•</span>
                    <span>{microcycle.trainingSessions.length} sesiones</span>
                  </div>
                </div>

                {isExpanded ? <FaChevronUp className="text-gray-400" /> : <FaChevronDown className="text-gray-400" />}
              </div>

              {isExpanded && (
                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Configuración</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Distribución</p>
                        <p className="text-sm text-gray-800 dark:text-white">
                          {microcycle.splitConfiguration === 'fullbody' ? 'Cuerpo completo' :
                           microcycle.splitConfiguration === 'upper_lower' ? 'Superior/Inferior' :
                           microcycle.splitConfiguration === 'push_pull_legs' ? 'Empuje/Tracción/Piernas' :
                           'Personalizada'}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Frecuencia</p>
                        <p className="text-sm text-gray-800 dark:text-white">{microcycle.weeklyFrequency} días/semana</p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Intensidad</p>
                        <p className="text-sm text-gray-800 dark:text-white">
                          {microcycle.cycleIntensity === 'low' ? 'Baja' :
                           microcycle.cycleIntensity === 'medium' ? 'Media' :
                           microcycle.cycleIntensity === 'high' ? 'Alta' : 'Normal'}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Días de entrenamiento</p>
                        <p className="text-sm text-gray-800 dark:text-white">
                          {microcycle.trainingDays.map(day => formatWeekday(day)).join(', ')}
                        </p>
                      </div>
                    </div>
                  </div>

                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Sesiones de entrenamiento</h4>

                  {microcycle.trainingSessions.map(session => {
                    const isSessionExpanded = expandedSessionId === session.id;

                    return (
                      <div
                        key={session.id}
                        className="bg-gray-50 dark:bg-gray-700 rounded-lg mb-3 overflow-hidden"
                      >
                        <div
                          className="p-3 flex justify-between items-center cursor-pointer"
                          onClick={(e) => toggleSessionExpansion(session.id, e)}
                        >
                          <div>
                            <h5 className="font-medium text-gray-800 dark:text-white">{session.name}</h5>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{session.recommendedDay} • {session.exercises.length} ejercicios</p>
                          </div>

                          {isSessionExpanded ? <FaChevronUp className="text-gray-400" /> : <FaChevronDown className="text-gray-400" />}
                        </div>

                        {isSessionExpanded && (
                          <div className="p-3 border-t border-gray-200 dark:border-gray-600">
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{session.description}</p>

                            <div className="mb-3">
                              <h6 className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Ejercicios</h6>
                              <ul className="space-y-2">
                                {session.exercises.map(exercise => (
                                  <li key={exercise.id} className="text-sm text-gray-800 dark:text-white flex items-center">
                                    <FaDumbbell className="text-primary-500 mr-2 text-xs" />
                                    {exercise.name} ({exercise.sets.length} series)
                                  </li>
                                ))}
                              </ul>
                            </div>

                            <button
                              onClick={() => goToWorkoutLog(session.id)}
                              className="w-full py-2 px-4 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors"
                            >
                              Registrar entrenamiento
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 text-center">
          <p className="text-gray-600 dark:text-gray-400">Este plan no tiene microciclos definidos.</p>
        </div>
      )}

      {/* Diálogo de confirmación para eliminar */}
      {showConfirmDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Confirmar eliminación</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              ¿Estás seguro de que deseas eliminar el plan <span className="font-medium">{plan.name}</span>? Esta acción no se puede deshacer.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowConfirmDelete(false)}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeletePlan}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Diálogo de duplicación de plan */}
      {showDuplicateDialog && plan && (
        <PlanDuplicateDialog
          plan={plan}
          onClose={() => setShowDuplicateDialog(false)}
          onSuccess={handleDuplicateSuccess}
        />
      )}

      {/* Diálogo de compartición de plan */}
      {showShareDialog && plan && (
        <PlanShareDialog
          plan={plan}
          onClose={() => setShowShareDialog(false)}
        />
      )}

      {/* Diálogo de transición de plan */}
      {showTransitionDialog && plan && (
        <PlanTransitionDialog
          isOpen={showTransitionDialog}
          onClose={(transitionPlan) => {
            setShowTransitionDialog(false);
            if (transitionPlan) {
              toast.success(`Plan de transición "${transitionPlan.name}" creado correctamente`);
              // Navegar al nuevo plan
              navigate(`/plan/${transitionPlan.id}`);
            }
          }}
          sourcePlanId={planId}
        />
      )}

      {/* Diálogo de archivado de plan */}
      {showArchiveDialog && plan && (
        <PlanArchiveDialog
          isOpen={showArchiveDialog}
          onClose={(archivedPlan) => {
            setShowArchiveDialog(false);
            if (archivedPlan) {
              toast.success(`Plan "${archivedPlan.name}" archivado correctamente`);
              navigate('/plans');
            }
          }}
          plan={plan}
        />
      )}

      {/* Planes recomendados para comparar */}
      {recommendedPlans.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden mb-6">
          <div className="p-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
            <h2 className="font-medium text-gray-800 dark:text-white flex items-center">
              <FaExchangeAlt className="text-primary-500 mr-2" />
              Planes Recomendados para Comparar
            </h2>
          </div>

          <div className="p-4">
            <RecommendedPlanComparisons
              recommendations={recommendedPlans}
              basePlanName={plan.name}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default PlanDetailsPage;
