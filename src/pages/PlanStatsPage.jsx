import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaChartLine, FaCalendarAlt, FaDumbbell, FaWeight, FaStopwatch } from 'react-icons/fa';
import { useTraining } from '../context/TrainingContext';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

/**
 * Página para ver las estadísticas de un plan de entrenamiento
 */
const PlanStatsPage = () => {
  const { planId } = useParams();
  const navigate = useNavigate();
  const { trainingPlans, workoutLogs } = useTraining();
  
  const [plan, setPlan] = useState(null);
  const [planLogs, setPlanLogs] = useState([]);
  const [stats, setStats] = useState({
    totalWorkouts: 0,
    totalExercises: 0,
    totalSets: 0,
    totalVolume: 0,
    totalDuration: 0,
    exerciseStats: {}
  });
  
  // Cargar el plan y los registros asociados
  useEffect(() => {
    if (trainingPlans && planId && workoutLogs) {
      // Buscar el plan
      const foundPlan = trainingPlans.find(p => p.id === planId);
      if (foundPlan) {
        setPlan(foundPlan);
        
        // Obtener todas las sesiones del plan
        const sessionIds = foundPlan.microcycles.flatMap(
          microcycle => microcycle.trainingSessions.map(session => session.id)
        );
        
        // Filtrar los registros que pertenecen a este plan
        const filteredLogs = workoutLogs.logs.filter(
          log => sessionIds.includes(log.sessionId)
        );
        
        setPlanLogs(filteredLogs);
        calculateStats(filteredLogs);
      }
    }
  }, [trainingPlans, planId, workoutLogs]);
  
  // Calcular estadísticas
  const calculateStats = (logs) => {
    if (!logs || logs.length === 0) {
      return;
    }
    
    let totalWorkouts = logs.length;
    let totalExercises = 0;
    let totalSets = 0;
    let totalVolume = 0;
    let totalDuration = 0;
    let exerciseStats = {};
    
    logs.forEach(log => {
      // Sumar duración
      if (log.duration) {
        totalDuration += log.duration;
      }
      
      // Procesar ejercicios
      if (log.exercises) {
        totalExercises += log.exercises.length;
        
        log.exercises.forEach(exercise => {
          const exerciseName = exercise.name;
          
          // Inicializar datos del ejercicio si no existen
          if (!exerciseStats[exerciseName]) {
            exerciseStats[exerciseName] = {
              name: exerciseName,
              sets: 0,
              totalVolume: 0,
              maxWeight: 0,
              totalReps: 0,
              sessions: 0,
              progress: []
            };
          }
          
          // Incrementar contador de sesiones
          exerciseStats[exerciseName].sessions += 1;
          
          // Procesar series
          if (exercise.sets) {
            const exerciseSets = exercise.sets.length;
            totalSets += exerciseSets;
            exerciseStats[exerciseName].sets += exerciseSets;
            
            let sessionMaxWeight = 0;
            let sessionTotalReps = 0;
            let sessionVolume = 0;
            
            exercise.sets.forEach(set => {
              if (set.actualReps && set.actualWeight) {
                const reps = parseInt(set.actualReps);
                const weight = parseFloat(set.actualWeight);
                
                if (!isNaN(reps) && !isNaN(weight)) {
                  // Calcular volumen (peso x repeticiones)
                  const volume = weight * reps;
                  totalVolume += volume;
                  sessionVolume += volume;
                  exerciseStats[exerciseName].totalVolume += volume;
                  
                  // Actualizar máximos
                  if (weight > sessionMaxWeight) {
                    sessionMaxWeight = weight;
                  }
                  
                  if (weight > exerciseStats[exerciseName].maxWeight) {
                    exerciseStats[exerciseName].maxWeight = weight;
                  }
                  
                  // Sumar repeticiones
                  sessionTotalReps += reps;
                  exerciseStats[exerciseName].totalReps += reps;
                }
              }
            });
            
            // Añadir punto de progreso
            exerciseStats[exerciseName].progress.push({
              date: log.date,
              maxWeight: sessionMaxWeight,
              totalReps: sessionTotalReps,
              volume: sessionVolume
            });
          }
        });
      }
    });
    
    // Ordenar el progreso por fecha
    Object.keys(exerciseStats).forEach(key => {
      exerciseStats[key].progress.sort((a, b) => new Date(a.date) - new Date(b.date));
    });
    
    setStats({
      totalWorkouts,
      totalExercises,
      totalSets,
      totalVolume,
      totalDuration,
      exerciseStats
    });
  };
  
  // Formatear fecha
  const formatDate = (dateString) => {
    try {
      return format(parseISO(dateString), 'dd MMM yyyy', { locale: es });
    } catch (error) {
      return 'Fecha desconocida';
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
  
  // Renderizar gráfico de barras simple
  const renderBarChart = (data, maxValue) => {
    if (!data || data.length === 0) return null;
    
    return (
      <div className="h-24 flex items-end space-x-1">
        {data.map((item, index) => (
          <div 
            key={index} 
            className="flex-1 bg-primary-500 hover:bg-primary-600 transition-all rounded-t-sm relative group"
            style={{ height: `${(item.value / maxValue) * 100}%` }}
          >
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity mb-1 whitespace-nowrap">
              {item.label}: {item.value}
            </div>
          </div>
        ))}
      </div>
    );
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
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Estadísticas del Plan</h1>
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
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Estadísticas del Plan</h1>
        <div className="w-8"></div>
      </div>
      
      {/* Información general del plan */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden mb-6">
        <div className="p-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white">
          <h2 className="text-xl font-bold">{plan.name}</h2>
          <p className="text-white text-opacity-90 mt-1">{plan.description}</p>
        </div>
      </div>
      
      {/* Estadísticas generales */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden mb-6">
        <div className="p-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
          <h2 className="font-medium text-gray-800 dark:text-white flex items-center">
            <FaChartLine className="text-primary-500 mr-2" />
            Resumen de Progreso
          </h2>
        </div>
        
        <div className="p-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
              <div className="flex items-center mb-1">
                <FaCalendarAlt className="text-primary-500 mr-2" />
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Entrenamientos</p>
              </div>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">{stats.totalWorkouts}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Sesiones completadas</p>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
              <div className="flex items-center mb-1">
                <FaDumbbell className="text-primary-500 mr-2" />
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Ejercicios</p>
              </div>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">{stats.totalExercises}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Ejercicios realizados</p>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
              <div className="flex items-center mb-1">
                <FaWeight className="text-primary-500 mr-2" />
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Volumen</p>
              </div>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">{Math.round(stats.totalVolume).toLocaleString()} kg</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Peso total levantado</p>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
              <div className="flex items-center mb-1">
                <FaStopwatch className="text-primary-500 mr-2" />
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Tiempo</p>
              </div>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">{formatTime(stats.totalDuration)}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Tiempo total de entrenamiento</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Progreso por ejercicio */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden mb-6">
        <div className="p-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
          <h2 className="font-medium text-gray-800 dark:text-white flex items-center">
            <FaDumbbell className="text-primary-500 mr-2" />
            Progreso por Ejercicio
          </h2>
        </div>
        
        <div className="p-4">
          {Object.keys(stats.exerciseStats).length > 0 ? (
            <div className="space-y-6">
              {Object.values(stats.exerciseStats)
                .sort((a, b) => b.totalVolume - a.totalVolume)
                .map(exercise => {
                  // Preparar datos para el gráfico de progreso
                  const progressData = exercise.progress.map(point => ({
                    label: formatDate(point.date),
                    value: point.maxWeight
                  }));
                  
                  const maxValue = Math.max(...progressData.map(item => item.value)) * 1.2;
                  
                  return (
                    <div key={exercise.name} className="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-0 last:pb-0">
                      <h3 className="font-bold text-gray-800 dark:text-white mb-2">{exercise.name}</h3>
                      
                      <div className="grid grid-cols-3 gap-3 mb-4">
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Peso máximo</p>
                          <p className="text-lg font-bold text-gray-800 dark:text-white">{exercise.maxWeight} kg</p>
                        </div>
                        
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Volumen total</p>
                          <p className="text-lg font-bold text-gray-800 dark:text-white">{Math.round(exercise.totalVolume).toLocaleString()} kg</p>
                        </div>
                        
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Repeticiones</p>
                          <p className="text-lg font-bold text-gray-800 dark:text-white">{exercise.totalReps}</p>
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Progreso de peso máximo</p>
                        {renderBarChart(progressData, maxValue)}
                      </div>
                    </div>
                  );
                })}
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-gray-600 dark:text-gray-400">No hay datos de progreso disponibles para este plan.</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Completa algunas sesiones de entrenamiento para ver tu progreso.</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Historial de entrenamientos */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden mb-6">
        <div className="p-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
          <h2 className="font-medium text-gray-800 dark:text-white flex items-center">
            <FaCalendarAlt className="text-primary-500 mr-2" />
            Historial de Entrenamientos
          </h2>
        </div>
        
        <div className="p-4">
          {planLogs.length > 0 ? (
            <div className="space-y-4">
              {planLogs
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .map(log => (
                  <div key={log.id} className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium text-gray-800 dark:text-white">{log.sessionName}</h3>
                      <span className="text-sm text-gray-500 dark:text-gray-400">{formatDate(log.date)}</span>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <FaDumbbell className="mr-1" />
                      <span>{log.exercises ? log.exercises.length : 0} ejercicios</span>
                      <span className="mx-2">•</span>
                      <FaStopwatch className="mr-1" />
                      <span>{formatTime(log.duration)}</span>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-gray-600 dark:text-gray-400">No hay entrenamientos registrados para este plan.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlanStatsPage;
