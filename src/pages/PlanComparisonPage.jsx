import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaChartLine, FaExchangeAlt, FaCheck, FaDumbbell, FaChartBar, FaChartPie, FaInfoCircle, FaPercentage, FaBalanceScale } from 'react-icons/fa';
import { useTraining } from '../context/TrainingContext';
import PlanComparisonChart from '../components/PlanComparisonChart';
import ExerciseComparisonRadar from '../components/ExerciseComparisonRadar';
import MuscleGroupComparison from '../components/MuscleGroupComparison';
import MuscleGroupDistribution from '../components/MuscleGroupDistribution';
import statisticsService from '../services/statisticsService';
import planComparisonService from '../services/planComparisonService';

/**
 * Página para comparar planes de entrenamiento
 */
const PlanComparisonPage = () => {
  const { planId } = useParams();
  const navigate = useNavigate();
  const { trainingPlans, workoutLogs } = useTraining();

  const [basePlan, setBasePlan] = useState(null);
  const [comparePlan, setComparePlan] = useState(null);
  const [availablePlans, setAvailablePlans] = useState([]);
  const [baseStats, setBaseStats] = useState(null);
  const [compareStats, setCompareStats] = useState(null);

  // Estado para las estadísticas avanzadas
  const [advancedComparison, setAdvancedComparison] = useState(null);

  // Estado para controlar la vista
  const [viewMode, setViewMode] = useState('basic'); // 'basic' o 'advanced'

  // Cargar el plan base y los planes disponibles para comparar
  useEffect(() => {
    if (trainingPlans && planId) {
      // Buscar el plan base
      const foundPlan = trainingPlans.find(p => p.id === planId);
      if (foundPlan) {
        setBasePlan(foundPlan);

        // Obtener planes disponibles para comparar (excluyendo el plan base)
        const otherPlans = trainingPlans.filter(p => p.id !== planId);
        setAvailablePlans(otherPlans);

        // Calcular estadísticas del plan base
        calculatePlanStats(foundPlan, setBaseStats);
      }
    }
  }, [trainingPlans, planId, workoutLogs]);

  // Calcular estadísticas cuando se selecciona un plan para comparar
  useEffect(() => {
    if (comparePlan) {
      calculatePlanStats(comparePlan, setCompareStats);

      // Calcular estadísticas avanzadas de comparación
      if (basePlan) {
        // Filtrar logs relevantes para cada plan
        const baseSessionIds = basePlan.microcycles.flatMap(
          microcycle => microcycle.trainingSessions.map(session => session.id)
        );
        const compareSessionIds = comparePlan.microcycles.flatMap(
          microcycle => microcycle.trainingSessions.map(session => session.id)
        );

        const baseFilteredLogs = workoutLogs.logs.filter(
          log => baseSessionIds.includes(log.sessionId)
        );
        const compareFilteredLogs = workoutLogs.logs.filter(
          log => compareSessionIds.includes(log.sessionId)
        );

        // Calcular la comparación avanzada
        try {
          const comparison = planComparisonService.comparePlans(
            basePlan.id,
            comparePlan.id,
            {
              includeStructure: true,
              includeExercises: true,
              includeVolume: true,
              includeIntensity: true,
              includeProgression: true
            }
          );

          setAdvancedComparison(comparison);
        } catch (error) {
          console.error('Error al comparar planes:', error);
          setAdvancedComparison(null);
        }
      }
    } else {
      setAdvancedComparison(null);
    }
  }, [comparePlan, basePlan, workoutLogs]);

  // Calcular estadísticas de un plan
  const calculatePlanStats = (plan, setStats) => {
    if (!plan || !workoutLogs || !workoutLogs.logs) {
      return;
    }

    // Usar el servicio de estadísticas para calcular las estadísticas del plan
    const calculatedStats = statisticsService.calculatePlanStats(plan, workoutLogs);

    if (calculatedStats) {
      setStats(calculatedStats);
    }
  };

  // Manejar la selección de un plan para comparar
  const handleSelectComparePlan = (e) => {
    const selectedPlanId = e.target.value;
    if (selectedPlanId === 'none') {
      setComparePlan(null);
      setCompareStats(null);
    } else {
      const selectedPlan = trainingPlans.find(p => p.id === selectedPlanId);
      if (selectedPlan) {
        setComparePlan(selectedPlan);
      }
    }
  };

  // Formatear tiempo en horas:minutos:segundos
  const formatTime = (seconds) => {
    if (!seconds) return '0:00';

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    } else {
      return `${minutes}:${secs.toString().padStart(2, '0')}`;
    }
  };

  // Calcular la diferencia porcentual entre dos valores
  const calculateDifference = (value1, value2) => {
    if (!value1 || !value2) return 0;
    return ((value2 - value1) / value1) * 100;
  };

  // Renderizar la diferencia con color y signo
  const renderDifference = (diff) => {
    if (Math.abs(diff) < 0.5) {
      return <span className="text-gray-500 dark:text-gray-400">Sin cambios</span>;
    }

    const formattedDiff = diff.toFixed(1);

    if (diff > 0) {
      return <span className="text-green-600 dark:text-green-400">+{formattedDiff}%</span>;
    } else {
      return <span className="text-red-600 dark:text-red-400">{formattedDiff}%</span>;
    }
  };

  // Si no se encuentra el plan base, mostrar mensaje de error
  if (!basePlan) {
    return (
      <div className="container mx-auto px-4 py-8 pt-16 pb-24 max-w-lg">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <FaArrowLeft className="text-gray-600 dark:text-gray-300" />
          </button>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Comparar Planes</h1>
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
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Comparar Planes</h1>
        <div className="w-8"></div>
      </div>

      {/* Selector de plan para comparar */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden mb-6">
        <div className="p-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
          <h2 className="font-medium text-gray-800 dark:text-white flex items-center">
            <FaExchangeAlt className="text-primary-500 mr-2" />
            Seleccionar Plan para Comparar
          </h2>
        </div>

        <div className="p-4">
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Plan Base</h3>
            <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
              <p className="font-medium text-gray-800 dark:text-white">{basePlan.name}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{basePlan.description}</p>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Plan para Comparar</h3>
            {availablePlans.length > 0 ? (
              <select
                value={comparePlan ? comparePlan.id : 'none'}
                onChange={handleSelectComparePlan}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
              >
                <option value="none">Seleccionar un plan...</option>
                {availablePlans.map(plan => (
                  <option key={plan.id} value={plan.id}>{plan.name}</option>
                ))}
              </select>
            ) : (
              <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg text-center">
                <p className="text-gray-600 dark:text-gray-400">No hay otros planes disponibles para comparar.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Comparación de estadísticas */}
      {baseStats && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden mb-6">
          <div className="p-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
            <h2 className="font-medium text-gray-800 dark:text-white flex items-center">
              <FaChartLine className="text-primary-500 mr-2" />
              Comparación de Estadísticas
            </h2>
          </div>

          <div className="p-4">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-2 px-3 text-sm font-medium text-gray-500 dark:text-gray-400">Métrica</th>
                    <th className="text-center py-2 px-3 text-sm font-medium text-gray-500 dark:text-gray-400">{basePlan.name}</th>
                    {compareStats && (
                      <>
                        <th className="text-center py-2 px-3 text-sm font-medium text-gray-500 dark:text-gray-400">{comparePlan.name}</th>
                        <th className="text-center py-2 px-3 text-sm font-medium text-gray-500 dark:text-gray-400">Diferencia</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <td className="py-3 px-3 text-sm text-gray-700 dark:text-gray-300">Entrenamientos</td>
                    <td className="py-3 px-3 text-sm text-center font-medium text-gray-800 dark:text-white">{baseStats.totalWorkouts}</td>
                    {compareStats && (
                      <>
                        <td className="py-3 px-3 text-sm text-center font-medium text-gray-800 dark:text-white">{compareStats.totalWorkouts}</td>
                        <td className="py-3 px-3 text-sm text-center">
                          {renderDifference(calculateDifference(baseStats.totalWorkouts, compareStats.totalWorkouts))}
                        </td>
                      </>
                    )}
                  </tr>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <td className="py-3 px-3 text-sm text-gray-700 dark:text-gray-300">Volumen total (kg)</td>
                    <td className="py-3 px-3 text-sm text-center font-medium text-gray-800 dark:text-white">{Math.round(baseStats.totalVolume).toLocaleString()}</td>
                    {compareStats && (
                      <>
                        <td className="py-3 px-3 text-sm text-center font-medium text-gray-800 dark:text-white">{Math.round(compareStats.totalVolume).toLocaleString()}</td>
                        <td className="py-3 px-3 text-sm text-center">
                          {renderDifference(calculateDifference(baseStats.totalVolume, compareStats.totalVolume))}
                        </td>
                      </>
                    )}
                  </tr>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <td className="py-3 px-3 text-sm text-gray-700 dark:text-gray-300">Volumen por entrenamiento (kg)</td>
                    <td className="py-3 px-3 text-sm text-center font-medium text-gray-800 dark:text-white">{Math.round(baseStats.avgVolumePerWorkout).toLocaleString()}</td>
                    {compareStats && (
                      <>
                        <td className="py-3 px-3 text-sm text-center font-medium text-gray-800 dark:text-white">{Math.round(compareStats.avgVolumePerWorkout).toLocaleString()}</td>
                        <td className="py-3 px-3 text-sm text-center">
                          {renderDifference(calculateDifference(baseStats.avgVolumePerWorkout, compareStats.avgVolumePerWorkout))}
                        </td>
                      </>
                    )}
                  </tr>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <td className="py-3 px-3 text-sm text-gray-700 dark:text-gray-300">Duración total</td>
                    <td className="py-3 px-3 text-sm text-center font-medium text-gray-800 dark:text-white">{formatTime(baseStats.totalDuration)}</td>
                    {compareStats && (
                      <>
                        <td className="py-3 px-3 text-sm text-center font-medium text-gray-800 dark:text-white">{formatTime(compareStats.totalDuration)}</td>
                        <td className="py-3 px-3 text-sm text-center">
                          {renderDifference(calculateDifference(baseStats.totalDuration, compareStats.totalDuration))}
                        </td>
                      </>
                    )}
                  </tr>
                  <tr>
                    <td className="py-3 px-3 text-sm text-gray-700 dark:text-gray-300">Duración promedio</td>
                    <td className="py-3 px-3 text-sm text-center font-medium text-gray-800 dark:text-white">{formatTime(Math.round(baseStats.avgWorkoutDuration))}</td>
                    {compareStats && (
                      <>
                        <td className="py-3 px-3 text-sm text-center font-medium text-gray-800 dark:text-white">{formatTime(Math.round(compareStats.avgWorkoutDuration))}</td>
                        <td className="py-3 px-3 text-sm text-center">
                          {renderDifference(calculateDifference(baseStats.avgWorkoutDuration, compareStats.avgWorkoutDuration))}
                        </td>
                      </>
                    )}
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Gráfico de comparación */}
            {compareStats && (
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
                  <FaChartBar className="text-primary-500 mr-2" />
                  Visualización Gráfica
                </h3>
                <PlanComparisonChart
                  baseStats={baseStats}
                  compareStats={compareStats}
                  basePlanName={basePlan.name}
                  comparePlanName={comparePlan.name}
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Comparación de grupos musculares */}
      {baseStats && compareStats && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden mb-6">
          <div className="p-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
            <h2 className="font-medium text-gray-800 dark:text-white flex items-center">
              <FaChartBar className="text-primary-500 mr-2" />
              Comparación por Grupo Muscular
            </h2>
          </div>

          <div className="p-4">
            <MuscleGroupComparison
              baseStats={baseStats}
              compareStats={compareStats}
              basePlanName={basePlan.name}
              comparePlanName={comparePlan.name}
            />

            {/* Estadísticas comparativas */}
            {baseStats.muscleGroupStats && compareStats.muscleGroupStats && (
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Distribución de Volumen</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2 text-center">{basePlan.name}</h4>
                    <MuscleGroupDistribution stats={baseStats} title="" />
                  </div>
                  <div>
                    <h4 className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2 text-center">{comparePlan.name}</h4>
                    <MuscleGroupDistribution stats={compareStats} title="" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Comparación de ejercicios comunes */}
      {baseStats && compareStats && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden mb-6">
          <div className="p-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
            <h2 className="font-medium text-gray-800 dark:text-white flex items-center">
              <FaDumbbell className="text-primary-500 mr-2" />
              Comparación de Ejercicios Comunes
            </h2>
          </div>

          <div className="p-4">
            {Object.keys(baseStats.exerciseStats).some(exercise => compareStats.exerciseStats[exercise]) ? (
              <>
                {/* Gráfico de radar para comparación de ejercicios */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
                    <FaChartPie className="text-primary-500 mr-2" />
                    Comparación de Pesos Máximos
                  </h3>
                  <ExerciseComparisonRadar
                    baseStats={baseStats}
                    compareStats={compareStats}
                    basePlanName={basePlan.name}
                    comparePlanName={comparePlan.name}
                  />
                </div>

                <div className="space-y-6">
                  {Object.keys(baseStats.exerciseStats)
                    .filter(exercise => compareStats.exerciseStats[exercise])
                    .map(exerciseName => {
                      const baseExercise = baseStats.exerciseStats[exerciseName];
                      const compareExercise = compareStats.exerciseStats[exerciseName];

                      // Calcular diferencia porcentual
                      const maxWeightDiff = calculateDifference(baseExercise.maxWeight, compareExercise.maxWeight);
                      const volumeDiff = calculateDifference(baseExercise.totalVolume, compareExercise.totalVolume);
                      const repsDiff = calculateDifference(baseExercise.totalReps, compareExercise.totalReps);

                      return (
                        <div key={exerciseName} className="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-0 last:pb-0">
                          <h3 className="font-bold text-gray-800 dark:text-white mb-3">{exerciseName}</h3>

                          <div className="overflow-x-auto">
                            <table className="w-full">
                              <thead>
                                <tr className="border-b border-gray-200 dark:border-gray-700">
                                  <th className="text-left py-2 px-3 text-xs font-medium text-gray-500 dark:text-gray-400">Métrica</th>
                                  <th className="text-center py-2 px-3 text-xs font-medium text-gray-500 dark:text-gray-400">{basePlan.name}</th>
                                  <th className="text-center py-2 px-3 text-xs font-medium text-gray-500 dark:text-gray-400">{comparePlan.name}</th>
                                  <th className="text-center py-2 px-3 text-xs font-medium text-gray-500 dark:text-gray-400">Diferencia</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr className="border-b border-gray-200 dark:border-gray-700">
                                  <td className="py-2 px-3 text-xs text-gray-700 dark:text-gray-300">Peso máximo (kg)</td>
                                  <td className="py-2 px-3 text-xs text-center font-medium text-gray-800 dark:text-white">{baseExercise.maxWeight}</td>
                                  <td className="py-2 px-3 text-xs text-center font-medium text-gray-800 dark:text-white">{compareExercise.maxWeight}</td>
                                  <td className="py-2 px-3 text-xs text-center">
                                    {renderDifference(maxWeightDiff)}
                                  </td>
                                </tr>
                                <tr className="border-b border-gray-200 dark:border-gray-700">
                                  <td className="py-2 px-3 text-xs text-gray-700 dark:text-gray-300">Volumen total (kg)</td>
                                  <td className="py-2 px-3 text-xs text-center font-medium text-gray-800 dark:text-white">{Math.round(baseExercise.totalVolume).toLocaleString()}</td>
                                  <td className="py-2 px-3 text-xs text-center font-medium text-gray-800 dark:text-white">{Math.round(compareExercise.totalVolume).toLocaleString()}</td>
                                  <td className="py-2 px-3 text-xs text-center">
                                    {renderDifference(volumeDiff)}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 px-3 text-xs text-gray-700 dark:text-gray-300">Repeticiones totales</td>
                                  <td className="py-2 px-3 text-xs text-center font-medium text-gray-800 dark:text-white">{baseExercise.totalReps}</td>
                                  <td className="py-2 px-3 text-xs text-center font-medium text-gray-800 dark:text-white">{compareExercise.totalReps}</td>
                                  <td className="py-2 px-3 text-xs text-center">
                                    {renderDifference(repsDiff)}
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </>
            ) : (
              <div className="text-center py-6">
                <p className="text-gray-600 dark:text-gray-400">No hay ejercicios comunes entre los planes seleccionados.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Comparación avanzada */}
      {advancedComparison && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden mb-6">
          <div className="p-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
            <h2 className="font-medium text-gray-800 dark:text-white flex items-center">
              <FaBalanceScale className="text-primary-500 mr-2" />
              Análisis Avanzado de Comparación
            </h2>
          </div>

          <div className="p-4">
            {/* Resumen de similitud */}
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-6">
              <div className="flex items-start">
                <FaInfoCircle className="text-blue-500 dark:text-blue-400 mt-1 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-blue-800 dark:text-blue-300 mb-1">Puntuación de Similitud</h3>
                  <div className="flex items-center mb-2">
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 mr-3">
                      <div
                        className="bg-primary-500 h-4 rounded-full flex items-center justify-center text-xs text-white font-medium"
                        style={{ width: `${advancedComparison.summary.similarityScore}%` }}
                      >
                        {advancedComparison.summary.similarityScore}%
                      </div>
                    </div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 w-12">
                      {advancedComparison.summary.similarityScore}%
                    </span>
                  </div>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    {advancedComparison.summary.similarityScore >= 80 ?
                      'Los planes son muy similares en estructura y enfoque.' :
                      advancedComparison.summary.similarityScore >= 60 ?
                      'Los planes tienen bastantes similitudes pero con diferencias notables.' :
                      advancedComparison.summary.similarityScore >= 40 ?
                      'Los planes tienen algunas similitudes pero son mayormente diferentes.' :
                      'Los planes son fundamentalmente diferentes en estructura y enfoque.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Resumen de comparación */}
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
              <FaPercentage className="text-primary-500 mr-2" />
              Diferencias Principales
            </h3>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                <h4 className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Duración</h4>
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-sm font-medium text-gray-800 dark:text-white">
                      {advancedComparison.summary.durationComparison.planA} vs {advancedComparison.summary.durationComparison.planB} semanas
                    </span>
                  </div>
                  <span className={`text-sm font-medium ${advancedComparison.summary.durationComparison.percentDifference > 0 ? 'text-green-600 dark:text-green-400' : advancedComparison.summary.durationComparison.percentDifference < 0 ? 'text-red-600 dark:text-red-400' : 'text-gray-600 dark:text-gray-400'}`}>
                    {advancedComparison.summary.durationComparison.percentDifference > 0 ? '+' : ''}
                    {advancedComparison.summary.durationComparison.percentDifference.toFixed(1)}%
                  </span>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                <h4 className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Volumen Total</h4>
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-sm font-medium text-gray-800 dark:text-white">
                      {Math.round(advancedComparison.summary.volumeComparison.planA).toLocaleString()} vs {Math.round(advancedComparison.summary.volumeComparison.planB).toLocaleString()} kg
                    </span>
                  </div>
                  <span className={`text-sm font-medium ${advancedComparison.summary.volumeComparison.percentDifference > 0 ? 'text-green-600 dark:text-green-400' : advancedComparison.summary.volumeComparison.percentDifference < 0 ? 'text-red-600 dark:text-red-400' : 'text-gray-600 dark:text-gray-400'}`}>
                    {advancedComparison.summary.volumeComparison.percentDifference > 0 ? '+' : ''}
                    {advancedComparison.summary.volumeComparison.percentDifference.toFixed(1)}%
                  </span>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                <h4 className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Intensidad Promedio</h4>
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-sm font-medium text-gray-800 dark:text-white">
                      {advancedComparison.summary.intensityComparison.planA.toFixed(1)} vs {advancedComparison.summary.intensityComparison.planB.toFixed(1)}
                    </span>
                  </div>
                  <span className={`text-sm font-medium ${advancedComparison.summary.intensityComparison.percentDifference > 0 ? 'text-green-600 dark:text-green-400' : advancedComparison.summary.intensityComparison.percentDifference < 0 ? 'text-red-600 dark:text-red-400' : 'text-gray-600 dark:text-gray-400'}`}>
                    {advancedComparison.summary.intensityComparison.percentDifference > 0 ? '+' : ''}
                    {advancedComparison.summary.intensityComparison.percentDifference.toFixed(1)}%
                  </span>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                <h4 className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Frecuencia Semanal</h4>
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-sm font-medium text-gray-800 dark:text-white">
                      {advancedComparison.summary.frequencyComparison.planA.toFixed(1)} vs {advancedComparison.summary.frequencyComparison.planB.toFixed(1)} sesiones/semana
                    </span>
                  </div>
                  <span className={`text-sm font-medium ${advancedComparison.summary.frequencyComparison.percentDifference > 0 ? 'text-green-600 dark:text-green-400' : advancedComparison.summary.frequencyComparison.percentDifference < 0 ? 'text-red-600 dark:text-red-400' : 'text-gray-600 dark:text-gray-400'}`}>
                    {advancedComparison.summary.frequencyComparison.percentDifference > 0 ? '+' : ''}
                    {advancedComparison.summary.frequencyComparison.percentDifference.toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>

            {/* Comparación de ejercicios */}
            {advancedComparison.exercises && (
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
                  <FaDumbbell className="text-primary-500 mr-2" />
                  Comparación de Ejercicios
                </h3>

                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary-600 dark:text-primary-400 mb-1">
                        {advancedComparison.exercises.common.count}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Ejercicios comunes</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-amber-600 dark:text-amber-400 mb-1">
                        {advancedComparison.exercises.uniqueToA.count}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Solo en {basePlan.name}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                        {advancedComparison.exercises.uniqueToB.count}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Solo en {comparePlan.name}</div>
                    </div>
                  </div>

                  <div className="text-center">
                    <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5 mb-2">
                      <div className="bg-primary-500 h-2.5 rounded-full" style={{ width: `${advancedComparison.exercises.common.percentage}%` }}></div>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {advancedComparison.exercises.common.percentage.toFixed(1)}% de similitud en ejercicios
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mensaje si no hay datos */}
      {!baseStats && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 text-center">
          <FaChartLine className="text-primary-500 text-4xl mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">No hay datos disponibles</h2>
          <p className="text-gray-600 dark:text-gray-400">
            No hay registros de entrenamiento para el plan seleccionado. Completa algunas sesiones para ver estadísticas.
          </p>
        </div>
      )}
    </div>
  );
};

export default PlanComparisonPage;
