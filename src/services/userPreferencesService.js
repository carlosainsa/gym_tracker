import { UserPreferences, TrainingPreferences, UIPreferences, NotificationPreferences, HealthData } from '../models/UserPreferences';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

/**
 * Servicio para gestionar las preferencias de usuario
 */
class UserPreferencesService {
  /**
   * Carga las preferencias del usuario desde localStorage
   * @returns {UserPreferences} - Preferencias del usuario
   */
  loadFromLocalStorage() {
    // Recopilar todas las preferencias almacenadas en localStorage
    const legacySettings = {
      darkMode: localStorage.getItem('darkMode'),
      language: localStorage.getItem('language'),
      notificationsEnabled: localStorage.getItem('notificationsEnabled'),
      notificationSettings: localStorage.getItem('notificationSettings'),
      reminderTime: localStorage.getItem('reminderTime'),
      currentPhase: localStorage.getItem('currentPhase')
    };
    
    return UserPreferences.fromLegacyPreferences(legacySettings);
  }

  /**
   * Guarda las preferencias del usuario en localStorage
   * @param {UserPreferences} preferences - Preferencias del usuario
   */
  saveToLocalStorage(preferences) {
    // Convertir al formato antiguo para compatibilidad
    const legacyFormat = preferences.toLegacyFormat();
    
    // Guardar en localStorage
    Object.entries(legacyFormat).forEach(([key, value]) => {
      localStorage.setItem(key, value);
    });
  }

  /**
   * Carga las preferencias del usuario desde Firestore
   * @param {string} userId - ID del usuario
   * @returns {Promise<UserPreferences>} - Preferencias del usuario
   */
  async loadFromFirestore(userId) {
    try {
      // Referencia al documento del usuario
      const userDocRef = doc(db, 'users', userId);
      
      // Obtener el documento
      const docSnap = await getDoc(userDocRef);
      
      if (docSnap.exists() && docSnap.data().preferences) {
        // Convertir los datos de Firestore a un objeto UserPreferences
        const preferencesData = docSnap.data().preferences;
        
        return new UserPreferences({
          id: preferencesData.id,
          userId: userId,
          trainingPreferences: new TrainingPreferences(preferencesData.trainingPreferences || {}),
          uiPreferences: new UIPreferences(preferencesData.uiPreferences || {}),
          notificationPreferences: new NotificationPreferences(preferencesData.notificationPreferences || {}),
          equipmentAvailable: preferencesData.equipmentAvailable || [],
          healthData: new HealthData(preferencesData.healthData || {}),
          createdAt: preferencesData.createdAt ? new Date(preferencesData.createdAt) : new Date(),
          updatedAt: preferencesData.updatedAt ? new Date(preferencesData.updatedAt) : new Date(),
          version: preferencesData.version || '1.0'
        });
      } else {
        // No hay preferencias guardadas, crear unas por defecto
        return this.loadFromLocalStorage();
      }
    } catch (error) {
      console.error('Error al cargar preferencias desde Firestore:', error);
      // En caso de error, usar las preferencias locales
      return this.loadFromLocalStorage();
    }
  }

  /**
   * Guarda las preferencias del usuario en Firestore
   * @param {string} userId - ID del usuario
   * @param {UserPreferences} preferences - Preferencias del usuario
   * @returns {Promise<boolean>} - Resultado de la operación
   */
  async saveToFirestore(userId, preferences) {
    try {
      // Actualizar la fecha de modificación
      preferences.updatedAt = new Date();
      
      // Referencia al documento del usuario
      const userDocRef = doc(db, 'users', userId);
      
      // Verificar si el documento existe
      const docSnap = await getDoc(userDocRef);
      
      if (docSnap.exists()) {
        // Actualizar el documento existente
        await updateDoc(userDocRef, {
          preferences: this._toFirestoreFormat(preferences),
          lastUpdated: new Date()
        });
      } else {
        // Crear un nuevo documento
        await setDoc(userDocRef, {
          preferences: this._toFirestoreFormat(preferences),
          createdAt: new Date(),
          lastUpdated: new Date()
        });
      }
      
      return true;
    } catch (error) {
      console.error('Error al guardar preferencias en Firestore:', error);
      return false;
    }
  }

  /**
   * Convierte un objeto UserPreferences a formato Firestore
   * @param {UserPreferences} preferences - Preferencias del usuario
   * @returns {Object} - Objeto en formato Firestore
   * @private
   */
  _toFirestoreFormat(preferences) {
    // Convertir fechas a formato ISO para Firestore
    return {
      ...preferences,
      createdAt: preferences.createdAt.toISOString(),
      updatedAt: preferences.updatedAt.toISOString()
    };
  }

  /**
   * Actualiza una preferencia específica
   * @param {UserPreferences} preferences - Preferencias actuales
   * @param {string} category - Categoría de la preferencia (training, ui, notification, health)
   * @param {string} key - Clave de la preferencia
   * @param {any} value - Nuevo valor
   * @returns {UserPreferences} - Preferencias actualizadas
   */
  updatePreference(preferences, category, key, value) {
    // Crear una copia de las preferencias
    const updatedPreferences = { ...preferences };
    
    // Actualizar la preferencia específica
    switch (category) {
      case 'training':
        updatedPreferences.trainingPreferences = {
          ...updatedPreferences.trainingPreferences,
          [key]: value
        };
        break;
      case 'ui':
        updatedPreferences.uiPreferences = {
          ...updatedPreferences.uiPreferences,
          [key]: value
        };
        break;
      case 'notification':
        updatedPreferences.notificationPreferences = {
          ...updatedPreferences.notificationPreferences,
          [key]: value
        };
        break;
      case 'health':
        updatedPreferences.healthData = {
          ...updatedPreferences.healthData,
          [key]: value
        };
        break;
      case 'equipment':
        updatedPreferences.equipmentAvailable = value;
        break;
      default:
        // Si la categoría no existe, actualizar directamente
        updatedPreferences[key] = value;
    }
    
    // Actualizar la fecha de modificación
    updatedPreferences.updatedAt = new Date();
    
    return updatedPreferences;
  }
}

export default new UserPreferencesService();
