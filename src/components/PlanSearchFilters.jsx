import React, { useState } from 'react';
import { FaFilter, FaSearch, FaTimes, FaSortAmountDown, FaSortAmountUp } from 'react-icons/fa';

/**
 * Componente para filtros de búsqueda de planes
 */
const PlanSearchFilters = ({ 
  filters, 
  onFilterChange, 
  availableFilters = {},
  onReset,
  showSharedFilters = false
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Manejar cambio en el término de búsqueda
  const handleSearchTermChange = (e) => {
    onFilterChange({
      ...filters,
      searchTerm: e.target.value
    });
  };
  
  // Manejar cambio en el estado
  const handleStatusChange = (status) => {
    const newStatus = filters.status.includes(status)
      ? filters.status.filter(s => s !== status)
      : [...filters.status, status];
    
    onFilterChange({
      ...filters,
      status: newStatus
    });
  };
  
  // Manejar cambio en los objetivos
  const handleGoalChange = (goal) => {
    const newGoals = filters.goals.includes(goal)
      ? filters.goals.filter(g => g !== goal)
      : [...filters.goals, goal];
    
    onFilterChange({
      ...filters,
      goals: newGoals
    });
  };
  
  // Manejar cambio en el nivel de dificultad
  const handleDifficultyChange = (level) => {
    const newDifficulty = filters.difficulty.includes(level)
      ? filters.difficulty.filter(d => d !== level)
      : [...filters.difficulty, level];
    
    onFilterChange({
      ...filters,
      difficulty: newDifficulty
    });
  };
  
  // Manejar cambio en la duración mínima
  const handleMinDurationChange = (e) => {
    const value = e.target.value === '' ? null : parseInt(e.target.value, 10);
    
    onFilterChange({
      ...filters,
      duration: {
        ...filters.duration,
        min: value
      }
    });
  };
  
  // Manejar cambio en la duración máxima
  const handleMaxDurationChange = (e) => {
    const value = e.target.value === '' ? null : parseInt(e.target.value, 10);
    
    onFilterChange({
      ...filters,
      duration: {
        ...filters.duration,
        max: value
      }
    });
  };
  
  // Manejar cambio en la frecuencia mínima
  const handleMinFrequencyChange = (e) => {
    const value = e.target.value === '' ? null : parseInt(e.target.value, 10);
    
    onFilterChange({
      ...filters,
      frequency: {
        ...filters.frequency,
        min: value
      }
    });
  };
  
  // Manejar cambio en la frecuencia máxima
  const handleMaxFrequencyChange = (e) => {
    const value = e.target.value === '' ? null : parseInt(e.target.value, 10);
    
    onFilterChange({
      ...filters,
      frequency: {
        ...filters.frequency,
        max: value
      }
    });
  };
  
  // Manejar cambio en el criterio de ordenación
  const handleSortByChange = (e) => {
    onFilterChange({
      ...filters,
      sortBy: e.target.value
    });
  };
  
  // Manejar cambio en el orden de ordenación
  const handleSortOrderChange = () => {
    onFilterChange({
      ...filters,
      sortOrder: filters.sortOrder === 'asc' ? 'desc' : 'asc'
    });
  };
  
  // Manejar cambio en las etiquetas (para planes compartidos)
  const handleTagChange = (tag) => {
    const newTags = filters.tags.includes(tag)
      ? filters.tags.filter(t => t !== tag)
      : [...filters.tags, tag];
    
    onFilterChange({
      ...filters,
      tags: newTags
    });
  };
  
  // Verificar si hay filtros activos
  const hasActiveFilters = () => {
    return (
      filters.searchTerm ||
      filters.status.length > 0 ||
      filters.goals.length > 0 ||
      filters.difficulty.length > 0 ||
      filters.duration.min !== null ||
      filters.duration.max !== null ||
      filters.frequency.min !== null ||
      filters.frequency.max !== null ||
      (showSharedFilters && filters.tags.length > 0)
    );
  };
  
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
  
  // Obtener el nombre legible del criterio de ordenación
  const getSortByName = (sortBy) => {
    switch (sortBy) {
      case 'name':
        return 'Nombre';
      case 'duration':
        return 'Duración';
      case 'frequency':
        return 'Frecuencia';
      case 'difficulty':
        return 'Dificultad';
      case 'createdAt':
        return 'Fecha de creación';
      case 'planName':
        return 'Nombre del plan';
      case 'ownerName':
        return 'Propietario';
      case 'views':
        return 'Vistas';
      case 'downloads':
        return 'Descargas';
      default:
        return sortBy;
    }
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden mb-6">
      <div className="p-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600 flex justify-between items-center">
        <h2 className="font-medium text-gray-800 dark:text-white flex items-center">
          <FaFilter className="text-primary-500 mr-2" />
          Filtros de Búsqueda
        </h2>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
        >
          {isExpanded ? 'Ocultar filtros' : 'Mostrar filtros'}
        </button>
      </div>
      
      <div className="p-4">
        {/* Barra de búsqueda */}
        <div className="relative mb-4">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            value={filters.searchTerm}
            onChange={handleSearchTermChange}
            placeholder="Buscar planes..."
            className="w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
          />
          {filters.searchTerm && (
            <button
              onClick={() => onFilterChange({ ...filters, searchTerm: '' })}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <FaTimes />
            </button>
          )}
        </div>
        
        {/* Ordenación */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <label htmlFor="sortBy" className="text-sm font-medium text-gray-700 dark:text-gray-300 mr-2">
              Ordenar por:
            </label>
            <select
              id="sortBy"
              value={filters.sortBy}
              onChange={handleSortByChange}
              className="border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white px-3 py-1 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
            >
              {showSharedFilters ? (
                <>
                  <option value="createdAt">Fecha de creación</option>
                  <option value="planName">Nombre del plan</option>
                  <option value="ownerName">Propietario</option>
                  <option value="views">Vistas</option>
                  <option value="downloads">Descargas</option>
                </>
              ) : (
                <>
                  <option value="createdAt">Fecha de creación</option>
                  <option value="name">Nombre</option>
                  <option value="duration">Duración</option>
                  <option value="frequency">Frecuencia</option>
                  <option value="difficulty">Dificultad</option>
                </>
              )}
            </select>
          </div>
          
          <button
            onClick={handleSortOrderChange}
            className="flex items-center text-sm text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400"
          >
            {filters.sortOrder === 'asc' ? (
              <>
                <FaSortAmountUp className="mr-1" />
                Ascendente
              </>
            ) : (
              <>
                <FaSortAmountDown className="mr-1" />
                Descendente
              </>
            )}
          </button>
        </div>
        
        {/* Filtros expandidos */}
        {isExpanded && (
          <div className="mt-4 space-y-4">
            {/* Filtros para planes normales */}
            {!showSharedFilters && (
              <>
                {/* Filtro por estado */}
                {availableFilters.statusOptions && availableFilters.statusOptions.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Estado</h3>
                    <div className="flex flex-wrap gap-2">
                      {availableFilters.statusOptions.map(status => (
                        <button
                          key={status}
                          onClick={() => handleStatusChange(status)}
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            filters.status.includes(status)
                              ? 'bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300'
                              : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                          }`}
                        >
                          {getStatusName(status)}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Filtro por objetivos */}
                {availableFilters.goalOptions && availableFilters.goalOptions.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Objetivos</h3>
                    <div className="flex flex-wrap gap-2">
                      {availableFilters.goalOptions.map(goal => (
                        <button
                          key={goal}
                          onClick={() => handleGoalChange(goal)}
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            filters.goals.includes(goal)
                              ? 'bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300'
                              : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                          }`}
                        >
                          {getGoalName(goal)}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Filtro por nivel de dificultad */}
                {availableFilters.difficultyOptions && availableFilters.difficultyOptions.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nivel de dificultad</h3>
                    <div className="flex flex-wrap gap-2">
                      {availableFilters.difficultyOptions.map(level => (
                        <button
                          key={level}
                          onClick={() => handleDifficultyChange(level)}
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            filters.difficulty.includes(level)
                              ? 'bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300'
                              : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                          }`}
                        >
                          {getDifficultyName(level)}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Filtro por duración */}
                {availableFilters.durationRange && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Duración (semanas)</h3>
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        min={availableFilters.durationRange.min}
                        max={availableFilters.durationRange.max}
                        value={filters.duration.min === null ? '' : filters.duration.min}
                        onChange={handleMinDurationChange}
                        placeholder="Mín"
                        className="w-20 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                      />
                      <span className="text-gray-500 dark:text-gray-400">a</span>
                      <input
                        type="number"
                        min={availableFilters.durationRange.min}
                        max={availableFilters.durationRange.max}
                        value={filters.duration.max === null ? '' : filters.duration.max}
                        onChange={handleMaxDurationChange}
                        placeholder="Máx"
                        className="w-20 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                      />
                    </div>
                  </div>
                )}
                
                {/* Filtro por frecuencia */}
                {availableFilters.frequencyRange && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Frecuencia (días/semana)</h3>
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        min={availableFilters.frequencyRange.min}
                        max={availableFilters.frequencyRange.max}
                        value={filters.frequency.min === null ? '' : filters.frequency.min}
                        onChange={handleMinFrequencyChange}
                        placeholder="Mín"
                        className="w-20 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                      />
                      <span className="text-gray-500 dark:text-gray-400">a</span>
                      <input
                        type="number"
                        min={availableFilters.frequencyRange.min}
                        max={availableFilters.frequencyRange.max}
                        value={filters.frequency.max === null ? '' : filters.frequency.max}
                        onChange={handleMaxFrequencyChange}
                        placeholder="Máx"
                        className="w-20 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                      />
                    </div>
                  </div>
                )}
              </>
            )}
            
            {/* Filtros para planes compartidos */}
            {showSharedFilters && (
              <>
                {/* Filtro por etiquetas */}
                {availableFilters.tagOptions && availableFilters.tagOptions.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Etiquetas</h3>
                    <div className="flex flex-wrap gap-2">
                      {availableFilters.tagOptions.map(tag => (
                        <button
                          key={tag}
                          onClick={() => handleTagChange(tag)}
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            filters.tags.includes(tag)
                              ? 'bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300'
                              : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                          }`}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
            
            {/* Botón para resetear filtros */}
            {hasActiveFilters() && (
              <div className="flex justify-end pt-2">
                <button
                  onClick={onReset}
                  className="text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 flex items-center"
                >
                  <FaTimes className="mr-1" />
                  Limpiar filtros
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PlanSearchFilters;
