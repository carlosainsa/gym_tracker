import React, { useState, useEffect } from 'react';
import { FaChevronDown, FaChevronUp, FaCheck, FaClock, FaInfoCircle, FaPlay, FaYoutube } from 'react-icons/fa';
import AdvancedSetRecorder from './AdvancedSetRecorder';

/**
 * Componente para registrar ejercicios con temporizador
 */
const AdvancedExerciseRecorder = ({ 
  exercise, 
  onExerciseComplete,
  index,
  autoStartTimers = false
}) => {
  const [expanded, setExpanded] = useState(true);
  const [completedSets, setCompletedSets] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [duration, setDuration] = useState(0);
  const [showInfo, setShowInfo] = useState(false);
  
  // Determinar si es un ejercicio basado en tiempo
  const isTimeBased = exercise.isTimeBased || 
                      (exercise.sets && 
                       exercise.sets.length > 0 && 
                       exercise.sets[0].reps && 
                       exercise.sets[0].reps.toString().includes('seg'));
  
  // Extraer tiempo de descanso en segundos
  const restTime = exercise.rest ? extractTimeInSeconds(exercise.rest) : 60;
  
  // Extraer tiempo en segundos de una cadena (ej: "60 seg" -> 60)
  function extractTimeInSeconds(timeString) {
    if (!timeString) return 60;
    
    const match = timeString.toString().match(/(\d+)/);
    return match ? parseInt(match[1]) : 60;
  }

  // Manejar completado de una serie
  const handleSetComplete = (completedSet, setIndex) => {
    // Actualizar el array de series
    const updatedSets = [...exercise.sets];
    updatedSets[setIndex] = completedSet;
    
    // Actualizar el contador de series completadas
    setCompletedSets(prevCount => {
      const newCount = prevCount + 1;
      
      // Si todas las series están completadas, marcar el ejercicio como completado
      if (newCount === exercise.sets.length) {
        setEndTime(new Date());
        
        // Calcular la duración total del ejercicio
        const exerciseDuration = Math.floor((new Date() - startTime) / 1000);
        setDuration(exerciseDuration);
        
        // Notificar que el ejercicio está completado
        onExerciseComplete({
          ...exercise,
          sets: updatedSets,
          isCompleted: true,
          completedAt: new Date().toISOString(),
          duration: exerciseDuration
        }, index);
      }
      
      return newCount;
    });
  };

  // Inicializar el tiempo de inicio cuando se monta el componente
  useEffect(() => {
    if (!startTime) {
      setStartTime(new Date());
    }
    
    // Inicializar el contador de series completadas
    if (exercise.sets) {
      const completed = exercise.sets.filter(set => set.isCompleted).length;
      setCompletedSets(completed);
    }
  }, []);

  // Calcular el progreso del ejercicio
  const calculateProgress = () => {
    if (!exercise.sets || exercise.sets.length === 0) return 0;
    return Math.round((completedSets / exercise.sets.length) * 100);
  };

  // Formatear el tiempo en minutos:segundos
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden mb-4 border border-gray-200 dark:border-gray-700">
      {/* Encabezado del ejercicio */}
      <div 
        className="p-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600 flex items-center justify-between cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center">
          <div className="w-8 h-8 flex items-center justify-center bg-primary-100 dark:bg-primary-900 rounded-full text-primary-600 dark:text-primary-400 font-medium">
            {index + 1}
          </div>
          <div className="ml-3">
            <h3 className="font-medium text-gray-800 dark:text-white">{exercise.name}</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {exercise.muscleGroups?.join(', ')} • {exercise.sets?.length} series
              {exercise.rest && ` • Descanso: ${exercise.rest}`}
            </p>
          </div>
        </div>
        <div className="flex items-center">
          <div className="mr-3">
            <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5 w-16">
              <div 
                className="bg-primary-600 h-2.5 rounded-full" 
                style={{ width: `${calculateProgress()}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 text-right mt-1">
              {completedSets}/{exercise.sets?.length} series
            </p>
          </div>
          {expanded ? <FaChevronUp className="text-gray-400" /> : <FaChevronDown className="text-gray-400" />}
        </div>
      </div>

      {/* Contenido del ejercicio */}
      {expanded && (
        <div className="p-4">
          {/* Información del ejercicio */}
          <div className="mb-4 flex justify-between items-start">
            <div>
              <div className="flex items-center mb-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowInfo(!showInfo);
                  }}
                  className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 mr-2"
                >
                  <FaInfoCircle />
                </button>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {isTimeBased ? 'Ejercicio basado en tiempo' : 'Ejercicio basado en repeticiones'}
                </span>
              </div>
              
              {duration > 0 && (
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <FaClock className="mr-1" />
                  <span>Duración: {formatTime(duration)}</span>
                </div>
              )}
            </div>
            
            {exercise.videoUrl && (
              <a
                href={exercise.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                onClick={(e) => e.stopPropagation()}
              >
                <FaYoutube className="mr-1" />
                Ver video
              </a>
            )}
          </div>
          
          {/* Información detallada */}
          {showInfo && (
            <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-sm">
              {exercise.description && (
                <p className="text-gray-600 dark:text-gray-300 mb-2">{exercise.description}</p>
              )}
              
              {exercise.notes && (
                <div className="mb-2">
                  <span className="font-medium text-gray-700 dark:text-gray-300">Notas: </span>
                  <span className="text-gray-600 dark:text-gray-400">{exercise.notes}</span>
                </div>
              )}
              
              {exercise.tempo && (
                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">Tempo: </span>
                  <span className="text-gray-600 dark:text-gray-400">{exercise.tempo}</span>
                </div>
              )}
            </div>
          )}
          
          {/* Series */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Series</h4>
            {exercise.sets?.map((set, setIndex) => (
              <AdvancedSetRecorder
                key={setIndex}
                set={set}
                index={setIndex}
                onSetComplete={handleSetComplete}
                isTimeBased={isTimeBased}
                restTime={restTime}
                autoStartTimer={autoStartTimers}
                isLastSet={setIndex === exercise.sets.length - 1}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedExerciseRecorder;
