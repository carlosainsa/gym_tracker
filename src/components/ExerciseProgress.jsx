import { useState, useEffect, useRef } from 'react';
import { useWorkout } from '../context/WorkoutContext';
import { Chart, registerables } from 'chart.js';
import { FaDumbbell, FaChartLine, FaCalendarAlt, FaArrowUp, FaArrowDown, FaEquals, FaWeight, FaHistory } from 'react-icons/fa';

// Registrar los componentes necesarios de Chart.js
Chart.register(...registerables);

const ExerciseProgress = ({ exerciseId }) => {
  const { plan, getExerciseLogs } = useWorkout();
  const weightChartRef = useRef(null);
  const repsChartRef = useRef(null);
  const volumeChartRef = useRef(null);
  const weightChartInstance = useRef(null);
  const repsChartInstance = useRef(null);
  const volumeChartInstance = useRef(null);
  const [activeTab, setActiveTab] = useState('weight'); // 'weight', 'reps', 'volume'

  // Encontrar el ejercicio en el plan
  const findExercise = () => {
    for (const day of plan.days) {
      const exercise = day.exercises.find(ex => ex.id === exerciseId);
      if (exercise) return exercise;
    }
    return null;
  };

  const exercise = findExercise();
  const logs = getExerciseLogs(exerciseId);

  // Formatear fecha para mostrar
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  // Formatear hora para mostrar
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  // Calcular tendencia (comparando con el registro anterior)
  const calculateTrend = (current, previous) => {
    if (!previous) return 'equal';
    if (current > previous) return 'up';
    if (current < previous) return 'down';
    return 'equal';
  };

  useEffect(() => {
    if (!exercise || logs.length === 0) return;

    // Preparar los datos para los gráficos
    const dates = logs.map(log => {
      const date = new Date(log.date);
      return `${date.getDate()}/${date.getMonth() + 1}`;
    });

    // Calcular el peso promedio para cada registro
    const weights = logs.map(log => {
      const validSets = log.sets.filter(set => set.weight && !isNaN(parseFloat(set.weight)));
      if (validSets.length === 0) return 0;

      const totalWeight = validSets.reduce((sum, set) => sum + parseFloat(set.weight), 0);
      return totalWeight / validSets.length;
    });

    // Calcular las repeticiones promedio para cada registro
    const reps = logs.map(log => {
      const validSets = log.sets.filter(set => set.reps && !isNaN(parseFloat(set.reps)));
      if (validSets.length === 0) return 0;

      const totalReps = validSets.reduce((sum, set) => sum + parseFloat(set.reps), 0);
      return totalReps / validSets.length;
    });

    // Calcular el volumen total (peso x reps) para cada registro
    const volumes = logs.map(log => {
      let totalVolume = 0;
      log.sets.forEach(set => {
        const weight = parseFloat(set.weight);
        const reps = parseFloat(set.reps);
        if (!isNaN(weight) && !isNaN(reps)) {
          totalVolume += weight * reps;
        }
      });
      return totalVolume;
    });

    // Crear el gráfico de peso
    if (weightChartRef.current) {
      if (weightChartInstance.current) {
        weightChartInstance.current.destroy();
      }

      const ctx = weightChartRef.current.getContext('2d');
      weightChartInstance.current = new Chart(ctx, {
        type: 'line',
        data: {
          labels: dates,
          datasets: [{
            label: 'Peso promedio (kg)',
            data: weights,
            borderColor: 'rgb(14, 165, 233)',
            backgroundColor: 'rgba(14, 165, 233, 0.1)',
            tension: 0.3,
            fill: true,
            pointBackgroundColor: 'rgb(14, 165, 233)',
            pointRadius: 4,
            pointHoverRadius: 6
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              display: false
            },
            tooltip: {
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              padding: 10,
              titleFont: {
                size: 14,
                weight: 'bold'
              },
              bodyFont: {
                size: 13
              }
            }
          },
          scales: {
            y: {
              beginAtZero: false,
              grid: {
                color: 'rgba(0, 0, 0, 0.05)'
              },
              ticks: {
                font: {
                  size: 12
                }
              }
            },
            x: {
              grid: {
                display: false
              },
              ticks: {
                font: {
                  size: 12
                }
              }
            }
          }
        }
      });
    }

    // Crear el gráfico de repeticiones
    if (repsChartRef.current) {
      if (repsChartInstance.current) {
        repsChartInstance.current.destroy();
      }

      const ctx = repsChartRef.current.getContext('2d');
      repsChartInstance.current = new Chart(ctx, {
        type: 'line',
        data: {
          labels: dates,
          datasets: [{
            label: 'Repeticiones promedio',
            data: reps,
            borderColor: 'rgb(139, 92, 246)',
            backgroundColor: 'rgba(139, 92, 246, 0.1)',
            tension: 0.3,
            fill: true,
            pointBackgroundColor: 'rgb(139, 92, 246)',
            pointRadius: 4,
            pointHoverRadius: 6
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              display: false
            },
            tooltip: {
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              padding: 10
            }
          },
          scales: {
            y: {
              beginAtZero: false,
              grid: {
                color: 'rgba(0, 0, 0, 0.05)'
              }
            },
            x: {
              grid: {
                display: false
              }
            }
          }
        }
      });
    }

    // Crear el gráfico de volumen
    if (volumeChartRef.current) {
      if (volumeChartInstance.current) {
        volumeChartInstance.current.destroy();
      }

      const ctx = volumeChartRef.current.getContext('2d');
      volumeChartInstance.current = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: dates,
          datasets: [{
            label: 'Volumen total (kg)',
            data: volumes,
            backgroundColor: 'rgba(16, 185, 129, 0.7)',
            borderColor: 'rgb(16, 185, 129)',
            borderWidth: 1,
            borderRadius: 4,
            hoverBackgroundColor: 'rgba(16, 185, 129, 0.9)'
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              display: false
            },
            tooltip: {
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              padding: 10
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: {
                color: 'rgba(0, 0, 0, 0.05)'
              }
            },
            x: {
              grid: {
                display: false
              }
            }
          }
        }
      });
    }

    // Limpiar al desmontar
    return () => {
      if (weightChartInstance.current) {
        weightChartInstance.current.destroy();
      }
      if (repsChartInstance.current) {
        repsChartInstance.current.destroy();
      }
      if (volumeChartInstance.current) {
        volumeChartInstance.current.destroy();
      }
    };
  }, [exercise, logs, activeTab]);

  if (!exercise) {
    return <div>Ejercicio no encontrado</div>;
  }

  if (logs.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-card p-6 mb-5 border border-gray-100">
        <h3 className="text-xl font-bold text-gray-800">{exercise.name}</h3>
        <div className="flex items-center justify-center h-40 mt-6 bg-gray-50 rounded-lg border border-gray-100">
          <div className="text-center">
            <FaChartLine className="mx-auto text-3xl text-gray-300 mb-2" />
            <p className="text-gray-500">No hay registros para este ejercicio todavía.</p>
            <p className="text-sm text-gray-400 mt-1">Registra tu primer entrenamiento para ver estadísticas.</p>
          </div>
        </div>
      </div>
    );
  }

  // Calcular estadísticas
  const lastLog = logs[logs.length - 1];
  const firstLog = logs[0];
  const previousLog = logs.length > 1 ? logs[logs.length - 2] : null;

  // Calcular peso máximo
  const maxWeight = logs.reduce((max, log) => {
    const logMax = log.sets.reduce((setMax, set) => {
      const weight = parseFloat(set.weight);
      return !isNaN(weight) && weight > setMax ? weight : setMax;
    }, 0);
    return logMax > max ? logMax : max;
  }, 0);

  // Calcular peso promedio del último entrenamiento
  const lastAvgWeight = lastLog.sets.reduce((sum, set) => {
    const weight = parseFloat(set.weight);
    return !isNaN(weight) ? sum + weight : sum;
  }, 0) / lastLog.sets.filter(set => !isNaN(parseFloat(set.weight))).length || 0;

  // Calcular peso promedio del entrenamiento anterior
  const prevAvgWeight = previousLog ? previousLog.sets.reduce((sum, set) => {
    const weight = parseFloat(set.weight);
    return !isNaN(weight) ? sum + weight : sum;
  }, 0) / previousLog.sets.filter(set => !isNaN(parseFloat(set.weight))).length || 0 : 0;

  // Calcular tendencia
  const weightTrend = calculateTrend(lastAvgWeight, prevAvgWeight);

  // Calcular volumen total del último entrenamiento
  const lastVolume = lastLog.sets.reduce((sum, set) => {
    const weight = parseFloat(set.weight);
    const reps = parseFloat(set.reps);
    return !isNaN(weight) && !isNaN(reps) ? sum + (weight * reps) : sum;
  }, 0);

  // Calcular volumen total del entrenamiento anterior
  const prevVolume = previousLog ? previousLog.sets.reduce((sum, set) => {
    const weight = parseFloat(set.weight);
    const reps = parseFloat(set.reps);
    return !isNaN(weight) && !isNaN(reps) ? sum + (weight * reps) : sum;
  }, 0) : 0;

  // Calcular tendencia del volumen
  const volumeTrend = calculateTrend(lastVolume, prevVolume);

  return (
    <div className="bg-white rounded-xl shadow-card p-6 mb-5 border border-gray-100">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-xl font-bold text-gray-800">{exercise.name}</h3>
        <div className="text-sm text-gray-500 flex items-center">
          <FaCalendarAlt className="mr-1" />
          <span>{logs.length} sesiones</span>
        </div>
      </div>

      {/* Tabs para cambiar entre gráficos */}
      <div className="flex border-b border-gray-200 mb-5">
        <button
          onClick={() => setActiveTab('weight')}
          className={`flex-1 py-3 font-medium text-sm ${activeTab === 'weight' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Peso
        </button>
        <button
          onClick={() => setActiveTab('reps')}
          className={`flex-1 py-3 font-medium text-sm ${activeTab === 'reps' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Repeticiones
        </button>
        <button
          onClick={() => setActiveTab('volume')}
          className={`flex-1 py-3 font-medium text-sm ${activeTab === 'volume' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Volumen
        </button>
      </div>

      {/* Gráficos */}
      <div className="h-64 mb-6">
        <div className={activeTab === 'weight' ? 'block h-full' : 'hidden'}>
          <canvas ref={weightChartRef} height="250"></canvas>
        </div>
        <div className={activeTab === 'reps' ? 'block h-full' : 'hidden'}>
          <canvas ref={repsChartRef} height="250"></canvas>
        </div>
        <div className={activeTab === 'volume' ? 'block h-full' : 'hidden'}>
          <canvas ref={volumeChartRef} height="250"></canvas>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
          <p className="text-sm text-gray-600 mb-1 flex items-center">
            <FaWeight className="mr-1 text-primary-500" />
            Peso máximo
          </p>
          <p className="text-xl font-bold text-gray-800">{maxWeight} kg</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
          <p className="text-sm text-gray-600 mb-1 flex items-center">
            <FaDumbbell className="mr-1 text-primary-500" />
            Último promedio
          </p>
          <div className="flex items-center">
            <p className="text-xl font-bold text-gray-800">{lastAvgWeight.toFixed(1)} kg</p>
            <span className="ml-2">
              {weightTrend === 'up' && <FaArrowUp className="text-green-500" />}
              {weightTrend === 'down' && <FaArrowDown className="text-red-500" />}
              {weightTrend === 'equal' && <FaEquals className="text-gray-400" />}
            </span>
          </div>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
          <p className="text-sm text-gray-600 mb-1 flex items-center">
            <FaChartLine className="mr-1 text-primary-500" />
            Volumen último
          </p>
          <div className="flex items-center">
            <p className="text-xl font-bold text-gray-800">{lastVolume.toFixed(0)} kg</p>
            <span className="ml-2">
              {volumeTrend === 'up' && <FaArrowUp className="text-green-500" />}
              {volumeTrend === 'down' && <FaArrowDown className="text-red-500" />}
              {volumeTrend === 'equal' && <FaEquals className="text-gray-400" />}
            </span>
          </div>
        </div>
      </div>

      {/* Último entrenamiento */}
      <div className="border border-gray-100 rounded-lg overflow-hidden">
        <div className="bg-gray-50 p-4 border-b border-gray-100 flex justify-between items-center">
          <h4 className="font-semibold text-gray-800 flex items-center">
            <FaHistory className="mr-2 text-primary-500" />
            Último entrenamiento
          </h4>
          <div className="text-sm text-gray-500">
            {formatDate(lastLog.date)} - {formatTime(lastLog.date)}
          </div>
        </div>
        <div className="p-4">
          <div className="space-y-2">
            {lastLog.sets.map((set, index) => (
              <div key={index} className="flex justify-between py-2 border-b border-gray-100 last:border-0">
                <span className="font-medium text-gray-700">Serie {index + 1}</span>
                <span className="text-gray-800">{set.reps} reps × {set.weight} kg</span>
              </div>
            ))}
          </div>
          {lastLog.notes && (
            <div className="mt-4 text-sm bg-gray-50 p-3 rounded-lg border border-gray-100">
              <p className="font-medium text-gray-700 mb-1">Notas:</p>
              <p className="text-gray-600">{lastLog.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExerciseProgress;
