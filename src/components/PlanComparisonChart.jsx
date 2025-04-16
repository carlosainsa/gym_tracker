import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

/**
 * Componente para mostrar gráficos de comparación entre planes
 */
const PlanComparisonChart = ({ baseStats, compareStats, basePlanName, comparePlanName }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  
  useEffect(() => {
    if (!baseStats || !compareStats || !chartRef.current) return;
    
    // Destruir el gráfico anterior si existe
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }
    
    // Preparar datos para el gráfico
    const labels = ['Volumen Total (kg)', 'Volumen por Entrenamiento (kg)', 'Duración Total (min)', 'Duración Promedio (min)'];
    
    // Convertir duración de segundos a minutos para mejor visualización
    const baseDurationTotal = Math.round(baseStats.totalDuration / 60);
    const compareDurationTotal = Math.round(compareStats.totalDuration / 60);
    const baseDurationAvg = Math.round(baseStats.avgWorkoutDuration / 60);
    const compareDurationAvg = Math.round(compareStats.avgWorkoutDuration / 60);
    
    const baseData = [
      Math.round(baseStats.totalVolume),
      Math.round(baseStats.avgVolumePerWorkout),
      baseDurationTotal,
      baseDurationAvg
    ];
    
    const compareData = [
      Math.round(compareStats.totalVolume),
      Math.round(compareStats.avgVolumePerWorkout),
      compareDurationTotal,
      compareDurationAvg
    ];
    
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
            backgroundColor: 'rgba(99, 102, 241, 0.5)',
            borderColor: 'rgb(99, 102, 241)',
            borderWidth: 1
          },
          {
            label: comparePlanName,
            data: compareData,
            backgroundColor: 'rgba(16, 185, 129, 0.5)',
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
          tooltip: {
            callbacks: {
              label: function(context) {
                let label = context.dataset.label || '';
                if (label) {
                  label += ': ';
                }
                
                const value = context.parsed.y;
                const dataIndex = context.dataIndex;
                
                // Formatear según el tipo de dato
                if (dataIndex >= 2) {
                  // Es una duración en minutos
                  const hours = Math.floor(value / 60);
                  const minutes = value % 60;
                  
                  if (hours > 0) {
                    return `${label}${hours}h ${minutes}m`;
                  } else {
                    return `${label}${minutes}m`;
                  }
                } else {
                  // Es un valor de volumen
                  return `${label}${value.toLocaleString()} kg`;
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
  
  return (
    <div className="h-80">
      <canvas ref={chartRef}></canvas>
    </div>
  );
};

export default PlanComparisonChart;
