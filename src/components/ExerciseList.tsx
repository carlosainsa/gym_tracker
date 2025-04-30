import React, { useState } from 'react';
import { useExercise } from '../hooks/useExercise';
import { Exercise } from '../types/models';
import { motion, AnimatePresence } from 'framer-motion';
import { FaDumbbell, FaSearch, FaFilter } from 'react-icons/fa';

export const ExerciseList: React.FC = () => {
  const {
    exercises,
    isLoading,
    error,
    filterByMuscleGroup,
    selectedMuscleGroup,
  } = useExercise();

  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const muscleGroups = [
    'Pecho',
    'Espalda',
    'Hombros',
    'Bíceps',
    'Tríceps',
    'Piernas',
    'Abdominales',
  ];

  const filteredExercises = exercises?.filter(exercise =>
    exercise.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) return <div className="flex justify-center p-8"><FaDumbbell className="animate-spin" /></div>;
  if (error) return <div className="text-red-500 p-4">Error al cargar ejercicios</div>;

  return (
    <div className="p-4">
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar ejercicios..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:ring-2"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="p-2 rounded-lg border hover:bg-gray-100"
        >
          <FaFilter />
        </button>
      </div>

      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mb-6"
          >
            <div className="flex flex-wrap gap-2">
              {muscleGroups.map(group => (
                <button
                  key={group}
                  onClick={() => filterByMuscleGroup(group === selectedMuscleGroup ? null : group)}
                  className={`px-4 py-2 rounded-full ${
                    group === selectedMuscleGroup
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 hover:bg-gray-300'
                  }`}
                >
                  {group}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredExercises?.map(exercise => (
          <motion.div
            key={exercise.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-md p-4"
          >
            <h3 className="text-lg font-semibold mb-2">{exercise.name}</h3>
            <p className="text-gray-600 mb-2">{exercise.description}</p>
            <div className="flex flex-wrap gap-2">
              {exercise.muscleGroups.map(muscle => (
                <span
                  key={muscle}
                  className="px-2 py-1 bg-gray-100 rounded-full text-sm"
                >
                  {muscle}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};