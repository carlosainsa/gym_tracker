import { collection, query, where, getDocs, addDoc, updateDoc, doc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Exercise, WorkoutSet } from '../types/models';

export class ExerciseService {
  private readonly COLLECTION = 'exercises';

  async getExercises(): Promise<Exercise[]> {
    try {
      const exercisesRef = collection(db, this.COLLECTION);
      const snapshot = await getDocs(exercisesRef);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Exercise));
    } catch (error) {
      console.error('Error al obtener ejercicios:', error);
      throw new Error('Error al cargar ejercicios');
    }
  }

  async getExercisesByMuscleGroup(muscleGroup: string): Promise<Exercise[]> {
    try {
      const exercisesRef = collection(db, this.COLLECTION);
      const q = query(exercisesRef, where('muscleGroups', 'array-contains', muscleGroup));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Exercise));
    } catch (error) {
      console.error('Error al obtener ejercicios por grupo muscular:', error);
      throw new Error('Error al filtrar ejercicios');
    }
  }

  async addExercise(exercise: Omit<Exercise, 'id'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, this.COLLECTION), exercise);
      return docRef.id;
    } catch (error) {
      console.error('Error al añadir ejercicio:', error);
      throw new Error('Error al crear ejercicio');
    }
  }

  async updateExercise(id: string, exercise: Partial<Exercise>): Promise<void> {
    try {
      const exerciseRef = doc(db, this.COLLECTION, id);
      await updateDoc(exerciseRef, exercise);
    } catch (error) {
      console.error('Error al actualizar ejercicio:', error);
      throw new Error('Error al actualizar ejercicio');
    }
  }
}

export const exerciseService = new ExerciseService();