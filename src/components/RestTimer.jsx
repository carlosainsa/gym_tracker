import React, { useState, useEffect } from 'react';
import { FaStopwatch } from 'react-icons/fa';

const RestTimer = ({ duration = 60, onComplete, isActive = true }) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    let timer;

    console.log('RestTimer - timeLeft:', timeLeft, 'isActive:', isActive, 'isCompleted:', isCompleted);

    if (isActive && timeLeft > 0) {
      timer = setTimeout(() => {
        setTimeLeft(prevTime => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0 && !isCompleted) {
      setIsCompleted(true);
      console.log('RestTimer - Temporizador completado');
      if (onComplete) onComplete();
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [timeLeft, isActive, isCompleted, onComplete]);

  // Calcular el porcentaje de tiempo restante para la barra de progreso
  const progressPercentage = (timeLeft / duration) * 100;

  // Formatear el tiempo restante en minutos:segundos
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="my-2 p-3 bg-blue-50 rounded-lg border border-blue-200 shadow-sm">
      {isCompleted ? (
        <div className="flex items-center justify-center py-1">
          <div className="text-green-600 font-medium text-sm text-center">
            ¡Listos para la próxima serie!
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center text-gray-700">
              <FaStopwatch className="mr-1 text-primary-500" />
              <span className="font-medium text-sm">Descanso</span>
            </div>
            <div className="text-gray-700 font-mono text-sm font-medium">{formatTime(timeLeft)}</div>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary-600 h-2 rounded-full transition-all duration-1000 ease-linear"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </>
      )}
    </div>
  );
};

export default RestTimer;
