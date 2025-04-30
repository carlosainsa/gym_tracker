import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

/**
 * Componente para mostrar la distribución de volumen por grupo muscular
 */
const MuscleGroupDistribution = ({ stats, title = 'Distribución por Grupo Muscular' }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  
  useEffect(() => {
    if (!stats || !stats.muscleGroupStats || !chartRef.current) return;
    
    // Destruir el gráfico anterior si existe
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }
    
    // Filtrar grupos musculares con volumen > 0
    const muscleGroups = Object.entries(stats.muscleGroupStats)
      .filter(([_, group]) => group.volume > 0)
      .sort((a, b) => b[1].volume - a[1].volume);
    
    if (muscleGroups.length === 0) return;
    
    // Preparar datos para el gráfico
    const labels = muscleGroups.map(([_, group]) => group.name);
    const data = muscleGroups.map(([_, group]) => Math.round(group.volume));
    
    // Colores para los grupos musculares
    const colors = [
      'rgba(255, 99, 132, 0.7)',   // Rojo
      'rgba(54, 162, 235, 0.7)',   // Azul
      'rgba(255, 206, 86, 0.7)',   // Amarillo
      'rgba(75, 192, 192, 0.7)',   // Verde azulado
      'rgba(153, 102, 255, 0.7)',  // Púrpura
      'rgba(255, 159, 64, 0.7)',   // Naranja
      'rgba(199, 199, 199, 0.7)',  // Gris
      'rgba(83, 102, 255, 0.7)',   // Azul violeta
      'rgba(255, 99, 255, 0.7)',   // Rosa
      'rgba(99, 255, 132, 0.7)',   // Verde claro
      'rgba(255, 159, 182, 0.7)'   // Rosa claro
    ];
    
    // Crear el gráfico
    const ctx = chartRef.current.getContext('2d');
    chartInstance.current = new Chart(ctx, {
      type: 'pie',
      data: {
        labels,
        datasets: [
          {
            data,
            backgroundColor: colors.slice(0, muscleGroups.length),
            borderColor: colors.slice(0, muscleGroups.length).map(color => color.replace('0.7', '1')),
            borderWidth: 1
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right',
            labels: {
              color: document.documentElement.classList.contains('dark') ? '#d1d5db' : '#4b5563',
              font: {
                size: 11
              },
              boxWidth: 15
            }
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
                const label = context.label || '';
                const value = context.raw;
                const total = context.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
                const percentage = Math.round((value / total) * 100);
                return `${label}: ${value.toLocaleString()} kg (${percentage}%)`;
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
  
  if (!stats || !stats.muscleGroupStats) {
    return (
      <div className="h-64 flex items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">No hay datos disponibles</p>
      </div>
    );
  }
  
  return (
    <div className="h-64">
      <canvas ref={chartRef}></canvas>
    </div>
  );
};

export default MuscleGroupDistribution;
