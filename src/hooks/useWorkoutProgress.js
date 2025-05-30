import { useState, useEffect } from 'react';
import { WorkoutService } from '../services/workoutService';

export function useWorkoutProgress(workoutId) {
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const calculateProgress = async () => {
      try {
        setLoading(true);
        const workouts = await WorkoutService.getWorkouts();
        const workout = workouts.find(w => w.id === workoutId);
        
        if (!workout) {
          throw new Error('Entrenamiento no encontrado');
        }

        const exercisesCompleted = workout.exercises.filter(e => e.completed).length;
        const totalExercises = workout.exercises.length;
        const calculatedProgress = Math.round((exercisesCompleted / totalExercises) * 100);
        
        setProgress(calculatedProgress);
        await WorkoutService.updateWorkoutProgress(workoutId, calculatedProgress);
      } catch (err) {
        setError(err);
        console.error('Error calculating progress:', err);
      } finally {
        setLoading(false);
      }
    };

    if (workoutId) {
      calculateProgress();
    }
  }, [workoutId]);

  return { progress, loading, error };
}