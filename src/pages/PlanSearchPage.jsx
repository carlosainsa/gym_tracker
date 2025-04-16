import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import { useTraining } from '../context/TrainingContext';
import searchService from '../services/searchService';
import PlanSearchFilters from '../components/PlanSearchFilters';
import PlanSearchResults from '../components/PlanSearchResults';

/**
 * Página para buscar planes de entrenamiento
 */
const PlanSearchPage = () => {
  const navigate = useNavigate();
  const { trainingPlans } = useTraining();
  
  // Estado para los filtros
  const [filters, setFilters] = useState({
    searchTerm: '',
    status: [],
    goals: [],
    difficulty: [],
    duration: { min: null, max: null },
    frequency: { min: null, max: null },
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });
  
  // Estado para los resultados de la búsqueda
  const [searchResults, setSearchResults] = useState([]);
  
  // Estado para las opciones de filtros disponibles
  const [availableFilters, setAvailableFilters] = useState({
    statusOptions: ['active', 'available', 'archived'],
    goalOptions: [],
    difficultyOptions: [],
    durationRange: { min: 0, max: 0 },
    frequencyRange: { min: 0, max: 0 }
  });
  
  // Inicializar las opciones de filtros disponibles
  useEffect(() => {
    if (trainingPlans && trainingPlans.length > 0) {
      // Extraer objetivos únicos
      const goals = searchService.extractGoals(trainingPlans);
      
      // Extraer niveles de dificultad únicos
      const difficultyLevels = searchService.extractDifficultyLevels(trainingPlans);
      
      // Obtener rango de duración
      const durationRange = searchService.getDurationRange(trainingPlans);
      
      // Obtener rango de frecuencia
      const frequencyRange = searchService.getFrequencyRange(trainingPlans);
      
      // Actualizar opciones disponibles
      setAvailableFilters({
        statusOptions: ['active', 'available', 'archived'],
        goalOptions: goals,
        difficultyOptions: difficultyLevels,
        durationRange,
        frequencyRange
      });
    }
  }, [trainingPlans]);
  
  // Realizar la búsqueda cuando cambien los filtros o los planes
  useEffect(() => {
    if (trainingPlans) {
      const results = searchService.searchPlans(trainingPlans, filters);
      setSearchResults(results);
    }
  }, [trainingPlans, filters]);
  
  // Manejar cambios en los filtros
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };
  
  // Resetear filtros
  const handleResetFilters = () => {
    setFilters({
      searchTerm: '',
      status: [],
      goals: [],
      difficulty: [],
      duration: { min: null, max: null },
      frequency: { min: null, max: null },
      sortBy: 'createdAt',
      sortOrder: 'desc'
    });
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center">
          <FaSearch className="mr-2 text-primary-500" />
          Buscar Planes de Entrenamiento
        </h1>
      </div>
      
      {/* Filtros de búsqueda */}
      <PlanSearchFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        availableFilters={availableFilters}
        onReset={handleResetFilters}
      />
      
      {/* Resultados de la búsqueda */}
      <div className="mb-4">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {searchResults.length} {searchResults.length === 1 ? 'resultado encontrado' : 'resultados encontrados'}
        </p>
      </div>
      
      <PlanSearchResults plans={searchResults} />
    </div>
  );
};

export default PlanSearchPage;
