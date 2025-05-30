import create from 'zustand';
import { produce } from 'immer';
import { WorkoutService } from '../services/workoutService';

const useWorkoutStore = create((set) => ({
  workouts: [],
  currentPhase: 1,
  loading: false,
  error: null,

  setWorkouts: (workouts) => set({ workouts }),
  
  addWorkout: async (workout) => {
    try {
      set({ loading: true, error: null });
      const updatedWorkouts = await WorkoutService.saveWorkout(workout);
      set({ workouts: updatedWorkouts, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  updateProgress: async (workoutId, progress) => {
    try {
      set({ loading: true, error: null });
      const updatedWorkouts = await WorkoutService.updateWorkoutProgress(workoutId, progress);
      set({ workouts: updatedWorkouts, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  setPhase: (phase) => set({ currentPhase: phase }),

  clearError: () => set({ error: null })
}));

export default useWorkoutStore;