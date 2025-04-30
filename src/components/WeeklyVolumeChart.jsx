import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

/**
 * Componente para mostrar la progresión de volumen semanal
 */
const WeeklyVolumeChart = ({ stats, title = 'Progresión de Volumen Semanal' }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  
  useEffect(() => {
    if (!stats || !stats.weeklyStats || !chartRef.current) return;
    
    // Destruir el gráfico anterior si existe
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }
    
    // Preparar datos para el gráfico
    const weeklyData = Object.entries(stats.weeklyStats);
    
    if (weeklyData.length === 0) return;
    
    const labels = weeklyData.map(([week]) => {
      const [year, weekNum] = week.split('-');
      return `Sem ${weekNum}`;
    });
    
    const volumeData = weeklyData.map(([_, data]) => Math.round(data.volume));
    
    // Crear el gráfico
    const ctx = chartRef.current.getContext('2d');
    chartInstance.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Volumen (kg)',
            data: volumeData,
            backgroundColor: 'rgba(99, 102, 241, 0.2)',
            borderColor: 'rgb(99, 102, 241)',
            borderWidth: 2,
            tension: 0.3,
            fill: true,
            pointBackgroundColor: 'rgb(99, 102, 241)',
            pointRadius: 4,
            pointHoverRadius: 6
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
            display: false
          },
          title: {
            display: true,
            text: title,
            color: document.documentElement.classList.contains('dark') ? '#d1d5db' : '#4b5563',
            font: {
              size: 14,
              weight: 'normal'
            }
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const value = context.raw;
                return `Volumen: ${value.toLocaleString()} kg`;
              },
              title: function(context) {
                const index = context[0].dataIndex;
                const weekKey = Object.keys(stats.weeklyStats)[index];
                const [year, weekNum] = weekKey.split('-');
                return `Semana ${weekNum} (${year})`;
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
  }, [stats, title]);
  
  if (!stats || !stats.weeklyStats || Object.keys(stats.weeklyStats).length === 0) {
    return (
      <div className="h-64 flex items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">No hay datos semanales disponibles</p>
      </div>
    );
  }
  
  return (
    <div className="h-64">
      <canvas ref={chartRef}></canvas>
    </div>
  );
};

export default WeeklyVolumeChart;
