import React from 'react';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

/**
 * Componente para mostrar estadísticas de cumplimiento del plan
 */
const ComplianceStatsCard = ({ stats }) => {
  if (!stats) {
    return null;
  }
  
  // Obtener las semanas ordenadas
  const weeks = Object.entries(stats.complianceByWeek)
    .sort(([a], [b]) => parseInt(a) - parseInt(b));
  
  // Obtener los grupos musculares ordenados por tasa de cumplimiento
  const muscleGroups = Object.entries(stats.complianceByMuscleGroup)
    .sort(([, a], [, b]) => b.setRate - a.setRate)
    .slice(0, 5); // Top 5
  
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
  
  // Función para obtener el color según la tasa de cumplimiento
  const getComplianceColor = (rate) => {
    if (rate >= 90) {
      return 'bg-green-500';
    } else if (rate >= 70) {
      return 'bg-yellow-500';
    } else {
      return 'bg-red-500';
    }
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
      <div className="p-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white">
        <h2 className="text-lg font-bold">Estadísticas de Cumplimiento</h2>
      </div>
      
      <div className="p-4">
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Sesiones</p>
            <div className="flex items-center">
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mr-2">
                <div 
                  className={`h-2.5 rounded-full ${getComplianceColor(stats.sessionComplianceRate)}`} 
                  style={{ width: `${Math.min(100, stats.sessionComplianceRate)}%` }}
                ></div>
              </div>
              <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                {stats.sessionComplianceRate.toFixed(0)}%
              </span>
            </div>
          </div>
          
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Ejercicios</p>
            <div className="flex items-center">
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mr-2">
                <div 
                  className={`h-2.5 rounded-full ${getComplianceColor(stats.exerciseComplianceRate)}`} 
                  style={{ width: `${Math.min(100, stats.exerciseComplianceRate)}%` }}
                ></div>
              </div>
              <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                {stats.exerciseComplianceRate.toFixed(0)}%
              </span>
            </div>
          </div>
          
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Series</p>
            <div className="flex items-center">
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mr-2">
                <div 
                  className={`h-2.5 rounded-full ${getComplianceColor(stats.setComplianceRate)}`} 
                  style={{ width: `${Math.min(100, stats.setComplianceRate)}%` }}
                ></div>
              </div>
              <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                {stats.setComplianceRate.toFixed(0)}%
              </span>
            </div>
          </div>
        </div>
        
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Cumplimiento por Semana
          </h3>
          
          <div className="space-y-3">
            {weeks.map(([week, data]) => (
              <div key={week}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-600 dark:text-gray-400">Semana {week}</span>
                  <span className="text-gray-800 dark:text-gray-200">{data.setRate.toFixed(0)}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${getComplianceColor(data.setRate)}`} 
                    style={{ width: `${Math.min(100, data.setRate)}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Cumplimiento por Grupo Muscular
          </h3>
          
          <div className="space-y-3">
            {muscleGroups.map(([group, data]) => (
              <div key={group}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-600 dark:text-gray-400">{getMuscleGroupName(group)}</span>
                  <span className="text-gray-800 dark:text-gray-200">{data.setRate.toFixed(0)}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${getComplianceColor(data.setRate)}`} 
                    style={{ width: `${Math.min(100, data.setRate)}%` }}
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

export default ComplianceStatsCard;
