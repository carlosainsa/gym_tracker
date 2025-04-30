export interface Exercise {
  id: string;
  name: string;
  description: string;
  muscleGroups: string[];
  category: string;
  equipment: string;
  difficulty: 'Principiante' | 'Intermedio' | 'Avanzado';
  animation?: string;
  tips?: string[];
  videoUrl?: string;
  imageUrl?: string;
}

export interface WorkoutSet {
  reps: number;
  weight: number;
  timeInSeconds?: number;
  rpe?: number;
}

export interface WorkoutLog {
  id: string;
  exerciseId: string;
  date: Date;
  sets: WorkoutSet[];
  notes?: string;
}

export interface User {
  id: string;
  email: string;
  displayName?: string;
  preferences: {
    darkMode: boolean;
    language: string;
    units: 'metric' | 'imperial';
  };
}