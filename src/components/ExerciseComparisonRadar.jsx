import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

/**
 * Componente para mostrar un gráfico de radar comparando ejercicios comunes
 */
const ExerciseComparisonRadar = ({ baseStats, compareStats, basePlanName, comparePlanName }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  
  useEffect(() => {
    if (!baseStats || !compareStats || !chartRef.current) return;
    
    // Destruir el gráfico anterior si existe
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }
    
    // Obtener ejercicios comunes
    const commonExercises = Object.keys(baseStats.exerciseStats)
      .filter(exercise => compareStats.exerciseStats[exercise])
      .slice(0, 8); // Limitar a 8 ejercicios para mejor visualización
    
    if (commonExercises.length === 0) return;
    
    // Preparar datos para el gráfico
    const baseData = commonExercises.map(exercise => 
      baseStats.exerciseStats[exercise].maxWeight
    );
    
    const compareData = commonExercises.map(exercise => 
      compareStats.exerciseStats[exercise].maxWeight
    );
    
    // Crear el gráfico
    const ctx = chartRef.current.getContext('2d');
    chartInstance.current = new Chart(ctx, {
      type: 'radar',
      data: {
        labels: commonExercises,
        datasets: [
          {
            label: `${basePlanName} (Peso Máximo)`,
            data: baseData,
            backgroundColor: 'rgba(99, 102, 241, 0.2)',
            borderColor: 'rgb(99, 102, 241)',
            pointBackgroundColor: 'rgb(99, 102, 241)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgb(99, 102, 241)'
          },
          {
            label: `${comparePlanName} (Peso Máximo)`,
            data: compareData,
            backgroundColor: 'rgba(16, 185, 129, 0.2)',
            borderColor: 'rgb(16, 185, 129)',
            pointBackgroundColor: 'rgb(16, 185, 129)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgb(16, 185, 129)'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          r: {
            angleLines: {
              color: document.documentElement.classList.contains('dark') ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
            },
            grid: {
              color: document.documentElement.classList.contains('dark') ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
            },
            pointLabels: {
              color: document.documentElement.classList.contains('dark') ? '#d1d5db' : '#4b5563',
              font: {
                size: 10
              }
            },
            ticks: {
              color: document.documentElement.classList.contains('dark') ? '#d1d5db' : '#4b5563',
              backdropColor: document.documentElement.classList.contains('dark') ? '#1f2937' : '#ffffff'
            }
          }
        },
        plugins: {
          legend: {
            labels: {
              color: document.documentElement.classList.contains('dark') ? '#d1d5db' : '#4b5563'
            }
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                let label = context.dataset.label || '';
                if (label) {
                  label += ': ';
                }
                return `${label}${context.parsed.r} kg`;
              }
            }
          }
        }
      }
    });
    
    // Limpiar al desmontar
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [baseStats, compareStats, basePlanName, comparePlanName]);
  
  // Si no hay ejercicios comunes, mostrar mensaje
  if (!baseStats || !compareStats) return null;
  
  const commonExercises = Object.keys(baseStats.exerciseStats)
    .filter(exercise => compareStats.exerciseStats[exercise]);
  
  if (commonExercises.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-gray-600 dark:text-gray-400">No hay suficientes ejercicios comunes para generar un gráfico.</p>
      </div>
    );
  }
  
  return (
    <div className="h-80">
      <canvas ref={chartRef}></canvas>
    </div>
  );
};

export default ExerciseComparisonRadar;
