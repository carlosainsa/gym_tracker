import React, { useState, useEffect } from 'react';
import { FaCheck, FaClock, FaPlus, FaMinus, FaStopwatch } from 'react-icons/fa';
import AdvancedTimer from './AdvancedTimer';

/**
 * Componente para registrar series con temporizador automático
 */
const AdvancedSetRecorder = ({ 
  set, 
  index, 
  onSetComplete, 
  isTimeBased = false,
  restTime = 60,
  autoStartTimer = false,
  isLastSet = false
}) => {
  const [actualReps, setActualReps] = useState(set.actualReps || '');
  const [actualWeight, setActualWeight] = useState(set.actualWeight || '');
  const [actualTime, setActualTime] = useState(set.actualTime || '');
  const [isCompleted, setIsCompleted] = useState(set.isCompleted || false);
  const [showRestTimer, setShowRestTimer] = useState(false);
  const [timerDuration, setTimerDuration] = useState(isTimeBased ? extractTimeInSeconds(set.reps) : restTime);
  
  // Extraer tiempo en segundos de una cadena (ej: "30 seg" -> 30)
  function extractTimeInSeconds(timeString) {
    if (!timeString) return 60;
    
    const match = timeString.toString().match(/(\d+)/);
    return match ? parseInt(match[1]) : 60;
  }

  // Manejar cambio en repeticiones
  const handleRepsChange = (e) => {
    setActualReps(e.target.value);
  };

  // Manejar cambio en peso
  const handleWeightChange = (e) => {
    setActualWeight(e.target.value);
  };

  // Manejar cambio en tiempo
  const handleTimeChange = (e) => {
    setActualTime(e.target.value);
  };

  // Incrementar repeticiones
  const incrementReps = () => {
    const current = parseInt(actualReps) || 0;
    setActualReps((current + 1).toString());
  };

  // Decrementar repeticiones
  const decrementReps = () => {
    const current = parseInt(actualReps) || 0;
    if (current > 0) {
      setActualReps((current - 1).toString());
    }
  };

  // Incrementar peso
  const incrementWeight = () => {
    const current = parseFloat(actualWeight) || 0;
    setActualWeight((current + 2.5).toFixed(1));
  };

  // Decrementar peso
  const decrementWeight = () => {
    const current = parseFloat(actualWeight) || 0;
    if (current >= 2.5) {
      setActualWeight((current - 2.5).toFixed(1));
    }
  };

  // Marcar serie como completada
  const markAsCompleted = () => {
    const completedSet = {
      ...set,
      actualReps: isTimeBased ? null : actualReps,
      actualWeight: isTimeBased ? null : actualWeight,
      actualTime: isTimeBased ? actualTime : null,
      isCompleted: true,
      completedAt: new Date().toISOString()
    };
    
    setIsCompleted(true);
    onSetComplete(completedSet, index);
    
    // Mostrar temporizador de descanso si no es la última serie
    if (!isLastSet) {
      setShowRestTimer(true);
    }
  };

  // Manejar finalización del temporizador de descanso
  const handleRestTimerComplete = () => {
    setShowRestTimer(false);
  };

  // Manejar finalización del temporizador de ejercicio
  const handleExerciseTimerComplete = () => {
    if (isTimeBased) {
      setActualTime(timerDuration.toString());
      markAsCompleted();
    }
  };

  // Efecto para inicializar valores
  useEffect(() => {
    if (set.actualReps) setActualReps(set.actualReps);
    if (set.actualWeight) setActualWeight(set.actualWeight);
    if (set.actualTime) setActualTime(set.actualTime);
    if (set.isCompleted) setIsCompleted(set.isCompleted);
  }, [set]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-3 mb-3">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <div className="w-6 h-6 flex items-center justify-center bg-primary-100 dark:bg-primary-900 rounded-full text-primary-600 dark:text-primary-400 font-medium text-sm">
            {index + 1}
          </div>
          <h3 className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            Serie {index + 1}
          </h3>
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400">
          {isTimeBased ? (
            <>Objetivo: {set.reps}</>
          ) : (
            <>Objetivo: {set.reps} reps × {set.weight ? `${set.weight} kg` : 'Peso corporal'}</>
          )}
        </div>
      </div>

      {isTimeBased ? (
        // Interfaz para ejercicios basados en tiempo
        <div className="mb-3">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Tiempo
            </label>
            {!isCompleted && (
              <AdvancedTimer
                initialTime={timerDuration}
                onComplete={handleExerciseTimerComplete}
                autoStart={autoStartTimer}
                compact={true}
              />
            )}
          </div>
          
          {isCompleted ? (
            <div className="flex items-center">
              <div className="flex-1 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-center text-gray-800 dark:text-gray-200">
                {actualTime} segundos
              </div>
              <div className="ml-2 w-8 h-8 flex items-center justify-center bg-green-100 dark:bg-green-900 rounded-full">
                <FaCheck className="text-green-500 dark:text-green-400" />
              </div>
            </div>
          ) : (
            <div className="flex items-center">
              <input
                type="number"
                value={actualTime}
                onChange={handleTimeChange}
                placeholder="Tiempo en segundos"
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
              />
              <button
                onClick={markAsCompleted}
                className="ml-2 w-8 h-8 flex items-center justify-center bg-primary-100 dark:bg-primary-900 rounded-full text-primary-600 dark:text-primary-400 hover:bg-primary-200 dark:hover:bg-primary-800 transition-colors"
              >
                <FaCheck />
              </button>
            </div>
          )}
        </div>
      ) : (
        // Interfaz para ejercicios basados en repeticiones y peso
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Repeticiones
            </label>
            {isCompleted ? (
              <div className="px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-center text-gray-800 dark:text-gray-200">
                {actualReps}
              </div>
            ) : (
              <div className="flex">
                <button
                  onClick={decrementReps}
                  className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded-l-lg text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  <FaMinus size={12} />
                </button>
                <input
                  type="number"
                  value={actualReps}
                  onChange={handleRepsChange}
                  placeholder="Reps"
                  className="flex-1 px-3 py-1 border-t border-b border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-center text-gray-800 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                />
                <button
                  onClick={incrementReps}
                  className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded-r-lg text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  <FaPlus size={12} />
                </button>
              </div>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Peso (kg)
            </label>
            {isCompleted ? (
              <div className="px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-center text-gray-800 dark:text-gray-200">
                {actualWeight ? `${actualWeight} kg` : 'Peso corporal'}
              </div>
            ) : (
              <div className="flex">
                <button
                  onClick={decrementWeight}
                  className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded-l-lg text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  <FaMinus size={12} />
                </button>
                <input
                  type="number"
                  value={actualWeight}
                  onChange={handleWeightChange}
                  placeholder="Peso"
                  step="2.5"
                  className="flex-1 px-3 py-1 border-t border-b border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-center text-gray-800 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                />
                <button
                  onClick={incrementWeight}
                  className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded-r-lg text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  <FaPlus size={12} />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {!isCompleted && (
        <button
          onClick={markAsCompleted}
          className="w-full py-2 px-4 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors flex items-center justify-center"
        >
          <FaCheck className="mr-2" />
          Completar serie
        </button>
      )}

      {showRestTimer && (
        <div className="mt-3 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <FaStopwatch className="text-blue-500 mr-2" />
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Descanso</h4>
            </div>
            <button
              onClick={() => setShowRestTimer(false)}
              className="text-xs text-blue-600 dark:text-blue-400"
            >
              Omitir
            </button>
          </div>
          <AdvancedTimer
            initialTime={restTime}
            onComplete={handleRestTimerComplete}
            autoStart={true}
            className="bg-transparent border-0 shadow-none p-0"
          />
        </div>
      )}
    </div>
  );
};

export default AdvancedSetRecorder;
