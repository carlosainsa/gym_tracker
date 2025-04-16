import { 
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  query, 
  where, 
  getDocs,
  serverTimestamp,
  updateDoc,
  arrayUnion
} from 'firebase/firestore';
import { db } from '../config/firebase';

// Función para sincronizar los datos del usuario con Firestore
export const syncUserData = async (userId, data) => {
  try {
    // Referencia al documento del usuario
    const userDocRef = doc(db, 'users', userId);
    
    // Verificar si el documento existe
    const docSnap = await getDoc(userDocRef);
    
    if (docSnap.exists()) {
      // Actualizar el documento existente
      await updateDoc(userDocRef, {
        plan: data.plan,
        workoutLogs: data.workoutLogs,
        settings: data.settings,
        lastUpdated: serverTimestamp()
      });
    } else {
      // Crear un nuevo documento
      await setDoc(userDocRef, {
        plan: data.plan,
        workoutLogs: data.workoutLogs,
        settings: data.settings,
        createdAt: serverTimestamp(),
        lastUpdated: serverTimestamp()
      });
    }
    
    return true;
  } catch (error) {
    console.error('Error al sincronizar datos:', error);
    throw error;
  }
};

// Función para obtener los datos del usuario desde Firestore
export const getUserData = async (userId) => {
  try {
    // Referencia al documento del usuario
    const userDocRef = doc(db, 'users', userId);
    
    // Obtener el documento
    const docSnap = await getDoc(userDocRef);
    
    if (docSnap.exists()) {
      // Devolver los datos del usuario
      const userData = docSnap.data();
      return {
        plan: userData.plan || [],
        workoutLogs: userData.workoutLogs || { logs: [] },
        settings: userData.settings || {}
      };
    } else {
      // El usuario no tiene datos guardados
      return null;
    }
  } catch (error) {
    console.error('Error al obtener datos del usuario:', error);
    throw error;
  }
};

// Función para registrar un nuevo entrenamiento
export const logWorkout = async (userId, workoutLog) => {
  try {
    // Referencia al documento del usuario
    const userDocRef = doc(db, 'users', userId);
    
    // Actualizar el documento con el nuevo registro
    await updateDoc(userDocRef, {
      'workoutLogs.logs': arrayUnion(workoutLog),
      lastUpdated: serverTimestamp()
    });
    
    return true;
  } catch (error) {
    console.error('Error al registrar entrenamiento:', error);
    throw error;
  }
};

// Función para verificar si hay datos más recientes en la nube
export const checkForNewerData = async (userId, lastLocalUpdate) => {
  try {
    // Referencia al documento del usuario
    const userDocRef = doc(db, 'users', userId);
    
    // Obtener el documento
    const docSnap = await getDoc(userDocRef);
    
    if (docSnap.exists()) {
      const userData = docSnap.data();
      const cloudLastUpdated = userData.lastUpdated?.toDate();
      
      // Si no hay fecha de última actualización local, devolver true
      if (!lastLocalUpdate) return true;
      
      // Comparar fechas
      return cloudLastUpdated > new Date(lastLocalUpdate);
    }
    
    return false;
  } catch (error) {
    console.error('Error al verificar datos más recientes:', error);
    throw error;
  }
};

// Función para resolver conflictos de sincronización
export const resolveConflicts = (localData, cloudData) => {
  // Estrategia simple: combinar logs y usar la configuración más reciente
  const mergedLogs = [...new Set([
    ...(localData.workoutLogs?.logs || []),
    ...(cloudData.workoutLogs?.logs || [])
  ])];
  
  // Ordenar por fecha
  mergedLogs.sort((a, b) => new Date(b.date) - new Date(a.date));
  
  return {
    plan: cloudData.plan || localData.plan,
    workoutLogs: {
      logs: mergedLogs
    },
    settings: cloudData.settings || localData.settings
  };
};
