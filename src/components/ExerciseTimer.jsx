import React, { useState, useEffect, useRef } from 'react';
import { FaPlay, FaStop } from 'react-icons/fa';

const ExerciseTimer = ({ onComplete }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const intervalRef = useRef(null);
  const startTimeRef = useRef(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const startTimer = () => {
    if (!isRunning) {
      setIsRunning(true);
      startTimeRef.current = Date.now() - (elapsedTime * 1000);
      intervalRef.current = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTimeRef.current) / 1000));
      }, 100);
    }
  };

  const stopTimer = () => {
    if (isRunning) {
      clearInterval(intervalRef.current);
      setIsRunning(false);
      onComplete(elapsedTime);
    }
  };

  return (
    <div className="w-full h-10 flex items-center justify-between bg-white rounded-lg border border-gray-200">
      <div className="text-lg font-bold text-center flex-1">{formatTime(elapsedTime)}</div>
      {!isRunning ? (
        <button
          onClick={startTimer}
          className="h-full px-3 bg-green-600 text-white rounded-r-lg hover:bg-green-700 transition-all flex items-center justify-center"
        >
          <FaPlay size={12} className="mr-1" /> Iniciar
        </button>
      ) : (
        <button
          onClick={stopTimer}
          className="h-full px-3 bg-red-600 text-white rounded-r-lg hover:bg-red-700 transition-all flex items-center justify-center"
        >
          <FaStop size={12} className="mr-1" /> Detener
        </button>
      )}
    </div>
  );
};

export default ExerciseTimer;
