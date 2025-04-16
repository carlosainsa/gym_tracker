import React, { useState, useEffect } from 'react';
import { FaCloud, FaCloudUploadAlt, FaCloudDownloadAlt, FaExclamationTriangle } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useWorkout } from '../context/WorkoutContext';
import { syncUserData, getUserData, checkForNewerData, resolveConflicts } from '../services/syncService';
import { useTranslation } from 'react-i18next';

const CloudSync = () => {
  const { currentUser } = useAuth();
  const { plan, workoutLogs, importData } = useWorkout();
  const [syncing, setSyncing] = useState(false);
  const [lastSync, setLastSync] = useState(null);
  const [syncStatus, setSyncStatus] = useState('idle'); // 'idle', 'success', 'error', 'conflict'
  const [newerDataAvailable, setNewerDataAvailable] = useState(false);
  const { t } = useTranslation();

  // Verificar si hay datos más recientes en la nube
  useEffect(() => {
    const checkCloudData = async () => {
      if (!currentUser) return;
      
      try {
        const lastLocalUpdate = localStorage.getItem('lastSyncTime');
        const hasNewerData = await checkForNewerData(currentUser.uid, lastLocalUpdate);
        setNewerDataAvailable(hasNewerData);
      } catch (error) {
        console.error('Error al verificar datos en la nube:', error);
      }
    };
    
    checkCloudData();
    
    // Verificar periódicamente
    const interval = setInterval(checkCloudData, 5 * 60 * 1000); // Cada 5 minutos
    
    return () => clearInterval(interval);
  }, [currentUser]);

  // Cargar la última sincronización desde localStorage
  useEffect(() => {
    const lastSyncTime = localStorage.getItem('lastSyncTime');
    if (lastSyncTime) {
      setLastSync(new Date(lastSyncTime));
    }
  }, []);

  // Función para sincronizar datos con la nube
  const handleSync = async () => {
    if (!currentUser) return;
    
    try {
      setSyncing(true);
      setSyncStatus('idle');
      
      // Datos locales
      const localData = {
        plan,
        workoutLogs,
        settings: {
          notificationSettings: localStorage.getItem('notificationSettings'),
          notificationsEnabled: localStorage.getItem('notificationsEnabled'),
          reminderTime: localStorage.getItem('reminderTime'),
          currentPhase: localStorage.getItem('currentPhase'),
          darkMode: localStorage.getItem('darkMode')
        }
      };
      
      // Verificar si hay datos en la nube
      const cloudData = await getUserData(currentUser.uid);
      
      if (cloudData) {
        // Hay datos en la nube, verificar si son más recientes
        const lastLocalUpdate = localStorage.getItem('lastSyncTime');
        const hasNewerData = await checkForNewerData(currentUser.uid, lastLocalUpdate);
        
        if (hasNewerData) {
          // Resolver conflictos
          const mergedData = resolveConflicts(localData, cloudData);
          
          // Actualizar datos locales
          importData(mergedData);
          
          // Actualizar datos en la nube
          await syncUserData(currentUser.uid, mergedData);
          
          setSyncStatus('success');
        } else {
          // Subir datos locales a la nube
          await syncUserData(currentUser.uid, localData);
          setSyncStatus('success');
        }
      } else {
        // No hay datos en la nube, subir datos locales
        await syncUserData(currentUser.uid, localData);
        setSyncStatus('success');
      }
      
      // Actualizar tiempo de última sincronización
      const now = new Date();
      localStorage.setItem('lastSyncTime', now.toISOString());
      setLastSync(now);
      setNewerDataAvailable(false);
    } catch (error) {
      console.error('Error al sincronizar datos:', error);
      setSyncStatus('error');
    } finally {
      setSyncing(false);
    }
  };

  // Función para descargar datos de la nube
  const handleDownload = async () => {
    if (!currentUser) return;
    
    try {
      setSyncing(true);
      setSyncStatus('idle');
      
      // Obtener datos de la nube
      const cloudData = await getUserData(currentUser.uid);
      
      if (cloudData) {
        // Actualizar datos locales
        importData(cloudData);
        
        // Actualizar tiempo de última sincronización
        const now = new Date();
        localStorage.setItem('lastSyncTime', now.toISOString());
        setLastSync(now);
        setNewerDataAvailable(false);
        
        setSyncStatus('success');
      } else {
        setSyncStatus('error');
      }
    } catch (error) {
      console.error('Error al descargar datos:', error);
      setSyncStatus('error');
    } finally {
      setSyncing(false);
    }
  };

  // Si no hay usuario autenticado, no mostrar nada
  if (!currentUser) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
      <div className="p-4 bg-blue-50 dark:bg-blue-900 border-b border-blue-100 dark:border-blue-800">
        <h2 className="font-semibold text-gray-800 dark:text-white flex items-center">
          <FaCloud className="mr-2 text-blue-500" />
          {t('sync.cloud_sync')}
        </h2>
      </div>
      <div className="p-6">
        <div className="flex flex-col space-y-4">
          <p className="text-gray-600 dark:text-gray-400">
            {t('sync.description')}
          </p>
          
          {lastSync && (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t('sync.last_sync')}: {lastSync.toLocaleString()}
            </p>
          )}
          
          {newerDataAvailable && (
            <div className="bg-yellow-100 dark:bg-yellow-900 border border-yellow-400 dark:border-yellow-700 text-yellow-700 dark:text-yellow-300 px-4 py-3 rounded relative" role="alert">
              <div className="flex items-center">
                <FaExclamationTriangle className="mr-2" />
                <span>{t('sync.newer_data_available')}</span>
              </div>
            </div>
          )}
          
          {syncStatus === 'success' && (
            <div className="bg-green-100 dark:bg-green-900 border border-green-400 dark:border-green-700 text-green-700 dark:text-green-300 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">{t('sync.sync_success')}</span>
            </div>
          )}
          
          {syncStatus === 'error' && (
            <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">{t('sync.sync_error')}</span>
            </div>
          )}
          
          <div className="flex space-x-2">
            <button
              onClick={handleSync}
              disabled={syncing}
              className="flex-1 flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:bg-blue-300 disabled:cursor-not-allowed"
            >
              <FaCloudUploadAlt className="mr-2" />
              {syncing ? t('sync.syncing') : t('sync.sync_now')}
            </button>
            
            {newerDataAvailable && (
              <button
                onClick={handleDownload}
                disabled={syncing}
                className="flex-1 flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:bg-green-300 disabled:cursor-not-allowed"
              >
                <FaCloudDownloadAlt className="mr-2" />
                {t('sync.download')}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CloudSync;
