import React from 'react';
import { Link } from 'react-router-dom';
import { FaCalendarAlt, FaDumbbell, FaUser, FaEye, FaDownload, FaLock, FaGlobe } from 'react-icons/fa';

/**
 * Componente para mostrar los resultados de búsqueda de planes
 */
const PlanSearchResults = ({ 
  plans, 
  isLoading = false, 
  isSharedPlans = false,
  onPlanClick = null
}) => {
  // Obtener el nombre legible del objetivo
  const getGoalName = (goal) => {
    switch (goal) {
      case 'strength':
        return 'Fuerza';
      case 'hypertrophy':
        return 'Hipertrofia';
      case 'fat_loss':
        return 'Pérdida de grasa';
      case 'endurance':
        return 'Resistencia';
      case 'general':
        return 'General';
      default:
        return goal;
    }
  };
  
  // Obtener el nombre legible del nivel de dificultad
  const getDifficultyName = (difficulty) => {
    switch (difficulty) {
      case 'beginner':
        return 'Principiante';
      case 'intermediate':
        return 'Intermedio';
      case 'advanced':
        return 'Avanzado';
      default:
        return difficulty;
    }
  };
  
  // Obtener el nombre legible del estado
  const getStatusName = (status) => {
    switch (status) {
      case 'active':
        return 'Activo';
      case 'available':
        return 'Disponible';
      case 'archived':
        return 'Archivado';
      default:
        return status;
    }
  };
  
  // Obtener la clase de color según el estado
  const getStatusColorClass = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'available':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'archived':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };
  
  // Renderizar el estado de carga
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <svg className="animate-spin h-12 w-12 text-primary-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="text-gray-600 dark:text-gray-400">Cargando planes...</p>
      </div>
    );
  }
  
  // Renderizar mensaje si no hay resultados
  if (!plans || plans.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 text-center">
        <p className="text-gray-600 dark:text-gray-400">No se encontraron planes que coincidan con los criterios de búsqueda.</p>
      </div>
    );
  }
  
  // Renderizar resultados para planes normales
  if (!isSharedPlans) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map(plan => (
          <Link
            key={plan.id}
            to={`/plan/${plan.id}`}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="p-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white">
              <h3 className="font-bold text-lg truncate">{plan.name}</h3>
              <p className="text-white text-opacity-90 text-sm truncate">{plan.description}</p>
            </div>
            
            <div className="p-4">
              <div className="flex flex-wrap gap-2 mb-3">
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColorClass(plan.status)}`}>
                  {getStatusName(plan.status)}
                </span>
                
                {plan.primaryGoal && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300">
                    {getGoalName(plan.primaryGoal)}
                  </span>
                )}
                
                {plan.difficultyLevel && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
                    {getDifficultyName(plan.difficultyLevel)}
                  </span>
                )}
              </div>
              
              <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center">
                  <FaCalendarAlt className="mr-1 text-gray-500 dark:text-gray-400" />
                  <span>{plan.duration || plan.microcycles?.length || '?'} semanas</span>
                </div>
                
                <div className="flex items-center">
                  <FaDumbbell className="mr-1 text-gray-500 dark:text-gray-400" />
                  <span>{plan.frequency || '?'} días/semana</span>
                </div>
              </div>
              
              {plan.createdAt && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
                  Creado: {new Date(plan.createdAt).toLocaleDateString()}
                </p>
              )}
            </div>
          </Link>
        ))}
      </div>
    );
  }
  
  // Renderizar resultados para planes compartidos
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {plans.map(plan => (
        <div
          key={plan.id}
          onClick={() => onPlanClick && onPlanClick(plan)}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
        >
          <div className="p-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white">
            <h3 className="font-bold text-lg truncate">{plan.planName}</h3>
            <p className="text-white text-opacity-90 text-sm truncate">{plan.description}</p>
          </div>
          
          <div className="p-4">
            <div className="flex flex-wrap gap-2 mb-3">
              {plan.isPublic ? (
                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 flex items-center">
                  <FaGlobe className="mr-1" />
                  Público
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 flex items-center">
                  <FaLock className="mr-1" />
                  Privado
                </span>
              )}
              
              {plan.hasPassword && (
                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 flex items-center">
                  <FaLock className="mr-1" />
                  Con contraseña
                </span>
              )}
            </div>
            
            <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center">
                <FaUser className="mr-1 text-gray-500 dark:text-gray-400" />
                <span>{plan.ownerName}</span>
              </div>
              
              <div className="flex items-center">
                <FaEye className="mr-1 text-gray-500 dark:text-gray-400" />
                <span>{plan.views || 0} vistas</span>
              </div>
              
              <div className="flex items-center">
                <FaDownload className="mr-1 text-gray-500 dark:text-gray-400" />
                <span>{plan.downloads || 0} descargas</span>
              </div>
            </div>
            
            {plan.tags && plan.tags.length > 0 && (
              <div className="mt-3">
                <div className="flex flex-wrap gap-1">
                  {plan.tags.slice(0, 3).map(tag => (
                    <span 
                      key={tag} 
                      className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                    >
                      {tag}
                    </span>
                  ))}
                  {plan.tags.length > 3 && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                      +{plan.tags.length - 3}
                    </span>
                  )}
                </div>
              </div>
            )}
            
            {plan.createdAt && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
                Compartido: {new Date(plan.createdAt).toLocaleDateString()}
              </p>
            )}
            
            {plan.expirationDate && (
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Expira: {new Date(plan.expirationDate).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default PlanSearchResults;
