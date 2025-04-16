/**
 * Servicio para búsqueda y filtrado de planes de entrenamiento
 */
class SearchService {
  /**
   * Busca planes de entrenamiento según criterios
   * @param {Array} plans - Lista de planes de entrenamiento
   * @param {Object} filters - Filtros de búsqueda
   * @returns {Array} - Planes filtrados
   */
  searchPlans(plans, filters = {}) {
    if (!plans || !Array.isArray(plans)) {
      return [];
    }
    
    const {
      searchTerm = '',
      status = [],
      goals = [],
      difficulty = [],
      duration = { min: null, max: null },
      frequency = { min: null, max: null },
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = filters;
    
    // Filtrar planes
    let filteredPlans = [...plans];
    
    // Filtrar por término de búsqueda
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filteredPlans = filteredPlans.filter(plan => {
        const nameMatch = plan.name?.toLowerCase().includes(searchLower);
        const descMatch = plan.description?.toLowerCase().includes(searchLower);
        return nameMatch || descMatch;
      });
    }
    
    // Filtrar por estado
    if (status && status.length > 0) {
      filteredPlans = filteredPlans.filter(plan => status.includes(plan.status));
    }
    
    // Filtrar por objetivos
    if (goals && goals.length > 0) {
      filteredPlans = filteredPlans.filter(plan => {
        const planGoals = [plan.primaryGoal, plan.secondaryGoal].filter(Boolean);
        return goals.some(goal => planGoals.includes(goal));
      });
    }
    
    // Filtrar por nivel de dificultad
    if (difficulty && difficulty.length > 0) {
      filteredPlans = filteredPlans.filter(plan => difficulty.includes(plan.difficultyLevel));
    }
    
    // Filtrar por duración
    if (duration) {
      if (duration.min !== null) {
        filteredPlans = filteredPlans.filter(plan => {
          const planDuration = plan.duration || plan.microcycles?.length || 0;
          return planDuration >= duration.min;
        });
      }
      
      if (duration.max !== null) {
        filteredPlans = filteredPlans.filter(plan => {
          const planDuration = plan.duration || plan.microcycles?.length || 0;
          return planDuration <= duration.max;
        });
      }
    }
    
    // Filtrar por frecuencia
    if (frequency) {
      if (frequency.min !== null) {
        filteredPlans = filteredPlans.filter(plan => {
          return plan.frequency >= frequency.min;
        });
      }
      
      if (frequency.max !== null) {
        filteredPlans = filteredPlans.filter(plan => {
          return plan.frequency <= frequency.max;
        });
      }
    }
    
    // Ordenar planes
    filteredPlans.sort((a, b) => {
      let valueA, valueB;
      
      switch (sortBy) {
        case 'name':
          valueA = a.name || '';
          valueB = b.name || '';
          return sortOrder === 'asc' 
            ? valueA.localeCompare(valueB) 
            : valueB.localeCompare(valueA);
        
        case 'duration':
          valueA = a.duration || a.microcycles?.length || 0;
          valueB = b.duration || b.microcycles?.length || 0;
          return sortOrder === 'asc' ? valueA - valueB : valueB - valueA;
        
        case 'frequency':
          valueA = a.frequency || 0;
          valueB = b.frequency || 0;
          return sortOrder === 'asc' ? valueA - valueB : valueB - valueA;
        
        case 'difficulty':
          // Convertir nivel de dificultad a valor numérico
          const difficultyValues = { 'beginner': 1, 'intermediate': 2, 'advanced': 3 };
          valueA = difficultyValues[a.difficultyLevel] || 0;
          valueB = difficultyValues[b.difficultyLevel] || 0;
          return sortOrder === 'asc' ? valueA - valueB : valueB - valueA;
        
        case 'createdAt':
        default:
          valueA = new Date(a.createdAt || 0);
          valueB = new Date(b.createdAt || 0);
          return sortOrder === 'asc' ? valueA - valueB : valueB - valueA;
      }
    });
    
    return filteredPlans;
  }
  
