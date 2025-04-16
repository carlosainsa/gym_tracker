import React, { useState } from 'react';
import { FaChevronDown, FaChevronUp, FaCheck, FaDumbbell, FaWeight, FaRunning, FaFire, FaHeartbeat } from 'react-icons/fa';

/**
 * Componente para la configuración de objetivos
 */
const GoalConfig = ({ 
  primaryGoal, 
  setPrimaryGoal,
  secondaryGoals,
  setSecondaryGoals
}) => {
  const [showDetails, setShowDetails] = useState(false);

  // Opciones de objetivos
  const goalOptions = [
    { 
      id: 'hypertrophy', 
      name: 'Hipertrofia', 
      description: 'Aumento de masa muscular', 
      icon: <FaDumbbell />,
      details: 'La hipertrofia se enfoca en el crecimiento del tamaño muscular. Implica series de moderada a alta repetición (8-12 reps) con pesos moderados (65-75% de 1RM) y descansos cortos a moderados (60-90 segundos). Se enfatiza la conexión mente-músculo y técnicas como series hasta el fallo, drop sets y supersets.',
      metrics: 'Medidas corporales, peso corporal, fotos de progreso',
      timeframe: 'Resultados visibles en 8-12 semanas con entrenamiento y nutrición adecuados'
    },
    { 
      id: 'strength', 
      name: 'Fuerza', 
      description: 'Aumento de fuerza máxima', 
      icon: <FaWeight />,
      details: 'El entrenamiento de fuerza se centra en aumentar la capacidad para levantar cargas pesadas. Implica series de baja repetición (1-6 reps) con pesos altos (80-95% de 1RM) y descansos largos (3-5 minutos). Se priorizan ejercicios compuestos como sentadillas, peso muerto, press de banca y press militar.',
      metrics: 'Aumento en 1RM, progresión de cargas en ejercicios principales',
      timeframe: 'Mejoras notables en 4-8 semanas, con ganancias continuas durante meses o años'
    },
    { 
      id: 'endurance', 
      name: 'Resistencia', 
      description: 'Mejora de la resistencia muscular', 
      icon: <FaRunning />,
      details: 'La resistencia muscular permite mantener esfuerzos por períodos prolongados. Implica series de alta repetición (15-30+ reps) con pesos ligeros (50-65% de 1RM) y descansos cortos (30-60 segundos). Se utilizan circuitos, HIIT, y entrenamiento en densidad para mejorar la capacidad aeróbica y anaeróbica.',
      metrics: 'Capacidad para completar más repeticiones con un peso dado, menor fatiga entre series',
      timeframe: 'Mejoras perceptibles en 2-4 semanas, con adaptaciones significativas en 8-12 semanas'
    },
    { 
      id: 'fat_loss', 
      name: 'Pérdida de grasa', 
      description: 'Reducción de grasa corporal', 
      icon: <FaFire />,
      details: 'El entrenamiento para pérdida de grasa maximiza el gasto calórico y el efecto EPOC (consumo de oxígeno post-ejercicio). Combina entrenamiento de resistencia con alta densidad de trabajo, circuitos, y cardio HIIT. Se enfoca en mantener la masa muscular mientras se crea un déficit calórico.',
      metrics: 'Reducción de medidas, porcentaje de grasa corporal, peso corporal',
      timeframe: 'Resultados visibles en 4-8 semanas con entrenamiento y nutrición adecuados'
    },
    { 
      id: 'general_fitness', 
      name: 'Fitness general', 
      description: 'Mejora de la condición física general', 
      icon: <FaHeartbeat />,
      details: 'El fitness general busca un equilibrio entre todos los componentes de la aptitud física: fuerza, resistencia, flexibilidad y composición corporal. Utiliza entrenamiento variado que incluye pesos, cardio, movilidad y ejercicios funcionales para mejorar la salud general y el rendimiento en actividades cotidianas.',
      metrics: 'Mejoras en fuerza, resistencia, flexibilidad, composición corporal y bienestar general',
      timeframe: 'Mejoras continuas a lo largo del tiempo, con cambios notables en 8-12 semanas'
    }
  ];

  // Manejar cambio en los objetivos secundarios
  const handleSecondaryGoalToggle = (goal) => {
    if (secondaryGoals.includes(goal)) {
      // Si ya está seleccionado, quitarlo
      setSecondaryGoals(secondaryGoals.filter(g => g !== goal));
    } else {
      // Si no está seleccionado, añadirlo (máximo 2)
      if (secondaryGoals.length < 2) {
        setSecondaryGoals([...secondaryGoals, goal]);
      }
    }
  };

  // Obtener la opción seleccionada
  const selectedOption = goalOptions.find(goal => goal.id === primaryGoal) || goalOptions[0];

  return (
    <div>
      {/* Objetivo principal */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Objetivo principal
        </label>
        <div className="grid grid-cols-1 gap-3">
          {goalOptions.map(goal => (
            <button
              key={goal.id}
              onClick={() => setPrimaryGoal(goal.id)}
              className={`flex items-center justify-between p-3 rounded-lg border ${
                primaryGoal === goal.id
                  ? 'bg-blue-50 border-blue-200 dark:bg-blue-900/30 dark:border-blue-700'
                  : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50'
              }`}
            >
              <div className="flex items-center">
                <span className={`mr-3 ${primaryGoal === goal.id ? 'text-blue-500 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}`}>
                  {goal.icon}
                </span>
                <div>
                  <h3 className="font-medium text-gray-800 dark:text-white">{goal.name}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{goal.description}</p>
                </div>
              </div>
              {primaryGoal === goal.id && (
                <span className="w-6 h-6 flex items-center justify-center bg-blue-100 dark:bg-blue-800 rounded-full">
                  <FaCheck className="text-blue-500 dark:text-blue-300 text-xs" />
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Objetivos secundarios */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Objetivos secundarios (máx. 2)
        </label>
        <div className="grid grid-cols-1 gap-3">
          {goalOptions.filter(goal => goal.id !== primaryGoal).map(goal => (
            <button
              key={goal.id}
              onClick={() => handleSecondaryGoalToggle(goal.id)}
              className={`flex items-center justify-between p-3 rounded-lg border ${
                secondaryGoals.includes(goal.id)
                  ? 'bg-green-50 border-green-200 dark:bg-green-900/30 dark:border-green-700'
                  : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50'
              }`}
              disabled={!secondaryGoals.includes(goal.id) && secondaryGoals.length >= 2}
            >
              <div className="flex items-center">
                <span className={`mr-3 ${secondaryGoals.includes(goal.id) ? 'text-green-500 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
                  {goal.icon}
                </span>
                <div>
                  <h3 className="font-medium text-gray-800 dark:text-white">{goal.name}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{goal.description}</p>
                </div>
              </div>
              {secondaryGoals.includes(goal.id) && (
                <span className="w-6 h-6 flex items-center justify-center bg-green-100 dark:bg-green-800 rounded-full">
                  <FaCheck className="text-green-500 dark:text-green-300 text-xs" />
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Detalles del objetivo principal */}
      <div className="mt-4">
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center"
        >
          {showDetails ? 'Ocultar detalles' : 'Mostrar detalles del objetivo principal'}
          <span className="ml-1">
            {showDetails ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
          </span>
        </button>

        {showDetails && (
          <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
            <h4 className="font-medium text-gray-800 dark:text-white mb-2 flex items-center">
              <span className="mr-2 text-blue-500">{selectedOption.icon}</span>
              {selectedOption.name}
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{selectedOption.details}</p>
            
            <div className="grid grid-cols-1 gap-3 text-sm">
              <div className="p-2 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
                <h5 className="font-medium text-gray-700 dark:text-gray-300 mb-1">Métricas de progreso:</h5>
                <p className="text-xs text-gray-600 dark:text-gray-400">{selectedOption.metrics}</p>
              </div>
              
              <div className="p-2 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
                <h5 className="font-medium text-gray-700 dark:text-gray-300 mb-1">Tiempo estimado:</h5>
                <p className="text-xs text-gray-600 dark:text-gray-400">{selectedOption.timeframe}</p>
              </div>
              
              {secondaryGoals.length > 0 && (
                <div className="p-2 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
                  <h5 className="font-medium text-gray-700 dark:text-gray-300 mb-1">Combinación de objetivos:</h5>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {primaryGoal === 'hypertrophy' && secondaryGoals.includes('strength') ? 
                      'La combinación de hipertrofia y fuerza es ideal para maximizar tanto el tamaño como la capacidad funcional del músculo. Se alternarán fases de volumen moderado/alta repetición con fases de alta intensidad/baja repetición.' :
                     primaryGoal === 'strength' && secondaryGoals.includes('hypertrophy') ?
                      'La combinación de fuerza e hipertrofia permite desarrollar músculos más grandes y funcionales. Se priorizarán ejercicios compuestos pesados complementados con trabajo de aislamiento para desarrollo muscular.' :
                     primaryGoal === 'fat_loss' && (secondaryGoals.includes('hypertrophy') || secondaryGoals.includes('strength')) ?
                      'Combinar pérdida de grasa con desarrollo muscular/fuerza permite mejorar la composición corporal, aumentando el metabolismo basal mientras se reduce grasa.' :
                     primaryGoal === 'endurance' && secondaryGoals.includes('strength') ?
                      'La combinación de resistencia y fuerza mejora el rendimiento general, permitiendo mantener esfuerzos prolongados con mayor potencia.' :
                      'Esta combinación de objetivos creará un plan equilibrado que abordará múltiples aspectos de tu condición física simultáneamente.'}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GoalConfig;
