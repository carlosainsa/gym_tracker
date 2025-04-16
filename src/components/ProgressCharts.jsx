import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { format, subDays } from 'date-fns';
import { es } from 'date-fns/locale';

// Registrar los componentes de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const ProgressCharts = ({ workoutLogs, exercises }) => {
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [timeRange, setTimeRange] = useState('month'); // 'week', 'month', 'year'
  const [chartData, setChartData] = useState(null);
  const [volumeData, setVolumeData] = useState(null);
  const [performanceData, setPerformanceData] = useState(null);
  const [stats, setStats] = useState({
    totalWorkouts: 0,
    totalVolume: 0,
    averagePerformance: 0,
    strongestExercise: '',
    weakestExercise: '',
    mostFrequentExercise: ''
  });

  // Función para obtener los datos de los últimos días según el rango seleccionado
  const getDateRange = () => {
    const today = new Date();
    let days = 30; // Por defecto, un mes

    if (timeRange === 'week') {
      days = 7;
    } else if (timeRange === 'year') {
      days = 365;
    }

    const dates = [];
    for (let i = days - 1; i >= 0; i--) {
      const date = subDays(today, i);
      dates.push(format(date, 'yyyy-MM-dd'));
    }

    return dates;
  };

  // Función para procesar los datos de los logs
  const processData = () => {
    if (!workoutLogs?.logs || workoutLogs.logs.length === 0 || !exercises) {
      return;
    }

    // Obtener estadísticas generales
    const totalWorkouts = workoutLogs.logs.filter(log => log.type !== 'workout-change').length;
    
    // Calcular volumen total y rendimiento promedio
    let totalVolume = 0;
    let totalPerformance = 0;
    let performanceCount = 0;
    
    // Mapear ejercicios por ID para acceso rápido
    const exercisesMap = {};
    exercises.forEach(exercise => {
      exercisesMap[exercise.id] = {
        ...exercise,
        totalVolume: 0,
        totalPerformance: 0,
        performanceCount: 0,
        frequency: 0
      };
    });
    
    // Procesar logs para obtener datos de volumen y rendimiento
    workoutLogs.logs.forEach(log => {
      if (log.type !== 'workout-change' && log.actualSets) {
        const exerciseId = log.exerciseId;
        if (exerciseId && exercisesMap[exerciseId]) {
          // Incrementar frecuencia
          exercisesMap[exerciseId].frequency += 1;
          
          // Calcular volumen (peso * reps) para cada set
          let exerciseVolume = 0;
          log.actualSets.forEach(set => {
            const reps = parseInt(set.reps) || 0;
            const weight = parseFloat(set.weight) || 0;
            const setVolume = reps * weight;
            exerciseVolume += setVolume;
            totalVolume += setVolume;
          });
          
          exercisesMap[exerciseId].totalVolume += exerciseVolume;
          
          // Añadir rendimiento si está disponible
          if (log.performance) {
            exercisesMap[exerciseId].totalPerformance += log.performance;
            exercisesMap[exerciseId].performanceCount += 1;
            totalPerformance += log.performance;
            performanceCount += 1;
          }
        }
      }
    });
    
    // Calcular promedios y encontrar ejercicios destacados
    let strongestExercise = '';
    let weakestExercise = '';
    let mostFrequentExercise = '';
    let maxPerformance = 0;
    let minPerformance = 100;
    let maxFrequency = 0;
    
    Object.keys(exercisesMap).forEach(id => {
      const exercise = exercisesMap[id];
      if (exercise.performanceCount > 0) {
        const avgPerformance = exercise.totalPerformance / exercise.performanceCount;
        
        if (avgPerformance > maxPerformance) {
          maxPerformance = avgPerformance;
          strongestExercise = exercise.name;
        }
        
        if (avgPerformance < minPerformance) {
          minPerformance = avgPerformance;
          weakestExercise = exercise.name;
        }
      }
      
      if (exercise.frequency > maxFrequency) {
        maxFrequency = exercise.frequency;
        mostFrequentExercise = exercise.name;
      }
    });
    
    // Actualizar estadísticas
    setStats({
      totalWorkouts,
      totalVolume: Math.round(totalVolume),
      averagePerformance: performanceCount > 0 ? Math.round(totalPerformance / performanceCount) : 0,
      strongestExercise,
      weakestExercise,
      mostFrequentExercise
    });
    
    // Preparar datos para gráficos si hay un ejercicio seleccionado
    if (selectedExercise) {
      prepareChartData(selectedExercise, exercisesMap, workoutLogs.logs);
    }
  };

  // Función para preparar datos para los gráficos
  const prepareChartData = (exerciseId, exercisesMap, logs) => {
    const dateRange = getDateRange();
    const exerciseLogs = logs.filter(log => 
      log.type !== 'workout-change' && log.exerciseId === exerciseId
    ).sort((a, b) => new Date(a.date) - new Date(b.date));
    
    // Datos para gráfico de peso máximo
    const weightData = {
      labels: [],
      datasets: [{
        label: 'Peso Máximo (kg)',
        data: [],
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        tension: 0.3
      }]
    };
    
    // Datos para gráfico de volumen
    const volumeChartData = {
      labels: [],
      datasets: [{
        label: 'Volumen Total (kg)',
        data: [],
        borderColor: 'rgb(54, 162, 235)',
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        tension: 0.3
      }]
    };
    
    // Datos para gráfico de rendimiento
    const performanceChartData = {
      labels: [],
      datasets: [{
        label: 'Rendimiento (%)',
        data: [],
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        tension: 0.3
      }]
    };
    
    // Procesar logs para obtener datos de los gráficos
    exerciseLogs.forEach(log => {
      if (log.actualSets && log.actualSets.length > 0) {
        const logDate = format(new Date(log.date), 'dd/MM/yyyy');
        
        // Encontrar el peso máximo
        let maxWeight = 0;
        let totalVolume = 0;
        
        log.actualSets.forEach(set => {
          const weight = parseFloat(set.weight) || 0;
          const reps = parseInt(set.reps) || 0;
          
          if (weight > maxWeight) {
            maxWeight = weight;
          }
          
          totalVolume += weight * reps;
        });
        
        // Añadir datos a los gráficos
        weightData.labels.push(logDate);
        weightData.datasets[0].data.push(maxWeight);
        
        volumeChartData.labels.push(logDate);
        volumeChartData.datasets[0].data.push(totalVolume);
        
        if (log.performance) {
          performanceChartData.labels.push(logDate);
          performanceChartData.datasets[0].data.push(log.performance);
        }
      }
    });
    
    setChartData(weightData);
    setVolumeData(volumeChartData);
    setPerformanceData(performanceChartData);
  };

  // Efecto para procesar datos cuando cambian los logs o el ejercicio seleccionado
  useEffect(() => {
    processData();
  }, [workoutLogs, exercises, selectedExercise, timeRange]);

  // Opciones comunes para los gráficos
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
    maintainAspectRatio: false,
  };

  return (
    <div className="space-y-6">
      {/* Tarjetas de estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Entrenamientos</h3>
          <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{stats.totalWorkouts}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Total de sesiones registradas</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Volumen Total</h3>
          <p className="text-3xl font-bold text-green-600 dark:text-green-400">{stats.totalVolume.toLocaleString()} kg</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Peso total levantado</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Rendimiento</h3>
          <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">{stats.averagePerformance}%</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Promedio de todos los ejercicios</p>
        </div>
      </div>
      
      {/* Tarjetas de ejercicios destacados */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Ejercicio más fuerte</h3>
          <p className="text-xl font-medium text-blue-600 dark:text-blue-400">{stats.strongestExercise || 'No disponible'}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Mejor rendimiento promedio</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Ejercicio más débil</h3>
          <p className="text-xl font-medium text-red-600 dark:text-red-400">{stats.weakestExercise || 'No disponible'}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Menor rendimiento promedio</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Ejercicio más frecuente</h3>
          <p className="text-xl font-medium text-green-600 dark:text-green-400">{stats.mostFrequentExercise || 'No disponible'}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Mayor número de sesiones</p>
        </div>
      </div>
      
      {/* Selector de ejercicio y rango de tiempo */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="w-full md:w-1/2">
            <label htmlFor="exercise" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Seleccionar ejercicio
            </label>
            <select
              id="exercise"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={selectedExercise || ''}
              onChange={(e) => setSelectedExercise(e.target.value)}
            >
              <option value="">Selecciona un ejercicio</option>
              {exercises && exercises.map(exercise => (
                <option key={exercise.id} value={exercise.id}>
                  {exercise.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="w-full md:w-1/2">
            <label htmlFor="timeRange" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Rango de tiempo
            </label>
            <div className="flex rounded-md shadow-sm">
              <button
                type="button"
                className={`px-4 py-2 text-sm font-medium rounded-l-md ${
                  timeRange === 'week'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
                onClick={() => setTimeRange('week')}
              >
                Semana
              </button>
              <button
                type="button"
                className={`px-4 py-2 text-sm font-medium ${
                  timeRange === 'month'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
                onClick={() => setTimeRange('month')}
              >
                Mes
              </button>
              <button
                type="button"
                className={`px-4 py-2 text-sm font-medium rounded-r-md ${
                  timeRange === 'year'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
                onClick={() => setTimeRange('year')}
              >
                Año
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Gráficos */}
      {selectedExercise ? (
        <div className="space-y-6">
          {/* Gráfico de peso máximo */}
          {chartData && chartData.labels.length > 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Progresión de Peso Máximo</h3>
              <div className="h-64">
                <Line data={chartData} options={chartOptions} />
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 text-center">
              <p className="text-gray-500 dark:text-gray-400">No hay datos suficientes para mostrar el gráfico de peso máximo.</p>
            </div>
          )}
          
          {/* Gráfico de volumen */}
          {volumeData && volumeData.labels.length > 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Volumen Total por Sesión</h3>
              <div className="h-64">
                <Bar data={volumeData} options={chartOptions} />
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 text-center">
              <p className="text-gray-500 dark:text-gray-400">No hay datos suficientes para mostrar el gráfico de volumen.</p>
            </div>
          )}
          
          {/* Gráfico de rendimiento */}
          {performanceData && performanceData.labels.length > 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Rendimiento por Sesión</h3>
              <div className="h-64">
                <Line data={performanceData} options={chartOptions} />
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 text-center">
              <p className="text-gray-500 dark:text-gray-400">No hay datos suficientes para mostrar el gráfico de rendimiento.</p>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 text-center">
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            Selecciona un ejercicio para ver gráficos detallados de tu progreso.
          </p>
        </div>
      )}
    </div>
  );
};

export default ProgressCharts;