  /**
   * Busca planes compartidos según criterios
   * @param {Array} sharedPlans - Lista de planes compartidos
   * @param {Object} filters - Filtros de búsqueda
   * @returns {Array} - Planes compartidos filtrados
   */
  searchSharedPlans(sharedPlans, filters = {}) {
    if (!sharedPlans || !Array.isArray(sharedPlans)) {
      return [];
    }
    
    const {
      searchTerm = '',
      tags = [],
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = filters;
    
    // Filtrar planes
    let filteredPlans = [...sharedPlans];
    
    // Filtrar por término de búsqueda
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filteredPlans = filteredPlans.filter(plan => {
        const nameMatch = plan.planName?.toLowerCase().includes(searchLower);
        const descMatch = plan.description?.toLowerCase().includes(searchLower);
        const ownerMatch = plan.ownerName?.toLowerCase().includes(searchLower);
        return nameMatch || descMatch || ownerMatch;
      });
    }
    
    // Filtrar por etiquetas
    if (tags && tags.length > 0) {
      filteredPlans = filteredPlans.filter(plan => {
        const planTags = plan.tags || [];
        return tags.some(tag => planTags.includes(tag));
      });
    }
    
    // Ordenar planes
    filteredPlans.sort((a, b) => {
      let valueA, valueB;
      
      switch (sortBy) {
        case 'planName':
          valueA = a.planName || '';
          valueB = b.planName || '';
          return sortOrder === 'asc' 
            ? valueA.localeCompare(valueB) 
            : valueB.localeCompare(valueA);
        
        case 'ownerName':
          valueA = a.ownerName || '';
          valueB = b.ownerName || '';
          return sortOrder === 'asc' 
            ? valueA.localeCompare(valueB) 
            : valueB.localeCompare(valueA);
        
        case 'views':
          valueA = a.views || 0;
          valueB = b.views || 0;
          return sortOrder === 'asc' ? valueA - valueB : valueB - valueA;
        
        case 'downloads':
          valueA = a.downloads || 0;
          valueB = b.downloads || 0;
          return sortOrder === 'asc' ? valueA - valueB : valueB - valueA;
        
        case 'createdAt':
        default:
          valueA = new Date(a.createdAt || 0);
          valueB = new Date(b.createdAt || 0);
          return sortOrder === 'asc' ? valueA - valueB : valueB - valueA;
      }
    });
    
    return filteredPlans;
  }
  
  /**
   * Extrae etiquetas únicas de una lista de planes
   * @param {Array} plans - Lista de planes
   * @returns {Array} - Lista de etiquetas únicas
   */
  extractTags(plans) {
    if (!plans || !Array.isArray(plans)) {
      return [];
    }
    
    const allTags = plans.reduce((tags, plan) => {
      if (plan.tags && Array.isArray(plan.tags)) {
        return [...tags, ...plan.tags];
      }
      return tags;
    }, []);
    
    // Eliminar duplicados
    return [...new Set(allTags)];
  }
  
  /**
   * Extrae objetivos únicos de una lista de planes
   * @param {Array} plans - Lista de planes
   * @returns {Array} - Lista de objetivos únicos
   */
  extractGoals(plans) {
    if (!plans || !Array.isArray(plans)) {
      return [];
    }
    
    const allGoals = plans.reduce((goals, plan) => {
      const planGoals = [plan.primaryGoal, plan.secondaryGoal].filter(Boolean);
      return [...goals, ...planGoals];
    }, []);
    
    // Eliminar duplicados
    return [...new Set(allGoals)];
  }
  
  /**
   * Extrae niveles de dificultad únicos de una lista de planes
   * @param {Array} plans - Lista de planes
   * @returns {Array} - Lista de niveles de dificultad únicos
   */
  extractDifficultyLevels(plans) {
    if (!plans || !Array.isArray(plans)) {
      return [];
    }
    
    const allLevels = plans.map(plan => plan.difficultyLevel).filter(Boolean);
    
    // Eliminar duplicados
    return [...new Set(allLevels)];
  }
  
  /**
   * Obtiene el rango de duración de una lista de planes
   * @param {Array} plans - Lista de planes
   * @returns {Object} - Rango de duración {min, max}
   */
  getDurationRange(plans) {
    if (!plans || !Array.isArray(plans) || plans.length === 0) {
      return { min: 0, max: 0 };
    }
    
    const durations = plans.map(plan => plan.duration || plan.microcycles?.length || 0);
    
    return {
      min: Math.min(...durations),
      max: Math.max(...durations)
    };
  }
  
  /**
   * Obtiene el rango de frecuencia de una lista de planes
   * @param {Array} plans - Lista de planes
   * @returns {Object} - Rango de frecuencia {min, max}
   */
  getFrequencyRange(plans) {
    if (!plans || !Array.isArray(plans) || plans.length === 0) {
      return { min: 0, max: 0 };
    }
    
    const frequencies = plans.map(plan => plan.frequency || 0);
    
    return {
      min: Math.min(...frequencies),
      max: Math.max(...frequencies)
    };
  }
}

export default new SearchService();
