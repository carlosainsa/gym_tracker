import React from 'react';
import { FaArrowUp, FaArrowDown, FaEquals } from 'react-icons/fa';

/**
 * Componente para mostrar estadísticas de progresión del plan
 */
const ProgressionStatsCard = ({ stats }) => {
  if (!stats) {
    return null;
  }
  
  // Obtener las semanas ordenadas para volumen
  const volumeWeeks = Object.entries(stats.volumeProgression)
    .sort(([a], [b]) => parseInt(a) - parseInt(b));
  
  // Obtener las semanas ordenadas para intensidad
  const intensityWeeks = Object.entries(stats.intensityProgression)
    .sort(([a], [b]) => parseInt(a) - parseInt(b));
  
  // Función para renderizar el indicador de progresión
  const renderProgressionIndicator = (rate) => {
    if (rate > 5) {
      return (
        <div className="flex items-center text-green-600 dark:text-green-400">
          <FaArrowUp className="mr-1" />
          <span>{rate.toFixed(1)}%</span>
        </div>
      );
    } else if (rate < -5) {
      return (
        <div className="flex items-center text-red-600 dark:text-red-400">
          <FaArrowDown className="mr-1" />
          <span>{Math.abs(rate).toFixed(1)}%</span>
        </div>
      );
    } else {
      return (
        <div className="flex items-center text-yellow-600 dark:text-yellow-400">
          <FaEquals className="mr-1" />
          <span>{rate.toFixed(1)}%</span>
        </div>
      );
    }
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
      <div className="p-4 bg-gradient-to-r from-green-500 to-green-600 text-white">
        <h2 className="text-lg font-bold">Estadísticas de Progresión</h2>
      </div>
      
      <div className="p-4">
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Progresión de Volumen</p>
            <div className="flex items-center">
              {renderProgressionIndicator(stats.volumeProgressionRate)}
            </div>
          </div>
          
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Progresión de Intensidad</p>
            <div className="flex items-center">
              {renderProgressionIndicator(stats.intensityProgressionRate)}
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Volumen Semanal
            </h3>
            
            <div className="space-y-2">
              {volumeWeeks.map(([week, data], index) => {
                // Calcular el cambio respecto a la semana anterior
                const prevWeek = index > 0 ? volumeWeeks[index - 1][1].average : null;
                const change = prevWeek ? ((data.average - prevWeek) / prevWeek) * 100 : 0;
                
                return (
                  <div key={week} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Semana {week}</span>
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-gray-800 dark:text-gray-200 mr-2">
                        {Math.round(data.average)} kg
                      </span>
                      {index > 0 && (
                        <span className={`text-xs ${
                          change > 0 ? 'text-green-600 dark:text-green-400' : 
                          change < 0 ? 'text-red-600 dark:text-red-400' : 
                          'text-gray-500 dark:text-gray-400'
                        }`}>
                          {change > 0 ? '+' : ''}{change.toFixed(1)}%
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Intensidad Semanal
            </h3>
            
            <div className="space-y-2">
              {intensityWeeks.map(([week, data], index) => {
                // Calcular el cambio respecto a la semana anterior
                const prevWeek = index > 0 ? intensityWeeks[index - 1][1].average : null;
                const change = prevWeek ? ((data.average - prevWeek) / prevWeek) * 100 : 0;
                
                return (
                  <div key={week} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Semana {week}</span>
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-gray-800 dark:text-gray-200 mr-2">
                        {data.average.toFixed(1)} kg
                      </span>
                      {index > 0 && (
                        <span className={`text-xs ${
                          change > 0 ? 'text-green-600 dark:text-green-400' : 
                          change < 0 ? 'text-red-600 dark:text-red-400' : 
                          'text-gray-500 dark:text-gray-400'
                        }`}>
                          {change > 0 ? '+' : ''}{change.toFixed(1)}%
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressionStatsCard;
