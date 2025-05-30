import { produce } from 'immer';

export class WorkoutService {
  static validateWorkout(workout) {
    if (!workout) throw new Error('El entrenamiento es requerido');
    if (!workout.exercises?.length) throw new Error('El entrenamiento debe tener ejercicios');
    if (!workout.name?.trim()) throw new Error('El nombre del entrenamiento es requerido');
  }

  static async saveWorkout(workout) {
    try {
      this.validateWorkout(workout);
      
      const workouts = JSON.parse(localStorage.getItem('workouts') || '[]');
      const updatedWorkouts = produce(workouts, draft => {
        draft.push({ ...workout, id: Date.now(), createdAt: new Date().toISOString() });
      });
      
      localStorage.setItem('workouts', JSON.stringify(updatedWorkouts));
      return updatedWorkouts;
    } catch (error) {
      console.error('Error saving workout:', error);
      throw error;
    }
  }

  static async getWorkouts() {
    try {
      const workouts = JSON.parse(localStorage.getItem('workouts') || '[]');
      return workouts;
    } catch (error) {
      console.error('Error getting workouts:', error);
      throw error;
    }
  }

  static async updateWorkoutProgress(workoutId, progress) {
    try {
      const workouts = JSON.parse(localStorage.getItem('workouts') || '[]');
      const updatedWorkouts = produce(workouts, draft => {
        const workout = draft.find(w => w.id === workoutId);
        if (workout) {
          workout.progress = progress;
          workout.updatedAt = new Date().toISOString();
        }
      });
      
      localStorage.setItem('workouts', JSON.stringify(updatedWorkouts));
      return updatedWorkouts;
    } catch (error) {
      console.error('Error updating workout progress:', error);
      throw error;
    }
  }
}