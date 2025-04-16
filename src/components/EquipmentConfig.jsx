import React, { useState } from 'react';
import { FaChevronDown, FaChevronUp, FaCheck, FaDumbbell, FaWeightHanging, FaRunning } from 'react-icons/fa';

/**
 * Componente para la configuración de equipamiento
 */
const EquipmentConfig = ({ 
  sessionDuration, 
  setSessionDuration,
  availableEquipment,
  setAvailableEquipment
}) => {
  const [showDetails, setShowDetails] = useState(false);

  // Opciones de equipamiento
  const equipmentOptions = [
    { 
      id: 'all', 
      name: 'Todo', 
      description: 'Acceso a todo tipo de equipamiento',
      icon: <FaDumbbell />,
      details: 'Selecciona esta opción si tienes acceso a un gimnasio completo con todo tipo de equipamiento: barras, mancuernas, máquinas, poleas, etc.'
    },
    { 
      id: 'barbell', 
      name: 'Barra', 
      description: 'Barras y discos',
      icon: <FaWeightHanging />,
      details: 'Barras olímpicas, barras EZ, barras fijas y discos de diferentes pesos.'
    },
    { 
      id: 'dumbbell', 
      name: 'Mancuernas', 
      description: 'Mancuernas de diferentes pesos',
      icon: <FaDumbbell />,
      details: 'Mancuernas de diferentes pesos, fijas o ajustables.'
    },
    { 
      id: 'machine', 
      name: 'Máquinas', 
      description: 'Máquinas de gimnasio',
      icon: <FaDumbbell />,
      details: 'Máquinas de gimnasio como prensa de piernas, extensiones de cuádriceps, curl femoral, etc.'
    },
    { 
      id: 'cable', 
      name: 'Poleas', 
      description: 'Sistemas de poleas',
      icon: <FaDumbbell />,
      details: 'Sistemas de poleas para ejercicios de tracción, empuje y aislamiento.'
    },
    { 
      id: 'bodyweight', 
      name: 'Peso corporal', 
      description: 'Ejercicios con el propio peso',
      icon: <FaRunning />,
      details: 'Ejercicios que utilizan el propio peso corporal como resistencia: flexiones, dominadas, sentadillas, etc.'
    },
    { 
      id: 'kettlebell', 
      name: 'Kettlebells', 
      description: 'Pesas rusas',
      icon: <FaDumbbell />,
      details: 'Pesas rusas (kettlebells) de diferentes pesos.'
    },
    { 
      id: 'bands', 
      name: 'Bandas', 
      description: 'Bandas elásticas de resistencia',
      icon: <FaDumbbell />,
      details: 'Bandas elásticas de resistencia de diferentes intensidades.'
    }
  ];

  // Manejar cambio en el equipamiento disponible
  const handleEquipmentToggle = (equipment) => {
    if (equipment === 'all') {
      // Si se selecciona "Todo", desmarcar los demás
      setAvailableEquipment(['all']);
    } else {
      // Si se selecciona un equipamiento específico
      if (availableEquipment.includes('all')) {
        // Si "Todo" estaba seleccionado, quitarlo
        setAvailableEquipment([equipment]);
      } else if (availableEquipment.includes(equipment)) {
        // Si ya está seleccionado, quitarlo (siempre que quede al menos uno)
        if (availableEquipment.length > 1) {
          setAvailableEquipment(availableEquipment.filter(e => e !== equipment));
        }
      } else {
        // Si no está seleccionado, añadirlo
        setAvailableEquipment([...availableEquipment, equipment]);
      }
    }
  };

  // Duración de sesión recomendada según equipamiento
  const getRecommendedDuration = () => {
    if (availableEquipment.includes('all') || availableEquipment.includes('machine')) {
      return 'Con acceso a máquinas, puedes optimizar el tiempo de entrenamiento. 45-60 minutos suele ser suficiente para una sesión efectiva.';
    } else if (availableEquipment.includes('barbell') || availableEquipment.includes('dumbbell')) {
      return 'Con pesos libres, las sesiones suelen requerir más tiempo para configuración y descansos. 60-75 minutos es una duración recomendada.';
    } else if (availableEquipment.includes('bodyweight')) {
      return 'Los entrenamientos con peso corporal pueden ser muy eficientes. 30-45 minutos de alta intensidad suelen ser suficientes.';
    } else {
      return 'La duración óptima depende de la intensidad y volumen planificados. 45-60 minutos es un buen punto de partida.';
    }
  };

  return (
    <div>
      {/* Duración de sesión */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Duración de sesión
        </label>
        <select
          value={sessionDuration}
          onChange={(e) => setSessionDuration(parseInt(e.target.value))}
          className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
        >
          <option value="30">30 minutos</option>
          <option value="45">45 minutos</option>
          <option value="60">60 minutos</option>
          <option value="75">75 minutos</option>
          <option value="90">90 minutos</option>
          <option value="120">120 minutos</option>
        </select>
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          {getRecommendedDuration()}
        </p>
      </div>

      {/* Equipamiento disponible */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Equipamiento disponible
        </label>
        <div className="grid grid-cols-2 gap-2 mb-2">
          {equipmentOptions.map(option => (
            <button
              key={option.id}
              onClick={() => handleEquipmentToggle(option.id)}
              className={`flex items-center p-2 rounded-lg border ${
                availableEquipment.includes(option.id)
                  ? 'bg-red-50 border-red-200 dark:bg-red-900/30 dark:border-red-700'
                  : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50'
              }`}
            >
              <span className={`mr-2 ${availableEquipment.includes(option.id) ? 'text-red-500' : 'text-gray-500'}`}>
                {option.icon}
              </span>
              <div>
                <h3 className="font-medium text-gray-800 dark:text-white text-sm">{option.name}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">{option.description}</p>
              </div>
              {availableEquipment.includes(option.id) && (
                <span className="ml-auto w-5 h-5 flex items-center justify-center bg-red-100 dark:bg-red-800 rounded-full">
                  <FaCheck className="text-red-500 dark:text-red-300 text-xs" />
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Detalles del equipamiento */}
      <div className="mt-4">
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 flex items-center"
        >
          {showDetails ? 'Ocultar detalles' : 'Mostrar detalles'}
          <span className="ml-1">
            {showDetails ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
          </span>
        </button>

        {showDetails && (
          <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-100 dark:border-red-800">
            <h4 className="font-medium text-gray-800 dark:text-white mb-2">Equipamiento seleccionado</h4>
            <ul className="space-y-2">
              {availableEquipment.map(eq => {
                const equipment = equipmentOptions.find(o => o.id === eq);
                return equipment ? (
                  <li key={eq} className="flex items-start">
                    <span className="mr-2 text-red-500 mt-0.5">{equipment.icon}</span>
                    <div>
                      <h5 className="font-medium text-gray-700 dark:text-gray-300">{equipment.name}</h5>
                      <p className="text-xs text-gray-600 dark:text-gray-400">{equipment.details}</p>
                    </div>
                  </li>
                ) : null;
              })}
            </ul>
            
            <div className="mt-3 p-2 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
              <h5 className="font-medium text-gray-700 dark:text-gray-300 text-sm mb-1">Recomendación:</h5>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {availableEquipment.includes('all') ? (
                  'Con acceso a todo el equipamiento, tu plan será muy versátil y podrás utilizar los ejercicios más efectivos para cada objetivo.'
                ) : availableEquipment.length > 3 ? (
                  'Tienes una buena variedad de equipamiento, lo que permitirá crear un plan diverso y efectivo.'
                ) : availableEquipment.includes('bodyweight') && availableEquipment.length === 1 ? (
                  'Con solo peso corporal, se enfatizarán ejercicios funcionales y circuitos de alta intensidad. Considera añadir bandas para mayor variedad.'
                ) : (
                  'Con el equipamiento seleccionado, tu plan se adaptará para maximizar los resultados. Considera añadir más variedad si es posible.'
                )}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EquipmentConfig;
