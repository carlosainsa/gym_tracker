import React from 'react';
import { FaWeight, FaChartBar } from 'react-icons/fa';

/**
 * Componente para mostrar estadísticas de volumen del plan
 */
const VolumeStatsCard = ({ stats }) => {
  if (!stats) {
    return null;
  }
  
  // Obtener los grupos musculares ordenados por volumen
  const muscleGroups = Object.entries(stats.volumeByMuscleGroup)
    .sort(([, a], [, b]) => b.weight - a.weight)
    .slice(0, 5); // Top 5
  
  // Obtener las semanas ordenadas
  const weeks = Object.entries(stats.volumeByWeek)
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
      <div className="p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white">
        <h2 className="text-lg font-bold">Estadísticas de Volumen</h2>
      </div>
      
      <div className="p-4">
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">Series Totales</p>
            <p className="text-xl font-bold text-gray-800 dark:text-white">{stats.totalSets}</p>
          </div>
          
          <div className="text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">Repeticiones</p>
            <p className="text-xl font-bold text-gray-800 dark:text-white">{Math.round(stats.totalReps)}</p>
          </div>
          
          <div className="text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">Volumen (kg)</p>
            <p className="text-xl font-bold text-gray-800 dark:text-white">{Math.round(stats.totalWeight)}</p>
          </div>
        </div>
        
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
            <FaWeight className="mr-1" />
            Volumen por Grupo Muscular
          </h3>
          
          <div className="space-y-3">
            {muscleGroups.map(([group, data]) => (
              <div key={group}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-600 dark:text-gray-400">{getMuscleGroupName(group)}</span>
                  <span className="text-gray-800 dark:text-gray-200">{Math.round(data.weight)} kg</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full" 
                    style={{ 
                      width: `${Math.min(100, (data.weight / muscleGroups[0][1].weight) * 100)}%` 
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
            <FaChartBar className="mr-1" />
            Progresión de Volumen por Semana
          </h3>
          
          <div className="space-y-3">
            {weeks.map(([week, data]) => (
              <div key={week}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-600 dark:text-gray-400">Semana {week}</span>
                  <span className="text-gray-800 dark:text-gray-200">{Math.round(data.weight)} kg</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full" 
                    style={{ 
                      width: `${Math.min(100, (data.weight / Math.max(...weeks.map(([, w]) => w.weight))) * 100)}%` 
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

export default VolumeStatsCard;
