import React, { useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

/**
 * Componente para la configuración de split
 */
const SplitConfig = ({ 
  splitConfiguration, 
  setSplitConfiguration,
  weeklyFrequency,
  setWeeklyFrequency,
  trainingDays,
  setTrainingDays
}) => {
  const [showDetails, setShowDetails] = useState(false);

  // Opciones de split
  const splitOptions = [
    { 
      id: 'fullbody', 
      name: 'Cuerpo Completo', 
      description: 'Entrena todo el cuerpo en cada sesión',
      details: 'El split de cuerpo completo trabaja todos los grupos musculares principales en cada sesión. Es eficiente en tiempo y proporciona alta frecuencia de entrenamiento para cada grupo muscular. Ideal para principiantes, personas con tiempo limitado o quienes entrenan 2-3 días por semana.',
      recommendedFrequency: [2, 3, 4],
      example: 'Cada sesión incluye:\n- 1-2 ejercicios para piernas\n- 1-2 ejercicios para pecho\n- 1-2 ejercicios para espalda\n- 1 ejercicio para hombros\n- 1 ejercicio para brazos\n- 1 ejercicio para core'
    },
    { 
      id: 'upper_lower', 
      name: 'Superior/Inferior', 
      description: 'Alterna entre tren superior e inferior',
      details: 'El split superior/inferior divide el entrenamiento en días para la parte superior del cuerpo (pecho, espalda, hombros, brazos) y días para la parte inferior (piernas, glúteos). Permite mayor volumen por grupo muscular que el full body mientras mantiene una frecuencia de 2 veces por semana para cada parte. Ideal para intermedios o quienes entrenan 4 días por semana.',
      recommendedFrequency: [3, 4, 6],
      example: 'Día Superior:\n- 2 ejercicios para pecho\n- 2 ejercicios para espalda\n- 1-2 ejercicios para hombros\n- 1 ejercicio para bíceps\n- 1 ejercicio para tríceps\n\nDía Inferior:\n- 2 ejercicios para cuádriceps\n- 1-2 ejercicios para isquiotibiales\n- 1 ejercicio para glúteos\n- 1 ejercicio para pantorrillas\n- 1 ejercicio para core'
    },
    { 
      id: 'push_pull_legs', 
      name: 'Push/Pull/Legs', 
      description: 'Divide en empuje, tracción y piernas',
      details: 'El split Push/Pull/Legs organiza los ejercicios según el patrón de movimiento: empuje (pecho, hombros, tríceps), tracción (espalda, bíceps) y piernas (cuádriceps, isquiotibiales, glúteos). Permite alto volumen por sesión mientras mantiene una frecuencia adecuada. Ideal para intermedios y avanzados que entrenan 3, 6 o incluso 7 días por semana (con doble rotación).',
      recommendedFrequency: [3, 6],
      example: 'Día Push (Empuje):\n- 2-3 ejercicios para pecho\n- 2 ejercicios para hombros\n- 1-2 ejercicios para tríceps\n\nDía Pull (Tracción):\n- 3 ejercicios para espalda\n- 1 ejercicio para trapecios\n- 2 ejercicios para bíceps\n\nDía Legs (Piernas):\n- 2 ejercicios para cuádriceps\n- 2 ejercicios para isquiotibiales\n- 1 ejercicio para glúteos\n- 1 ejercicio para pantorrillas\n- 1 ejercicio para core'
    },
    { 
      id: 'arnold', 
      name: 'Arnold Split', 
      description: 'Pecho/Espalda, Piernas/Hombros, Brazos/Core',
      details: 'El Arnold Split, popularizado por Arnold Schwarzenegger, agrupa músculos antagonistas (pecho/espalda) o complementarios en el mismo día. Este enfoque permite alta intensidad y bombeo en grupos musculares específicos. Ideal para culturistas o personas enfocadas en hipertrofia que entrenan 3-6 días por semana.',
      recommendedFrequency: [3, 6],
      example: 'Día 1: Pecho y Espalda\n- 3-4 ejercicios para pecho\n- 3-4 ejercicios para espalda\n\nDía 2: Piernas y Hombros\n- 3 ejercicios para piernas\n- 3 ejercicios para hombros\n\nDía 3: Brazos y Core\n- 2-3 ejercicios para bíceps\n- 2-3 ejercicios para tríceps\n- 2 ejercicios para core'
    },
    { 
      id: 'bro', 
      name: 'Bro Split', 
      description: 'Un grupo muscular principal por día',
      details: 'El Bro Split dedica cada sesión a un grupo muscular principal. Permite máximo volumen e intensidad por grupo muscular, pero con baja frecuencia (cada grupo se entrena una vez por semana). Popular entre culturistas, es ideal para personas avanzadas enfocadas en hipertrofia que pueden entrenar 5-6 días por semana.',
      recommendedFrequency: [5, 6],
      example: 'Día 1: Pecho\n- 4-5 ejercicios para pecho\n\nDía 2: Espalda\n- 4-5 ejercicios para espalda\n\nDía 3: Piernas\n- 5-6 ejercicios para piernas\n\nDía 4: Hombros\n- 4-5 ejercicios para hombros\n\nDía 5: Brazos\n- 3 ejercicios para bíceps\n- 3 ejercicios para tríceps'
    }
  ];

  // Obtener la opción seleccionada
  const selectedOption = splitOptions.find(option => option.id === splitConfiguration) || splitOptions[0];

  // Nombres de los días de la semana
  const dayNames = {
    0: 'Dom',
    1: 'Lun',
    2: 'Mar',
    3: 'Mié',
    4: 'Jue',
    5: 'Vie',
    6: 'Sáb'
  };

  // Nombres completos de los días de la semana
  const fullDayNames = {
    0: 'Domingo',
    1: 'Lunes',
    2: 'Martes',
    3: 'Miércoles',
    4: 'Jueves',
    5: 'Viernes',
    6: 'Sábado'
  };

  // Manejar cambio en los días de entrenamiento
  const handleDayToggle = (day) => {
    if (trainingDays.includes(day)) {
      // Si ya está seleccionado, quitarlo (siempre que quede al menos un día)
      if (trainingDays.length > 1) {
        setTrainingDays(trainingDays.filter(d => d !== day));
        
        // Actualizar la frecuencia semanal
        setWeeklyFrequency(trainingDays.length - 1);
      }
    } else {
      // Si no está seleccionado, añadirlo
      const newDays = [...trainingDays, day].sort();
      setTrainingDays(newDays);
      
      // Actualizar la frecuencia semanal
      setWeeklyFrequency(newDays.length);
    }
  };

  // Actualizar los días de entrenamiento cuando cambia la frecuencia
  const handleFrequencyChange = (newFrequency) => {
    setWeeklyFrequency(newFrequency);
    
    // Ajustar los días de entrenamiento según la frecuencia
    let newDays = [];
    
    if (newFrequency === 1) {
      newDays = [3]; // Miércoles
    } else if (newFrequency === 2) {
      newDays = [1, 4]; // Lunes, Jueves
    } else if (newFrequency === 3) {
      newDays = [1, 3, 5]; // Lunes, Miércoles, Viernes
    } else if (newFrequency === 4) {
      newDays = [1, 3, 5, 6]; // Lunes, Miércoles, Viernes, Sábado
    } else if (newFrequency === 5) {
      newDays = [1, 2, 3, 4, 5]; // Lunes a Viernes
    } else if (newFrequency === 6) {
      newDays = [1, 2, 3, 4, 5, 6]; // Lunes a Sábado
    } else if (newFrequency === 7) {
      newDays = [0, 1, 2, 3, 4, 5, 6]; // Todos los días
    }
    
    setTrainingDays(newDays);
    
    // Sugerir un split adecuado para la frecuencia
    if (newFrequency <= 3) {
      setSplitConfiguration('fullbody');
    } else if (newFrequency === 4) {
      setSplitConfiguration('upper_lower');
    } else if (newFrequency === 6) {
      setSplitConfiguration('push_pull_legs');
    } else if (newFrequency >= 5) {
      setSplitConfiguration('bro');
    }
  };

  return (
    <div>
      {/* Frecuencia semanal */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Frecuencia semanal
        </label>
        <select
          value={weeklyFrequency}
          onChange={(e) => handleFrequencyChange(parseInt(e.target.value))}
          className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
        >
          <option value="1">1 día por semana</option>
          <option value="2">2 días por semana</option>
          <option value="3">3 días por semana</option>
          <option value="4">4 días por semana</option>
          <option value="5">5 días por semana</option>
          <option value="6">6 días por semana</option>
          <option value="7">7 días por semana</option>
        </select>
      </div>

      {/* Días de entrenamiento */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Días de entrenamiento
        </label>
        <div className="flex justify-between mb-2">
          {[0, 1, 2, 3, 4, 5, 6].map(day => (
            <button
              key={day}
              onClick={() => handleDayToggle(day)}
              className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                trainingDays.includes(day)
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
              title={fullDayNames[day]}
            >
              {dayNames[day]}
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Días seleccionados: {trainingDays.map(day => fullDayNames[day]).join(', ')}
        </p>
      </div>

      {/* Distribución de entrenamiento */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Distribución de entrenamiento
        </label>
        <div className="grid grid-cols-1 gap-3">
          {splitOptions.map(option => (
            <button
              key={option.id}
              onClick={() => setSplitConfiguration(option.id)}
              className={`flex items-center justify-between p-3 rounded-lg border ${
                splitConfiguration === option.id
                  ? 'bg-orange-50 border-orange-200 dark:bg-orange-900/30 dark:border-orange-700'
                  : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50'
              }`}
            >
              <div>
                <h3 className="font-medium text-gray-800 dark:text-white">{option.name}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">{option.description}</p>
                {option.recommendedFrequency && (
                  <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">
                    Frecuencia recomendada: {option.recommendedFrequency.join(', ')} días/semana
                  </p>
                )}
              </div>
              {splitConfiguration === option.id && (
                <span className="ml-auto w-6 h-6 flex items-center justify-center bg-orange-100 dark:bg-orange-800 rounded-full">
                  <svg className="w-4 h-4 text-orange-500 dark:text-orange-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Detalles del split seleccionado */}
      <div className="mt-4">
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-sm text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 flex items-center"
        >
          {showDetails ? 'Ocultar detalles' : 'Mostrar detalles'}
          <span className="ml-1">
            {showDetails ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
          </span>
        </button>

        {showDetails && (
          <div className="mt-3 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-100 dark:border-orange-800">
            <h4 className="font-medium text-gray-800 dark:text-white mb-2">{selectedOption.name}</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{selectedOption.details}</p>
            
            <h5 className="font-medium text-gray-700 dark:text-gray-300 text-sm mb-1">Ejemplo:</h5>
            <pre className="text-xs bg-white dark:bg-gray-800 p-2 rounded border border-gray-200 dark:border-gray-700 overflow-x-auto">
              {selectedOption.example}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default SplitConfig;
