import React from 'react';
import { FaFire, FaChartLine } from 'react-icons/fa';

/**
 * Componente para mostrar estadísticas de intensidad del plan
 */
const IntensityStatsCard = ({ stats }) => {
  if (!stats) {
    return null;
  }
  
  // Obtener los grupos musculares ordenados por intensidad
  const muscleGroups = Object.entries(stats.intensityByMuscleGroup)
    .sort(([, a], [, b]) => b.average - a.average)
    .slice(0, 5); // Top 5
  
  // Obtener las semanas ordenadas
  const weeks = Object.entries(stats.intensityByWeek)
    .sort(([a], [b]) => parseInt(a) - parseInt(b));
  
  // Obtener el nombre legible del grupo muscular
  const getMuscleGroupName = (group) => {
    switch (group) {
      case 'chest':
        return 'Pecho';
      case 'back':
        return 'Espalda';
      case 'legs':
        return 'Piernas';
      case 'shoulders':
        return 'Hombros';
      case 'arms':
        return 'Brazos';
      case 'core':
        return 'Core';
      case 'glutes':
        return 'Glúteos';
      case 'calves':
        return 'Pantorrillas';
      case 'other':
        return 'Otros';
      default:
        return group;
    }
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
      <div className="p-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white">
        <h2 className="text-lg font-bold">Estadísticas de Intensidad</h2>
      </div>
      
      <div className="p-4">
        <div className="text-center mb-6">
          <p className="text-sm text-gray-500 dark:text-gray-400">Intensidad Media</p>
          <p className="text-2xl font-bold text-gray-800 dark:text-white">{stats.averageIntensity.toFixed(1)} kg</p>
        </div>
        
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
            <FaFire className="mr-1" />
            Intensidad por Grupo Muscular
          </h3>
          
          <div className="space-y-3">
            {muscleGroups.map(([group, data]) => (
              <div key={group}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-600 dark:text-gray-400">{getMuscleGroupName(group)}</span>
                  <span className="text-gray-800 dark:text-gray-200">{data.average.toFixed(1)} kg</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-orange-500 h-2 rounded-full" 
                    style={{ 
                      width: `${Math.min(100, (data.average / muscleGroups[0][1].average) * 100)}%` 
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
            <FaChartLine className="mr-1" />
            Progresión de Intensidad por Semana
          </h3>
          
          <div className="space-y-3">
            {weeks.map(([week, data]) => (
              <div key={week}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-600 dark:text-gray-400">Semana {week}</span>
                  <span className="text-gray-800 dark:text-gray-200">{data.average.toFixed(1)} kg</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-orange-500 h-2 rounded-full" 
                    style={{ 
                      width: `${Math.min(100, (data.average / Math.max(...weeks.map(([, w]) => w.average))) * 100)}%` 
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntensityStatsCard;
