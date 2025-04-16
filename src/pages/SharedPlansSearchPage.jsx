import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaGlobe } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import sharingService from '../services/sharingService';
import searchService from '../services/searchService';
import PlanSearchFilters from '../components/PlanSearchFilters';
import PlanSearchResults from '../components/PlanSearchResults';
import { toast } from 'react-toastify';

/**
 * Página para buscar planes compartidos
 */
const SharedPlansSearchPage = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  // Estado para los filtros
  const [filters, setFilters] = useState({
    searchTerm: '',
    tags: [],
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });
  
  // Estado para los planes compartidos
  const [sharedPlans, setSharedPlans] = useState([]);
  
  // Estado para los resultados de la búsqueda
  const [searchResults, setSearchResults] = useState([]);
  
  // Estado para las opciones de filtros disponibles
  const [availableFilters, setAvailableFilters] = useState({
    tagOptions: []
  });
  
  // Estado de carga
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Cargar planes compartidos
  useEffect(() => {
    const loadSharedPlans = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Buscar planes compartidos públicamente
        const plans = await sharingService.searchSharedPlans();
        
        setSharedPlans(plans);
        
        // Extraer etiquetas únicas
        const tags = searchService.extractTags(plans);
        
        // Actualizar opciones disponibles
        setAvailableFilters({
          tagOptions: tags
        });
      } catch (error) {
        console.error('Error al cargar planes compartidos:', error);
        setError(error.message || 'Error al cargar planes compartidos');
        toast.error('Error al cargar planes compartidos');
      } finally {
        setLoading(false);
      }
    };
    
    loadSharedPlans();
  }, []);
  
  // Realizar la búsqueda cuando cambien los filtros o los planes
  useEffect(() => {
    if (sharedPlans) {
      const results = searchService.searchSharedPlans(sharedPlans, filters);
      setSearchResults(results);
    }
  }, [sharedPlans, filters]);
  
  // Manejar cambios en los filtros
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };
  
  // Resetear filtros
  const handleResetFilters = () => {
    setFilters({
      searchTerm: '',
      tags: [],
      sortBy: 'createdAt',
      sortOrder: 'desc'
    });
  };
  
  // Manejar clic en un plan compartido
  const handlePlanClick = (plan) => {
    navigate(`/shared/${plan.id}`);
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center">
          <FaGlobe className="mr-2 text-primary-500" />
          Planes Compartidos
        </h1>
      </div>
      
      {/* Filtros de búsqueda */}
      <PlanSearchFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        availableFilters={availableFilters}
        onReset={handleResetFilters}
        showSharedFilters={true}
      />
      
      {/* Resultados de la búsqueda */}
      {!loading && !error && (
        <div className="mb-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {searchResults.length} {searchResults.length === 1 ? 'plan compartido encontrado' : 'planes compartidos encontrados'}
          </p>
        </div>
      )}
      
      <PlanSearchResults 
        plans={searchResults} 
        isLoading={loading} 
        isSharedPlans={true} 
        onPlanClick={handlePlanClick} 
      />
      
      {error && (
        <div className="bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 p-4 rounded-lg mt-4">
          <p>{error}</p>
        </div>
      )}
    </div>
  );
};

export default SharedPlansSearchPage;
