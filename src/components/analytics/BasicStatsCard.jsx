import React from 'react';
import { FaCalendarAlt, FaDumbbell, FaListOl, FaClipboardCheck } from 'react-icons/fa';

/**
 * Componente para mostrar estadísticas básicas del plan
 */
const BasicStatsCard = ({ stats }) => {
  if (!stats) {
    return null;
  }
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
      <div className="p-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white">
        <h2 className="text-lg font-bold">Estadísticas Básicas</h2>
      </div>
      
      <div className="p-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400">
              <FaCalendarAlt />
            </div>
            <div className="ml-3">
              <p className="text-sm text-gray-500 dark:text-gray-400">Duración</p>
              <p className="text-lg font-semibold text-gray-800 dark:text-white">{stats.duration} semanas</p>
            </div>
          </div>
          
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400">
              <FaClipboardCheck />
            </div>
            <div className="ml-3">
              <p className="text-sm text-gray-500 dark:text-gray-400">Frecuencia</p>
              <p className="text-lg font-semibold text-gray-800 dark:text-white">{stats.frequency.toFixed(1)} días/semana</p>
            </div>
          </div>
          
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400">
              <FaDumbbell />
            </div>
            <div className="ml-3">
              <p className="text-sm text-gray-500 dark:text-gray-400">Sesiones</p>
              <p className="text-lg font-semibold text-gray-800 dark:text-white">{stats.sessionCount} sesiones</p>
            </div>
          </div>
          
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400">
              <FaListOl />
            </div>
            <div className="ml-3">
              <p className="text-sm text-gray-500 dark:text-gray-400">Ejercicios</p>
              <p className="text-lg font-semibold text-gray-800 dark:text-white">{stats.exerciseCount} ejercicios</p>
            </div>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Ejercicios únicos</p>
              <p className="text-lg font-semibold text-gray-800 dark:text-white">{stats.uniqueExerciseCount}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Series totales</p>
              <p className="text-lg font-semibold text-gray-800 dark:text-white">{stats.setCount}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Ejercicios por sesión</p>
              <p className="text-lg font-semibold text-gray-800 dark:text-white">{stats.exercisesPerSession.toFixed(1)}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Series por ejercicio</p>
              <p className="text-lg font-semibold text-gray-800 dark:text-white">{stats.setsPerExercise.toFixed(1)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasicStatsCard;
