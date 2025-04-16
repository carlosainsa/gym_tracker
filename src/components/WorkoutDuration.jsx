import React from 'react';
import { FaClock } from 'react-icons/fa';

const WorkoutDuration = ({ duration }) => {
  const formatTime = (seconds) => {
    if (!seconds) return '00:00';
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hrs > 0) {
      return `${hrs}:${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
    } else {
      return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }
  };

  return (
    <div className="bg-gray-50 rounded-lg p-4 mb-4 border border-gray-200 shadow-sm">
      <div className="flex items-center justify-center">
        <FaClock className="mr-2 text-primary-600" size={18} />
        <span className="text-lg font-medium">Tiempo total del entrenamiento: </span>
        <span className="ml-2 text-xl font-bold text-primary-700">{formatTime(duration)}</span>
      </div>
    </div>
  );
};

export default WorkoutDuration;
