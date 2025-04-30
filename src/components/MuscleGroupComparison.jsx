import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import statisticsService from '../services/statisticsService';

/**
 * Componente para mostrar la comparación de grupos musculares entre planes
 */
const MuscleGroupComparison = ({ baseStats, compareStats, basePlanName, comparePlanName }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  
  useEffect(() => {
    if (!baseStats || !compareStats || !chartRef.current) return;
    
    // Destruir el gráfico anterior si existe
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }
    
    // Calcular estadísticas comparativas
    const comparativeStats = statisticsService.calculateComparativeStats(baseStats, compareStats);
    if (!comparativeStats) return;
    
    // Filtrar grupos musculares con volumen > 0 en ambos planes
    const muscleGroups = Object.entries(comparativeStats.muscleGroupComparison)
      .filter(([group, data]) => {
        return baseStats.muscleGroupStats[group]?.volume > 0 || 
               compareStats.muscleGroupStats[group]?.volume > 0;
      })
      .sort((a, b) => {
        // Ordenar por la suma de volumen en ambos planes
        const volumeA = (baseStats.muscleGroupStats[a[0]]?.volume || 0) + 
                        (compareStats.muscleGroupStats[a[0]]?.volume || 0);
        const volumeB = (baseStats.muscleGroupStats[b[0]]?.volume || 0) + 
                        (compareStats.muscleGroupStats[b[0]]?.volume || 0);
        return volumeB - volumeA;
      });
    
    if (muscleGroups.length === 0) return;
    
    // Preparar datos para el gráfico
    const labels = muscleGroups.map(([_, data]) => data.name);
    const baseData = muscleGroups.map(([group]) => 
      Math.round(baseStats.muscleGroupStats[group]?.volume || 0)
    );
    const compareData = muscleGroups.map(([group]) => 
      Math.round(compareStats.muscleGroupStats[group]?.volume || 0)
    );
    
    // Crear el gráfico
    const ctx = chartRef.current.getContext('2d');
    chartInstance.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: basePlanName,
            data: baseData,
            backgroundColor: 'rgba(99, 102, 241, 0.7)',
            borderColor: 'rgb(99, 102, 241)',
            borderWidth: 1
          },
          {
            label: comparePlanName,
            data: compareData,
            backgroundColor: 'rgba(16, 185, 129, 0.7)',
            borderColor: 'rgb(16, 185, 129)',
            borderWidth: 1
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              color: document.documentElement.classList.contains('dark') ? '#d1d5db' : '#4b5563'
            },
            grid: {
              color: document.documentElement.classList.contains('dark') ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
            },
            title: {
              display: true,
              text: 'Volumen (kg)',
              color: document.documentElement.classList.contains('dark') ? '#d1d5db' : '#4b5563'
            }
          },
          x: {
            ticks: {
              color: document.documentElement.classList.contains('dark') ? '#d1d5db' : '#4b5563'
            },
            grid: {
              color: document.documentElement.classList.contains('dark') ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
            }
          }
        },
        plugins: {
          legend: {
            labels: {
              color: document.documentElement.classList.contains('dark') ? '#d1d5db' : '#4b5563'
            }
          },
          title: {
            display: true,
            text: 'Comparación de Volumen por Grupo Muscular',
            color: document.documentElement.classList.contains('dark') ? '#d1d5db' : '#4b5563',
            font: {
              size: 14,
              weight: 'normal'
            }
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const label = context.dataset.label || '';
                const value = context.raw;
                return `${label}: ${value.toLocaleString()} kg`;
              },
              afterBody: function(context) {
                const index = context[0].dataIndex;
                const group = muscleGroups[index][0];
                const diff = comparativeStats.muscleGroupComparison[group].volumeDiff;
                
                if (Math.abs(diff) < 0.5) return ['Sin cambios significativos'];
                
                const formattedDiff = diff.toFixed(1);
                if (diff > 0) {
                  return [`Diferencia: +${formattedDiff}% en ${comparePlanName}`];
                } else {
                  return [`Diferencia: ${formattedDiff}% en ${comparePlanName}`];
                }
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
  
  if (!baseStats || !compareStats) {
    return (
      <div className="h-64 flex items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">No hay datos disponibles para comparar</p>
      </div>
    );
  }
  
  return (
    <div className="h-64">
      <canvas ref={chartRef}></canvas>
    </div>
  );
};

export default MuscleGroupComparison;
