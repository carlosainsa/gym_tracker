import { Link, useLocation } from 'react-router-dom';
import { FaDumbbell, FaChartLine, FaCalendarAlt, FaBook, FaPlus } from 'react-icons/fa';
import { useWorkout } from '../context/WorkoutContext';
import Notifications from './Notifications';

const Navbar = () => {
  const location = useLocation();
  const { currentPhase, changePhase } = useWorkout();

  // Función para determinar si un enlace está activo
  const isActive = (path) => location.pathname === path;

  // Función para generar las clases de los enlaces
  const getLinkClasses = (path) => {
    const baseClasses = "flex flex-col items-center p-3 rounded-xl transition-all duration-300";
    return isActive(path)
      ? `${baseClasses} bg-primary-600 text-white shadow-button transform scale-105`
      : `${baseClasses} text-gray-300 hover:bg-primary-700/30`;
  };

  return (
    <>
      {/* Barra superior para fases y notificaciones */}
      <div className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-40 px-4 py-2 flex justify-between items-center">
        <div className="flex space-x-2">
          <button
            onClick={() => changePhase(1)}
            className={`px-3 py-1 rounded-full text-xs font-medium ${currentPhase === 1 ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
          >
            Fase 1
          </button>
          <button
            onClick={() => changePhase(2)}
            className={`px-3 py-1 rounded-full text-xs font-medium ${currentPhase === 2 ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
          >
            Fase 2
          </button>
          <button
            onClick={() => changePhase(3)}
            className={`px-3 py-1 rounded-full text-xs font-medium ${currentPhase === 3 ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
          >
            Fase 3
          </button>
        </div>
        <Notifications />
      </div>

      {/* Barra de navegación principal */}
      <nav className="fixed bottom-0 left-0 right-0 bg-gray-900 p-2 border-t border-gray-800 backdrop-blur-md bg-opacity-90 z-50">
        <div className="container mx-auto max-w-md">
          <div className="flex justify-around items-center">
            <Link to="/" className={getLinkClasses('/')}>
              <FaDumbbell className={`text-xl ${isActive('/') ? 'text-white' : 'text-primary-400'}`} />
              <span className="text-xs mt-1 font-medium">Entrenar</span>
            </Link>
            <Link to="/progress" className={getLinkClasses('/progress')}>
              <FaChartLine className={`text-xl ${isActive('/progress') ? 'text-white' : 'text-primary-400'}`} />
              <span className="text-xs mt-1 font-medium">Progreso</span>
            </Link>
            <Link to="/plan" className={getLinkClasses('/plan')}>
              <FaCalendarAlt className={`text-xl ${isActive('/plan') ? 'text-white' : 'text-primary-400'}`} />
              <span className="text-xs mt-1 font-medium">Plan</span>
            </Link>
            <Link to="/exercise-library" className={getLinkClasses('/exercise-library')}>
              <FaBook className={`text-xl ${isActive('/exercise-library') ? 'text-white' : 'text-primary-400'}`} />
              <span className="text-xs mt-1 font-medium">Ejercicios</span>
            </Link>
            <Link to="/create-routine" className={`flex flex-col items-center p-3 rounded-xl transition-all duration-300 ${isActive('/create-routine') ? 'bg-green-600' : 'bg-green-700'} text-white`}>
              <FaPlus className="text-xl" />
              <span className="text-xs mt-1 font-medium">Crear</span>
            </Link>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
