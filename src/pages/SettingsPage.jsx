import React, { useState } from 'react';
import { FaCog, FaArrowLeft, FaDatabase, FaBell, FaInfoCircle, FaCheck, FaMoon, FaGlobe, FaSignOutAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useWorkout } from '../context/WorkoutContext';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import DataExportImport from '../components/DataExportImport';
import ThemeToggle from '../components/ThemeToggle';
import LanguageSelector from '../components/LanguageSelector';
import CloudSync from '../components/CloudSync';

const SettingsPage = () => {
  const navigate = useNavigate();
  const { currentPhase, changePhase } = useWorkout();
  const [newPhase, setNewPhase] = useState(currentPhase);
  const [phaseChangeSuccess, setPhaseChangeSuccess] = useState(false);
  const { t } = useTranslation();
  const { currentUser, logout } = useAuth();
  const [logoutLoading, setLogoutLoading] = useState(false);

  // Manejar cambio de fase
  const handlePhaseChange = () => {
    changePhase(newPhase);
    setPhaseChangeSuccess(true);
    setTimeout(() => setPhaseChangeSuccess(false), 3000);
  };

  // Manejar cierre de sesión
  const handleLogout = async () => {
    try {
      setLogoutLoading(true);
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    } finally {
      setLogoutLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 pt-16 pb-24 max-w-lg">
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate(-1)}
          className="mr-4 p-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
          aria-label="Volver"
        >
          <FaArrowLeft />
        </button>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center">
          <FaCog className="mr-2" />
          {t('settings.title')}
        </h1>
      </div>

      {/* Sección de sincronización en la nube */}
      {currentUser && (
        <div className="mb-6">
          <CloudSync />
        </div>
      )}

      {/* Sección de datos */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden mb-6">
        <div className="p-4 bg-blue-50 dark:bg-blue-900 border-b border-blue-100 dark:border-blue-800">
          <h2 className="font-semibold text-gray-800 dark:text-white flex items-center">
            <FaDatabase className="mr-2 text-blue-500" />
            {t('settings.data.title')}
          </h2>
        </div>
        <div className="p-6">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {t('settings.data.description')}
          </p>
          <DataExportImport />
        </div>
      </div>

      {/* Sección de fase de entrenamiento */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden mb-6">
        <div className="p-4 bg-green-50 dark:bg-green-900 border-b border-green-100 dark:border-green-800">
          <h2 className="font-semibold text-gray-800 dark:text-white flex items-center">
            <FaInfoCircle className="mr-2 text-green-500" />
            {t('settings.phase.title')}
          </h2>
        </div>
        <div className="p-6">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {t('settings.phase.description')}
          </p>

          {phaseChangeSuccess && (
            <div className="bg-green-100 dark:bg-green-800 border border-green-400 dark:border-green-700 text-green-700 dark:text-green-300 px-4 py-3 rounded relative mb-4" role="alert">
              <span className="block sm:inline">{t('settings.phase.success')}</span>
            </div>
          )}

          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <label htmlFor="phase" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('settings.phase.current')}: {currentPhase}
              </label>
              <input
                type="number"
                id="phase"
                min="1"
                max="10"
                value={newPhase}
                onChange={(e) => setNewPhase(parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <button
              onClick={handlePhaseChange}
              disabled={newPhase === currentPhase}
              className={`px-4 py-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 ${
                newPhase === currentPhase
                  ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
              aria-label={t('settings.phase.save')}
            >
              <FaCheck className="mr-2 inline-block" aria-hidden="true" />
              {t('settings.phase.save')}
            </button>
          </div>
        </div>
      </div>

      {/* Sección de idioma */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden mb-6">
        <div className="p-4 bg-indigo-50 dark:bg-indigo-900 border-b border-indigo-100 dark:border-indigo-800">
          <h2 className="font-semibold text-gray-800 dark:text-white flex items-center">
            <FaGlobe className="mr-2 text-indigo-500" />
            {t('settings.language.title')}
          </h2>
        </div>
        <div className="p-6">
          <LanguageSelector />
        </div>
      </div>

      {/* Sección de tema */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden mb-6">
        <div className="p-4 bg-purple-50 dark:bg-purple-900 border-b border-purple-100 dark:border-purple-800">
          <h2 className="font-semibold text-gray-800 dark:text-white flex items-center">
            <FaMoon className="mr-2 text-purple-500" />
            {t('settings.theme.title')}
          </h2>
        </div>
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="font-medium text-gray-700 dark:text-gray-300">{t('settings.theme.dark_mode')}</span>
            <ThemeToggle />
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            {t('settings.theme.description')}
          </p>
        </div>
      </div>

      {/* Sección de notificaciones */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden mb-6">
        <div className="p-4 bg-yellow-50 dark:bg-yellow-900 border-b border-yellow-100 dark:border-yellow-800">
          <h2 className="font-semibold text-gray-800 dark:text-white flex items-center">
            <FaBell className="mr-2 text-yellow-500" />
            {t('settings.notifications.title')}
          </h2>
        </div>
        <div className="p-6">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {t('settings.notifications.description')}
          </p>
          <button
            onClick={() => document.querySelector('[aria-label="Notificaciones"]').click()}
            className="w-full px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
            aria-label={t('settings.notifications.configure')}
          >
            <FaBell className="mr-2 inline-block" aria-hidden="true" />
            {t('settings.notifications.configure')}
          </button>
        </div>
      </div>

      {/* Información de la aplicación */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden mb-6">
        <div className="p-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-100 dark:border-gray-600">
          <h2 className="font-semibold text-gray-800 dark:text-white">{t('settings.about.title')}</h2>
        </div>
        <div className="p-6">
          <p className="text-gray-600 dark:text-gray-300 mb-2">
            <strong>{t('app.name')}</strong> - {t('app.version')}
          </p>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            {t('settings.about.description')}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {t('app.copyright')}
          </p>
        </div>
      </div>

      {/* Botón de cierre de sesión */}
      {currentUser && (
        <button
          onClick={handleLogout}
          disabled={logoutLoading}
          className="w-full flex items-center justify-center px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:bg-red-300 disabled:cursor-not-allowed"
          aria-label={t('auth.logout')}
        >
          <FaSignOutAlt className="mr-2" aria-hidden="true" />
          {logoutLoading ? t('auth.logging_out') : t('auth.logout')}
        </button>
      )}
    </div>
  );
};

export default SettingsPage;
