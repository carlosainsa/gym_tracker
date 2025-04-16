import React from 'react';
import { FaClock } from 'react-icons/fa';

const ExerciseDuration = ({ duration }) => {
  const formatTime = (seconds) => {
    if (!seconds) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="flex items-center justify-center py-2 text-gray-600">
      <FaClock className="mr-2 text-primary-500" size={14} />
      <span className="font-medium">Duración del ejercicio: </span>
      <span className="ml-1 font-bold">{formatTime(duration)}</span>
    </div>
  );
};

export default ExerciseDuration;
