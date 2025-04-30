import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { WorkoutLog, User } from '../types/models';
import { encryptData, decryptData } from '../utils/encryption';

export class SyncService {
  private readonly SYNC_COLLECTION = 'userSync';

  async syncUserData(userId: string, data: any): Promise<void> {
    try {
      const encryptedData = encryptData(data);
      const docRef = doc(db, this.SYNC_COLLECTION, userId);
      const syncDoc = await getDoc(docRef);

      if (syncDoc.exists()) {
        await updateDoc(docRef, {
          data: encryptedData,
          lastSync: new Date().toISOString()
        });
      } else {
        await setDoc(docRef, {
          data: encryptedData,
          lastSync: new Date().toISOString(),
          createdAt: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error('Error en sincronización:', error);
      throw new Error('Error al sincronizar datos');
    }
  }

  async getUserData(userId: string): Promise<any> {
    try {
      const docRef = doc(db, this.SYNC_COLLECTION, userId);
      const syncDoc = await getDoc(docRef);

      if (syncDoc.exists()) {
        const data = syncDoc.data();
        return decryptData(data.data);
      }
      return null;
    } catch (error) {
      console.error('Error al obtener datos:', error);
      throw new Error('Error al recuperar datos');
    }
  }

  async checkForNewerData(userId: string, lastLocalSync: string): Promise<boolean> {
    try {
      const docRef = doc(db, this.SYNC_COLLECTION, userId);
      const syncDoc = await getDoc(docRef);

      if (syncDoc.exists()) {
        const cloudLastSync = syncDoc.data().lastSync;
        return new Date(cloudLastSync) > new Date(lastLocalSync);
      }
      return false;
    } catch (error) {
      console.error('Error al verificar datos:', error);
      throw new Error('Error al verificar actualización de datos');
    }
  }
}

export const syncService = new SyncService();