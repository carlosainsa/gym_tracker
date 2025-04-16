import React from 'react';
import { FaSun, FaMoon } from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle = () => {
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <button
      onClick={toggleDarkMode}
      className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800 ${
        darkMode ? 'bg-blue-600' : 'bg-gray-300'
      }`}
      aria-label={darkMode ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'}
      aria-pressed={darkMode}
      role="switch"
    >
      <span className="sr-only">{darkMode ? 'Tema oscuro activado' : 'Tema claro activado'}</span>
      <span
        className={`inline-block w-4 h-4 transform transition-transform bg-white rounded-full flex items-center justify-center ${
          darkMode ? 'translate-x-6' : 'translate-x-1'
        }`}
        aria-hidden="true"
      >
        {darkMode ? (
          <FaMoon className="text-blue-600 text-xs" aria-hidden="true" />
        ) : (
          <FaSun className="text-yellow-500 text-xs" aria-hidden="true" />
        )}
      </span>
    </button>
  );
};

export default ThemeToggle;
