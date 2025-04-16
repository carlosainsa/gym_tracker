import React, { useState, useEffect, useRef } from 'react';
import { FaPlay, FaPause, FaStop, FaRedo, FaClock } from 'react-icons/fa';

/**
 * Componente de temporizador avanzado para el registro de entrenamientos
 */
const AdvancedTimer = ({ 
  initialTime = 60, 
  onComplete = () => {}, 
  autoStart = false,
  compact = false,
  onTimeUpdate = null,
  className = ''
}) => {
  const [time, setTime] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const intervalRef = useRef(null);
  const startTimeRef = useRef(null);
  const pausedTimeRef = useRef(0);

  // Iniciar el temporizador
  const startTimer = () => {
    if (isRunning) return;
    
    setIsRunning(true);
    setIsCompleted(false);
    
    // Guardar el tiempo de inicio
    startTimeRef.current = Date.now() - pausedTimeRef.current;
    
    // Iniciar el intervalo
    intervalRef.current = setInterval(() => {
      const elapsedTime = Math.floor((Date.now() - startTimeRef.current) / 1000);
      const remainingTime = Math.max(0, initialTime - elapsedTime);
      
      setTime(remainingTime);
      
      // Notificar sobre la actualización del tiempo si hay un callback
      if (onTimeUpdate) {
        onTimeUpdate(remainingTime);
      }
      
      // Si el tiempo llega a cero, detener el temporizador y notificar
      if (remainingTime === 0) {
        clearInterval(intervalRef.current);
        setIsRunning(false);
        setIsCompleted(true);
        onComplete();
      }
    }, 100);
  };

  // Pausar el temporizador
  const pauseTimer = () => {
    if (!isRunning) return;
    
    clearInterval(intervalRef.current);
    setIsRunning(false);
    
    // Guardar el tiempo transcurrido para continuar después
    pausedTimeRef.current = Date.now() - startTimeRef.current;
  };

  // Detener el temporizador
  const stopTimer = () => {
    clearInterval(intervalRef.current);
    setIsRunning(false);
    setTime(initialTime);
    pausedTimeRef.current = 0;
  };

  // Reiniciar el temporizador
  const resetTimer = () => {
    stopTimer();
    setIsCompleted(false);
  };

  // Formatear el tiempo en minutos:segundos
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Iniciar automáticamente si autoStart es true
  useEffect(() => {
    if (autoStart) {
      startTimer();
    }
    
    return () => {
      clearInterval(intervalRef.current);
    };
  }, [autoStart]);

  // Reiniciar el temporizador si cambia initialTime
  useEffect(() => {
    resetTimer();
  }, [initialTime]);

  // Versión compacta del temporizador
  if (compact) {
    return (
      <div className={`flex items-center ${className}`}>
        <div className={`text-sm font-medium ${isRunning ? 'text-green-500' : isCompleted ? 'text-red-500' : 'text-gray-600 dark:text-gray-400'}`}>
          {formatTime(time)}
        </div>
        <button
          onClick={isRunning ? pauseTimer : startTimer}
          className="ml-2 p-1 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          {isRunning ? <FaPause size={10} /> : <FaPlay size={10} />}
        </button>
      </div>
    );
  }

  // Versión completa del temporizador
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-3 ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <FaClock className="text-primary-500 mr-2" />
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Temporizador</h3>
        </div>
        <div className={`text-sm font-medium ${isRunning ? 'text-green-500' : isCompleted ? 'text-red-500' : 'text-gray-600 dark:text-gray-400'}`}>
          {isRunning ? 'Activo' : isCompleted ? 'Completado' : 'Listo'}
        </div>
      </div>
      
      <div className="flex items-center justify-center my-3">
        <div className={`text-3xl font-bold ${isRunning ? 'text-green-500' : isCompleted ? 'text-red-500' : 'text-gray-700 dark:text-gray-300'}`}>
          {formatTime(time)}
        </div>
      </div>
      
      <div className="flex justify-between">
        <button
          onClick={isRunning ? pauseTimer : startTimer}
          className={`flex-1 py-1 px-2 rounded-l-md text-white text-sm flex items-center justify-center ${
            isRunning 
              ? 'bg-yellow-500 hover:bg-yellow-600' 
              : 'bg-green-500 hover:bg-green-600'
          }`}
        >
          {isRunning ? <><FaPause className="mr-1" /> Pausar</> : <><FaPlay className="mr-1" /> Iniciar</>}
        </button>
        <button
          onClick={stopTimer}
          className="flex-1 py-1 px-2 bg-red-500 hover:bg-red-600 text-white text-sm flex items-center justify-center"
        >
          <FaStop className="mr-1" /> Detener
        </button>
        <button
          onClick={resetTimer}
          className="flex-1 py-1 px-2 rounded-r-md bg-blue-500 hover:bg-blue-600 text-white text-sm flex items-center justify-center"
        >
          <FaRedo className="mr-1" /> Reiniciar
        </button>
      </div>
    </div>
  );
};

export default AdvancedTimer;
