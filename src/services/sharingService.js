import { v4 as uuidv4 } from 'uuid';
import { db, storage } from '../firebase';
import { doc, setDoc, getDoc, deleteDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import importExportService from './importExportService';

/**
 * Servicio para compartir planes de entrenamiento
 */
class SharingService {
  /**
   * Compartir un plan de entrenamiento
   * @param {Object} plan - Plan de entrenamiento a compartir
   * @param {Object} options - Opciones de compartición
   * @returns {Promise<Object>} - Información del plan compartido
   */
  async sharePlan(plan, options = {}) {
    try {
      if (!plan) {
        throw new Error('Se requiere un plan para compartir');
      }
      
      const {
        expirationDays = 30, // Días de validez del enlace
        includeProgress = false, // Incluir progreso registrado
        isPublic = false, // Compartir públicamente
        password = null, // Contraseña para acceder al plan (opcional)
        description = '', // Descripción adicional
        tags = [] // Etiquetas para búsqueda
      } = options;
      
      // Generar un ID único para el plan compartido
      const shareId = uuidv4();
      
      // Preparar el plan para compartir (eliminar datos sensibles o innecesarios)
      const planToShare = this._preparePlanForSharing(plan, includeProgress);
      
      // Convertir el plan a JSON
      const planJson = importExportService.exportPlanToJson(planToShare);
      
      // Calcular la fecha de expiración
      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + expirationDays);
      
      // Crear el documento en Firestore
      const shareData = {
        planId: plan.id,
        planName: plan.name,
        shareId,
        createdAt: new Date().toISOString(),
        expirationDate: expirationDate.toISOString(),
        isPublic,
        hasPassword: !!password,
        description,
        tags,
        downloads: 0,
        views: 0,
        ownerId: options.userId || null,
        ownerName: options.userName || 'Usuario anónimo'
      };
      
      // Guardar en Firestore
      await setDoc(doc(db, 'sharedPlans', shareId), shareData);
      
      // Si hay contraseña, guardarla en un documento separado por seguridad
      if (password) {
        await setDoc(doc(db, 'sharedPlansAuth', shareId), {
          password
        });
      }
      
      // Subir el JSON del plan a Storage
      const storageRef = ref(storage, `sharedPlans/${shareId}.json`);
      const blob = new Blob([planJson], { type: 'application/json' });
      await uploadBytes(storageRef, blob);
      
      // Obtener la URL de descarga
      const downloadUrl = await getDownloadURL(storageRef);
      
      // Actualizar el documento con la URL
      await setDoc(doc(db, 'sharedPlans', shareId), {
        downloadUrl
      }, { merge: true });
      
      // Devolver la información del plan compartido
      return {
        shareId,
        downloadUrl,
        expirationDate: expirationDate.toISOString(),
        shareUrl: `${window.location.origin}/shared/${shareId}`,
        ...shareData
      };
    } catch (error) {
      console.error('Error al compartir el plan:', error);
      throw error;
    }
  }
  
  /**
   * Obtener un plan compartido por su ID
   * @param {string} shareId - ID del plan compartido
   * @param {string} password - Contraseña (si es necesaria)
   * @returns {Promise<Object>} - Plan compartido
   */
  async getSharedPlan(shareId, password = null) {
    try {
      // Verificar si el plan existe
      const planDoc = await getDoc(doc(db, 'sharedPlans', shareId));
      
      if (!planDoc.exists()) {
        throw new Error('Plan compartido no encontrado');
      }
      
      const planData = planDoc.data();
      
      // Verificar si el plan ha expirado
      const expirationDate = new Date(planData.expirationDate);
      if (expirationDate < new Date()) {
        throw new Error('El enlace de compartición ha expirado');
      }
      
      // Verificar si el plan requiere contraseña
      if (planData.hasPassword) {
        // Obtener la contraseña almacenada
        const authDoc = await getDoc(doc(db, 'sharedPlansAuth', shareId));
        
        if (!authDoc.exists()) {
          throw new Error('Error de autenticación');
        }
        
        const authData = authDoc.data();
        
        // Verificar la contraseña
        if (!password || password !== authData.password) {
          throw new Error('Contraseña incorrecta');
        }
      }
      
      // Incrementar el contador de vistas
      await setDoc(doc(db, 'sharedPlans', shareId), {
        views: (planData.views || 0) + 1
      }, { merge: true });
      
      // Descargar el JSON del plan
      const response = await fetch(planData.downloadUrl);
      const planJson = await response.text();
      
      // Convertir el JSON a un objeto de plan
      const plan = importExportService.importPlanFromJson(planJson);
      
      return {
        plan,
        metadata: planData
      };
    } catch (error) {
      console.error('Error al obtener el plan compartido:', error);
      throw error;
    }
  }
  
  /**
   * Descargar un plan compartido
   * @param {string} shareId - ID del plan compartido
   * @returns {Promise<Object>} - Plan descargado
   */
  async downloadSharedPlan(shareId) {
    try {
      // Verificar si el plan existe
      const planDoc = await getDoc(doc(db, 'sharedPlans', shareId));
      
      if (!planDoc.exists()) {
        throw new Error('Plan compartido no encontrado');
      }
      
      const planData = planDoc.data();
      
      // Incrementar el contador de descargas
      await setDoc(doc(db, 'sharedPlans', shareId), {
        downloads: (planData.downloads || 0) + 1
      }, { merge: true });
      
      // Descargar el JSON del plan
      const response = await fetch(planData.downloadUrl);
      const planJson = await response.text();
      
      // Convertir el JSON a un objeto de plan
      const plan = importExportService.importPlanFromJson(planJson);
      
      return plan;
    } catch (error) {
      console.error('Error al descargar el plan compartido:', error);
      throw error;
    }
  }
  
  /**
   * Eliminar un plan compartido
   * @param {string} shareId - ID del plan compartido
   * @param {string} userId - ID del usuario propietario
   * @returns {Promise<void>}
   */
  async deleteSharedPlan(shareId, userId) {
    try {
      // Verificar si el plan existe
      const planDoc = await getDoc(doc(db, 'sharedPlans', shareId));
      
      if (!planDoc.exists()) {
        throw new Error('Plan compartido no encontrado');
      }
      
      const planData = planDoc.data();
      
      // Verificar si el usuario es el propietario
      if (planData.ownerId && planData.ownerId !== userId) {
        throw new Error('No tienes permiso para eliminar este plan compartido');
      }
      
      // Eliminar el documento de Firestore
      await deleteDoc(doc(db, 'sharedPlans', shareId));
      
      // Eliminar la autenticación si existe
      const authDoc = await getDoc(doc(db, 'sharedPlansAuth', shareId));
      if (authDoc.exists()) {
        await deleteDoc(doc(db, 'sharedPlansAuth', shareId));
      }
      
      // Eliminar el archivo de Storage
      const storageRef = ref(storage, `sharedPlans/${shareId}.json`);
      await deleteObject(storageRef);
    } catch (error) {
      console.error('Error al eliminar el plan compartido:', error);
      throw error;
    }
  }
  
  /**
   * Buscar planes compartidos públicamente
   * @param {Object} filters - Filtros de búsqueda
   * @returns {Promise<Array>} - Lista de planes compartidos
   */
  async searchSharedPlans(filters = {}) {
    try {
      const {
        tags = [],
        searchTerm = '',
        limit = 20
      } = filters;
      
      // Crear la consulta base
      let q = query(
        collection(db, 'sharedPlans'),
        where('isPublic', '==', true),
        where('expirationDate', '>', new Date().toISOString())
      );
      
      // Ejecutar la consulta
      const querySnapshot = await getDocs(q);
      
      // Filtrar los resultados
      let results = [];
      querySnapshot.forEach(doc => {
        const data = doc.data();
        
        // Filtrar por término de búsqueda
        if (searchTerm) {
          const searchLower = searchTerm.toLowerCase();
          const nameMatch = data.planName.toLowerCase().includes(searchLower);
          const descMatch = data.description.toLowerCase().includes(searchLower);
          
          if (!nameMatch && !descMatch) {
            return;
          }
        }
        
        // Filtrar por etiquetas
        if (tags.length > 0) {
          const hasAllTags = tags.every(tag => data.tags.includes(tag));
          if (!hasAllTags) {
            return;
          }
        }
        
        results.push({
          id: doc.id,
          ...data
        });
      });
      
      // Ordenar por fecha de creación (más recientes primero)
      results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      
      // Limitar resultados
      if (results.length > limit) {
        results = results.slice(0, limit);
      }
      
      return results;
    } catch (error) {
      console.error('Error al buscar planes compartidos:', error);
      throw error;
    }
  }
  
  /**
   * Obtener los planes compartidos por un usuario
   * @param {string} userId - ID del usuario
   * @returns {Promise<Array>} - Lista de planes compartidos
   */
  async getUserSharedPlans(userId) {
    try {
      if (!userId) {
        throw new Error('Se requiere un ID de usuario');
      }
      
      // Crear la consulta
      const q = query(
        collection(db, 'sharedPlans'),
        where('ownerId', '==', userId)
      );
      
      // Ejecutar la consulta
      const querySnapshot = await getDocs(q);
      
      // Procesar los resultados
      const results = [];
      querySnapshot.forEach(doc => {
        results.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      // Ordenar por fecha de creación (más recientes primero)
      results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      
      return results;
    } catch (error) {
      console.error('Error al obtener los planes compartidos del usuario:', error);
      throw error;
    }
  }
  
  /**
   * Preparar un plan para compartir
   * @param {Object} plan - Plan original
   * @param {boolean} includeProgress - Incluir progreso registrado
   * @returns {Object} - Plan preparado para compartir
   * @private
   */
  _preparePlanForSharing(plan, includeProgress = false) {
    // Crear una copia profunda del plan
    const sharedPlan = JSON.parse(JSON.stringify(plan));
    
    // Generar un nuevo ID para el plan compartido
    sharedPlan.id = uuidv4();
    
    // Marcar como plan compartido
    sharedPlan.isShared = true;
    sharedPlan.originalPlanId = plan.id;
    
    // Si no se incluye el progreso, eliminar los datos de progreso
    if (!includeProgress) {
      // Recorrer todos los microciclos, sesiones, ejercicios y series
      sharedPlan.microcycles.forEach(microcycle => {
        microcycle.trainingSessions.forEach(session => {
          session.exercises.forEach(exercise => {
            exercise.sets.forEach(set => {
              // Eliminar datos de progreso
              delete set.actualReps;
              delete set.actualWeight;
              delete set.completed;
              delete set.notes;
            });
          });
        });
      });
    }
    
    return sharedPlan;
  }
}

export default new SharingService();
