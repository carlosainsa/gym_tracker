import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaChartLine, FaCalendarAlt, FaDumbbell, FaFilter, FaChevronDown, FaChevronUp, FaCheck, FaTimes } from 'react-icons/fa';
import { useTraining } from '../context/TrainingContext';
import { format, parseISO, isAfter, isBefore, subDays, subMonths } from 'date-fns';
import { es } from 'date-fns/locale';

/**
 * Página de progreso avanzada con gráficos y análisis detallado
 */
const AdvancedProgressPage = () => {
  const navigate = useNavigate();
  const { workoutLogs, trainingPlan } = useTraining();
  
  // Estado para filtros
  const [timeFilter, setTimeFilter] = useState('all');
  const [exerciseFilter, setExerciseFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  
  // Estado para datos procesados
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [exerciseOptions, setExerciseOptions] = useState([]);
  const [exerciseStats, setExerciseStats] = useState({});
  const [overallStats, setOverallStats] = useState({
    totalWorkouts: 0,
    totalExercises: 0,
    totalSets: 0,
    totalVolume: 0,
    averageWorkoutDuration: 0
  });
  
  // Procesar los registros de entrenamiento
  useEffect(() => {
    if (!workoutLogs || !workoutLogs.logs) return;
    
    // Extraer todos los ejercicios únicos
    const allExercises = new Set();
    workoutLogs.logs.forEach(log => {
      if (log.exercises) {
        log.exercises.forEach(exercise => {
          allExercises.add(exercise.name);
        });
      }
    });
    
    // Convertir a array y ordenar
    const exercisesList = Array.from(allExercises).sort();
    setExerciseOptions(['all', ...exercisesList]);
    
    // Filtrar los registros
    filterLogs();
  }, [workoutLogs, timeFilter, exerciseFilter]);
  
  // Filtrar los registros según los criterios seleccionados
  const filterLogs = () => {
    if (!workoutLogs || !workoutLogs.logs) {
      setFilteredLogs([]);
      return;
    }
    
    let filtered = [...workoutLogs.logs];
    
    // Filtrar por tiempo
    if (timeFilter !== 'all') {
      const today = new Date();
      let startDate;
      
      switch (timeFilter) {
        case 'week':
          startDate = subDays(today, 7);
          break;
        case 'month':
          startDate = subMonths(today, 1);
          break;
        case 'quarter':
          startDate = subMonths(today, 3);
          break;
        case 'year':
          startDate = subMonths(today, 12);
          break;
        default:
          startDate = null;
      }
      
      if (startDate) {
        filtered = filtered.filter(log => {
          const logDate = parseISO(log.date);
          return isAfter(logDate, startDate) && isBefore(logDate, today);
        });
      }
    }
    
    // Filtrar por ejercicio
    if (exerciseFilter !== 'all') {
      filtered = filtered.filter(log => {
        if (!log.exercises) return false;
        return log.exercises.some(exercise => exercise.name === exerciseFilter);
      });
    }
    
    // Ordenar por fecha (más reciente primero)
    filtered.sort((a, b) => {
      return new Date(b.date) - new Date(a.date);
    });
    
    setFilteredLogs(filtered);
    calculateStats(filtered);
  };
  
  // Calcular estadísticas
  const calculateStats = (logs) => {
    if (!logs || logs.length === 0) {
      setExerciseStats({});
      setOverallStats({
        totalWorkouts: 0,
        totalExercises: 0,
        totalSets: 0,
        totalVolume: 0,
        averageWorkoutDuration: 0
      });
      return;
    }
    
    // Estadísticas generales
    const totalWorkouts = logs.length;
    let totalExercises = 0;
    let totalSets = 0;
    let totalVolume = 0;
    let totalDuration = 0;
    
    // Estadísticas por ejercicio
    const exerciseData = {};
    
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
          if (!exerciseData[exerciseName]) {
            exerciseData[exerciseName] = {
              name: exerciseName,
              sets: [],
              maxWeight: 0,
              maxReps: 0,
              totalVolume: 0,
              progress: []
            };
          }
          
          // Procesar series
          if (exercise.sets) {
            totalSets += exercise.sets.length;
            
            exercise.sets.forEach(set => {
              if (set.actualReps && set.actualWeight) {
                const reps = parseInt(set.actualReps);
                const weight = parseFloat(set.actualWeight);
                
                if (!isNaN(reps) && !isNaN(weight)) {
                  // Calcular volumen (peso x repeticiones)
                  const volume = weight * reps;
                  totalVolume += volume;
                  exerciseData[exerciseName].totalVolume += volume;
                  
                  // Actualizar máximos
                  if (weight > exerciseData[exerciseName].maxWeight) {
                    exerciseData[exerciseName].maxWeight = weight;
                  }
                  
                  if (reps > exerciseData[exerciseName].maxReps) {
                    exerciseData[exerciseName].maxReps = reps;
                  }
                  
                  // Guardar datos de la serie
                  exerciseData[exerciseName].sets.push({
                    date: log.date,
                    reps,
                    weight,
                    volume
                  });
                }
              }
            });
          }
          
          // Añadir punto de progreso
          exerciseData[exerciseName].progress.push({
            date: log.date,
            maxWeight: exerciseData[exerciseName].maxWeight
          });
        });
      }
    });
    
    // Calcular promedio de duración
    const averageWorkoutDuration = totalWorkouts > 0 ? totalDuration / totalWorkouts : 0;
    
    // Actualizar estados
    setExerciseStats(exerciseData);
    setOverallStats({
      totalWorkouts,
      totalExercises,
      totalSets,
      totalVolume,
      averageWorkoutDuration
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
  
  // Formatear tiempo en minutos:segundos
  const formatTime = (seconds) => {
    if (!seconds) return '0:00';
    
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
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
  
  // Renderizar gráfico de línea simple
  const renderLineChart = (data, maxValue) => {
    if (!data || data.length === 0) return null;
    
    const points = data.map((item, index) => {
      const x = (index / (data.length - 1)) * 100;
      const y = 100 - (item.value / maxValue) * 100;
      return `${x},${y}`;
    }).join(' ');
    
    return (
      <div className="h-40 w-full relative">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <polyline
            points={points}
            fill="none"
            stroke="#4F46E5"
            strokeWidth="2"
          />
        </svg>
        
        {data.map((item, index) => {
          const x = (index / (data.length - 1)) * 100;
          const y = 100 - (item.value / maxValue) * 100;
          
          return (
            <div 
              key={index}
              className="absolute w-2 h-2 bg-primary-500 rounded-full transform -translate-x-1/2 -translate-y-1/2 hover:w-3 hover:h-3 transition-all group"
              style={{ left: `${x}%`, top: `${y}%` }}
            >
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity mb-1 whitespace-nowrap">
                {item.label}: {item.value}
              </div>
            </div>
          );
        })}
      </div>
    );
  };
  
  // Preparar datos para el gráfico de progreso de peso
  const prepareWeightProgressData = (exerciseName) => {
    if (!exerciseStats[exerciseName] || !exerciseStats[exerciseName].progress) {
      return [];
    }
    
    // Ordenar por fecha
    const sortedProgress = [...exerciseStats[exerciseName].progress].sort((a, b) => {
      return new Date(a.date) - new Date(b.date);
    });
    
    // Convertir a formato para el gráfico
    return sortedProgress.map(item => ({
      label: formatDate(item.date),
      value: item.maxWeight
    }));
  };
  
  // Preparar datos para el gráfico de volumen por ejercicio
  const prepareVolumeByExerciseData = () => {
    const data = Object.values(exerciseStats)
      .map(exercise => ({
        label: exercise.name,
        value: Math.round(exercise.totalVolume)
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5); // Mostrar solo los 5 principales
    
    return data;
  };
  
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
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Progreso Avanzado</h1>
        <div className="w-8"></div>
      </div>

      {/* Filtros */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden mb-6">
        <div 
          className="p-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600 flex items-center justify-between cursor-pointer"
          onClick={() => setShowFilters(!showFilters)}
        >
          <div className="flex items-center">
            <FaFilter className="text-primary-500 mr-2" />
            <h2 className="font-medium text-gray-800 dark:text-white">Filtros</h2>
          </div>
          {showFilters ? <FaChevronUp className="text-gray-400" /> : <FaChevronDown className="text-gray-400" />}
        </div>
        
        {showFilters && (
          <div className="p-4">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Período de tiempo
              </label>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                <button
                  onClick={() => setTimeFilter('week')}
                  className={`py-2 px-3 rounded-lg text-sm font-medium ${
                    timeFilter === 'week'
                      ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 border border-primary-300 dark:border-primary-700'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  Última semana
                </button>
                <button
                  onClick={() => setTimeFilter('month')}
                  className={`py-2 px-3 rounded-lg text-sm font-medium ${
                    timeFilter === 'month'
                      ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 border border-primary-300 dark:border-primary-700'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  Último mes
                </button>
                <button
                  onClick={() => setTimeFilter('quarter')}
                  className={`py-2 px-3 rounded-lg text-sm font-medium ${
                    timeFilter === 'quarter'
                      ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 border border-primary-300 dark:border-primary-700'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  Último trimestre
                </button>
                <button
                  onClick={() => setTimeFilter('all')}
                  className={`py-2 px-3 rounded-lg text-sm font-medium ${
                    timeFilter === 'all'
                      ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 border border-primary-300 dark:border-primary-700'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  Todo
                </button>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Ejercicio
              </label>
              <select
                value={exerciseFilter}
                onChange={(e) => setExerciseFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
              >
                <option value="all">Todos los ejercicios</option>
                {exerciseOptions.filter(ex => ex !== 'all').map((exercise, index) => (
                  <option key={index} value={exercise}>
                    {exercise}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Estadísticas generales */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden mb-6">
        <div className="p-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
          <h2 className="font-medium text-gray-800 dark:text-white flex items-center">
            <FaChartLine className="text-primary-500 mr-2" />
            Estadísticas generales
          </h2>
        </div>
        
        <div className="p-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
              <div className="text-sm text-gray-500 dark:text-gray-400">Entrenamientos</div>
              <div className="text-2xl font-bold text-gray-800 dark:text-white">{overallStats.totalWorkouts}</div>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
              <div className="text-sm text-gray-500 dark:text-gray-400">Ejercicios</div>
              <div className="text-2xl font-bold text-gray-800 dark:text-white">{overallStats.totalExercises}</div>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
              <div className="text-sm text-gray-500 dark:text-gray-400">Series</div>
              <div className="text-2xl font-bold text-gray-800 dark:text-white">{overallStats.totalSets}</div>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
              <div className="text-sm text-gray-500 dark:text-gray-400">Duración promedio</div>
              <div className="text-2xl font-bold text-gray-800 dark:text-white">
                {formatTime(Math.round(overallStats.averageWorkoutDuration))}
              </div>
            </div>
          </div>
          
          <div className="mt-4 bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
            <div className="text-sm text-gray-500 dark:text-gray-400">Volumen total (kg)</div>
            <div className="text-2xl font-bold text-gray-800 dark:text-white">
              {Math.round(overallStats.totalVolume).toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* Gráficos */}
      {Object.keys(exerciseStats).length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden mb-6">
          <div className="p-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
            <h2 className="font-medium text-gray-800 dark:text-white flex items-center">
              <FaChartLine className="text-primary-500 mr-2" />
              Análisis de progreso
            </h2>
          </div>
          
          <div className="p-4">
            {exerciseFilter !== 'all' ? (
              <div>
                <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-2">
                  {exerciseFilter}
                </h3>
                
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Progreso de peso máximo
                  </h4>
                  {exerciseStats[exerciseFilter] && (
                    <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                      {renderLineChart(
                        prepareWeightProgressData(exerciseFilter),
                        exerciseStats[exerciseFilter]?.maxWeight * 1.2 || 100
                      )}
                    </div>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                    <div className="text-sm text-gray-500 dark:text-gray-400">Peso máximo</div>
                    <div className="text-2xl font-bold text-gray-800 dark:text-white">
                      {exerciseStats[exerciseFilter]?.maxWeight || 0} kg
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                    <div className="text-sm text-gray-500 dark:text-gray-400">Repeticiones máximas</div>
                    <div className="text-2xl font-bold text-gray-800 dark:text-white">
                      {exerciseStats[exerciseFilter]?.maxReps || 0}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Volumen por ejercicio (Top 5)
                  </h4>
                  <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                    {renderBarChart(
                      prepareVolumeByExerciseData(),
                      Math.max(...prepareVolumeByExerciseData().map(item => item.value)) * 1.2
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Historial de entrenamientos */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden mb-6">
        <div className="p-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
          <h2 className="font-medium text-gray-800 dark:text-white flex items-center">
            <FaCalendarAlt className="text-primary-500 mr-2" />
            Historial de entrenamientos
          </h2>
        </div>
        
        <div className="p-4">
          {filteredLogs.length > 0 ? (
            <div className="space-y-4">
              {filteredLogs.map((log, index) => (
                <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                  <div className="p-3 bg-gray-50 dark:bg-gray-700 flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-800 dark:text-white">{log.sessionName || 'Entrenamiento'}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                        <FaCalendarAlt className="mr-1" size={12} />
                        {formatDate(log.date)}
                        {log.duration && (
                          <>
                            <span className="mx-1">•</span>
                            <FaClock className="mr-1" size={12} />
                            {formatTime(log.duration)}
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center">
                      {log.isCompleted ? (
                        <span className="flex items-center text-green-500 text-sm">
                          <FaCheck className="mr-1" />
                          Completado
                        </span>
                      ) : (
                        <span className="flex items-center text-yellow-500 text-sm">
                          <FaTimes className="mr-1" />
                          Incompleto
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {log.exercises && (
                    <div className="p-3">
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                        <FaDumbbell className="mr-1" size={12} />
                        Ejercicios ({log.exercises.length})
                      </h4>
                      
                      <div className="space-y-2">
                        {log.exercises.map((exercise, exIndex) => (
                          <div 
                            key={exIndex}
                            className={`text-sm p-2 rounded-lg ${
                              exerciseFilter !== 'all' && exercise.name === exerciseFilter
                                ? 'bg-primary-50 dark:bg-primary-900/20 border border-primary-100 dark:border-primary-800'
                                : 'bg-gray-50 dark:bg-gray-700'
                            }`}
                          >
                            <div className="font-medium text-gray-800 dark:text-white">{exercise.name}</div>
                            
                            {exercise.sets && (
                              <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                {exercise.sets.map((set, setIndex) => (
                                  <span key={setIndex} className="mr-2">
                                    {set.actualReps && set.actualWeight
                                      ? `${set.actualReps} × ${set.actualWeight} kg`
                                      : set.actualTime
                                        ? `${set.actualTime} seg`
                                        : 'Incompleto'}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">No hay entrenamientos que coincidan con los filtros seleccionados.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdvancedProgressPage;
