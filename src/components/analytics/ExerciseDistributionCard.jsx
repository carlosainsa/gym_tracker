import React from 'react';
import { FaPieChart, FaDumbbell, FaRunning } from 'react-icons/fa';

/**
 * Componente para mostrar la distribución de ejercicios del plan
 */
const ExerciseDistributionCard = ({ stats }) => {
  if (!stats) {
    return null;
  }
  
  // Obtener los tipos de ejercicios ordenados
  const exerciseTypes = Object.entries(stats.byType)
    .sort(([, a], [, b]) => b - a);
  
  // Obtener los grupos musculares ordenados
  const muscleGroups = Object.entries(stats.byMuscleGroup)
    .sort(([, a], [, b]) => b - a);
  
  // Obtener los equipos ordenados
  const equipment = Object.entries(stats.byEquipment)
    .sort(([, a], [, b]) => b - a);
  
  // Calcular el total para porcentajes
  const typeTotal = exerciseTypes.reduce((sum, [, count]) => sum + count, 0);
  const muscleTotal = muscleGroups.reduce((sum, [, count]) => sum + count, 0);
  const equipmentTotal = equipment.reduce((sum, [, count]) => sum + count, 0);
  
  // Obtener el nombre legible del tipo de ejercicio
  const getExerciseTypeName = (type) => {
    switch (type) {
      case 'compound':
        return 'Compuesto';
      case 'isolation':
        return 'Aislamiento';
      case 'bodyweight':
        return 'Peso corporal';
      case 'cardio':
        return 'Cardio';
      case 'other':
        return 'Otros';
      default:
        return type;
    }
  };
  
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
  
  // Obtener el nombre legible del equipo
  const getEquipmentName = (eq) => {
    switch (eq) {
      case 'barbell':
        return 'Barra';
      case 'dumbbell':
        return 'Mancuernas';
      case 'machine':
        return 'Máquina';
      case 'cable':
        return 'Polea';
      case 'bodyweight':
        return 'Peso corporal';
      case 'kettlebell':
        return 'Kettlebell';
      case 'bands':
        return 'Bandas';
      case 'other':
        return 'Otros';
      default:
        return eq;
    }
  };
  
  // Función para obtener un color según el índice
  const getColorClass = (index) => {
    const colors = [
      'bg-blue-500',
      'bg-green-500',
      'bg-yellow-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-red-500',
      'bg-orange-500',
      'bg-teal-500',
      'bg-gray-500'
    ];
    
    return colors[index % colors.length];
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
      <div className="p-4 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white">
        <h2 className="text-lg font-bold">Distribución de Ejercicios</h2>
      </div>
      
      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
              <FaDumbbell className="mr-1" />
              Por Tipo de Ejercicio
            </h3>
            
            <div className="space-y-2">
              {exerciseTypes.map(([type, count], index) => (
                <div key={type}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-600 dark:text-gray-400">{getExerciseTypeName(type)}</span>
                    <span className="text-gray-800 dark:text-gray-200">
                      {count} ({Math.round((count / typeTotal) * 100)}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${getColorClass(index)}`} 
                      style={{ width: `${(count / typeTotal) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
              <FaPieChart className="mr-1" />
              Por Grupo Muscular
            </h3>
            
            <div className="space-y-2">
              {muscleGroups.slice(0, 6).map(([group, count], index) => (
                <div key={group}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-600 dark:text-gray-400">{getMuscleGroupName(group)}</span>
                    <span className="text-gray-800 dark:text-gray-200">
                      {Math.round(count)} ({Math.round((count / muscleTotal) * 100)}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${getColorClass(index)}`} 
                      style={{ width: `${(count / muscleTotal) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
              <FaRunning className="mr-1" />
              Por Equipo
            </h3>
            
            <div className="space-y-2">
              {equipment.slice(0, 6).map(([eq, count], index) => (
                <div key={eq}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-600 dark:text-gray-400">{getEquipmentName(eq)}</span>
                    <span className="text-gray-800 dark:text-gray-200">
                      {count} ({Math.round((count / equipmentTotal) * 100)}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${getColorClass(index)}`} 
                      style={{ width: `${(count / equipmentTotal) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExerciseDistributionCard;
