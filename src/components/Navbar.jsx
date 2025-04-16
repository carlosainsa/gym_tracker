import { Link, useLocation } from 'react-router-dom';
import { FaDumbbell, FaChartLine, FaCalendarAlt, FaBook, FaCog, FaClone } from 'react-icons/fa';
import NotificationSystem from './NotificationSystem';
import NavMenu from './NavMenu';

const Navbar = () => {
  const location = useLocation();

  // Función para determinar si un enlace está activo
  const isActive = (path) => {
    if (path === '/plan') {
      return location.pathname === '/plan' || location.pathname.startsWith('/plan/');
    }
    return location.pathname === path;
  };

  // Función para generar las clases de los enlaces
  const getLinkClasses = (path) => {
    const baseClasses = "flex flex-col items-center p-3 rounded-xl transition-all duration-300";
    return isActive(path)
      ? `${baseClasses} bg-primary-600 text-white shadow-button transform scale-105`
      : `${baseClasses} text-gray-300 hover:bg-primary-700/30`;
  };

  return (
    <>
      {/* Barra superior para notificaciones */}
      <div className="fixed top-0 left-0 right-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 z-40 px-4 py-2 flex justify-between items-center" role="banner" aria-label="Barra superior">
        <Link
          to="/settings"
          className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
          aria-label="Configuración"
        >
          <FaCog />
          <span className="sr-only">Configuración</span>
        </Link>
        <div className="flex items-center">
          <NavMenu />
          <NotificationSystem />
        </div>
      </div>

      {/* Barra de navegación inferior */}
      <nav
        className="fixed bottom-0 left-0 right-0 bg-gray-900 dark:bg-gray-950 border-t border-gray-800 dark:border-gray-900 z-40 px-4 py-2"
        role="navigation"
        aria-label="Navegación principal"
      >
        <div className="container mx-auto max-w-lg">
          <div className="flex justify-between items-center">
            <Link
              to="/"
              className={getLinkClasses('/')}
              aria-label="Página de inicio"
              aria-current={isActive('/') ? 'page' : undefined}
            >
              <FaDumbbell className="text-xl mb-1" aria-hidden="true" />
              <span className="text-xs">Inicio</span>
            </Link>
            <Link
              to="/progress"
              className={getLinkClasses('/progress')}
              aria-label="Ver progreso"
              aria-current={isActive('/progress') ? 'page' : undefined}
            >
              <FaChartLine className="text-xl mb-1" aria-hidden="true" />
              <span className="text-xs">Progreso</span>
            </Link>
            <Link
              to="/plan"
              className={getLinkClasses('/plan')}
              aria-label="Plan de entrenamiento"
              aria-current={isActive('/plan') ? 'page' : undefined}
            >
              <FaCalendarAlt className="text-xl mb-1" aria-hidden="true" />
              <span className="text-xs">Plan</span>
            </Link>
            <Link
              to="/templates"
              className={getLinkClasses('/templates')}
              aria-label="Plantillas de entrenamiento"
              aria-current={isActive('/templates') ? 'page' : undefined}
            >
              <FaClone className="text-xl mb-1" aria-hidden="true" />
              <span className="text-xs">Plantillas</span>
            </Link>
            <Link
              to="/library"
              className={getLinkClasses('/library')}
              aria-label="Biblioteca de ejercicios"
              aria-current={isActive('/library') ? 'page' : undefined}
            >
              <FaBook className="text-xl mb-1" aria-hidden="true" />
              <span className="text-xs">Biblioteca</span>
            </Link>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
