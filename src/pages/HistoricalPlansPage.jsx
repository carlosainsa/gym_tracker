import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaArchive, FaSearch, FaFilter, FaCalendarAlt, FaSortAmountDown, FaSortAmountUp, FaUndo, FaTrashAlt, FaChartLine, FaEye, FaFileExport } from 'react-icons/fa';
import { useTrainingContext } from '../contexts/TrainingContext';
import historicalPlanService from '../services/historicalPlanService';
import { toast } from 'react-toastify';

/**
 * Página para gestionar planes históricos
 */
const HistoricalPlansPage = () => {
  const { refreshPlans } = useTrainingContext();
  
  // Estados
  const [historicalPlans, setHistoricalPlans] = useState([]);
  const [filteredPlans, setFilteredPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('archivedAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedPlanId, setSelectedPlanId] = useState(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [showConfirmRestore, setShowConfirmRestore] = useState(false);
  
  // Filtros
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });
  
  // Cargar planes históricos
  useEffect(() => {
    loadHistoricalPlans();
  }, []);
  
  // Cargar planes históricos
  const loadHistoricalPlans = async () => {
    setLoading(true);
    
    try {
      const plans = historicalPlanService.getAllHistoricalPlans();
      setHistoricalPlans(plans);
      setFilteredPlans(plans);
    } catch (error) {
      console.error('Error al cargar planes históricos:', error);
      toast.error('Error al cargar planes históricos: ' + error.message);
    } finally {
      setLoading(false);
    }
  };
  
  // Aplicar filtros y ordenación
  useEffect(() => {
    try {
      const filtered = historicalPlanService.searchHistoricalPlans({
        query: searchQuery,
        startDate: dateRange.startDate || undefined,
        endDate: dateRange.endDate || undefined,
        sortBy,
        sortOrder
      });
      
      setFilteredPlans(filtered);
    } catch (error) {
      console.error('Error al filtrar planes:', error);
      toast.error('Error al aplicar filtros: ' + error.message);
    }
  }, [searchQuery, dateRange, sortBy, sortOrder, historicalPlans]);
  
  // Restaurar un plan
  const handleRestorePlan = async () => {
    if (!selectedPlanId) return;
    
    try {
      const restoredPlan = historicalPlanService.restorePlan(selectedPlanId);
      
      toast.success(`Plan "${restoredPlan.name}" restaurado correctamente`);
      
      // Actualizar la lista de planes
      refreshPlans();
      loadHistoricalPlans();
      
      // Cerrar el diálogo
      setShowConfirmRestore(false);
      setSelectedPlanId(null);
    } catch (error) {
      console.error('Error al restaurar plan:', error);
      toast.error('Error al restaurar plan: ' + error.message);
    }
  };
  
  // Eliminar un plan permanentemente
  const handleDeletePlan = async () => {
    if (!selectedPlanId) return;
    
    try {
      const success = historicalPlanService.deletePermanently(selectedPlanId);
      
      if (success) {
        toast.success('Plan eliminado permanentemente');
        
        // Actualizar la lista de planes
        loadHistoricalPlans();
        
        // Cerrar el diálogo
        setShowConfirmDelete(false);
        setSelectedPlanId(null);
      }
    } catch (error) {
      console.error('Error al eliminar plan:', error);
      toast.error('Error al eliminar plan: ' + error.message);
    }
  };
  
  // Exportar un plan histórico
  const handleExportPlan = async (planId) => {
    try {
      const exportedPlan = historicalPlanService.exportHistoricalPlan(planId);
      
      // Crear un blob con el contenido JSON
      const blob = new Blob([JSON.stringify(exportedPlan, null, 2)], { type: 'application/json' });
      
      // Crear un enlace para descargar el archivo
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `plan_historico_${exportedPlan.plan.name.replace(/\\s+/g, '_')}.json`;
      
      // Simular clic en el enlace para iniciar la descarga
      document.body.appendChild(a);
      a.click();
      
      // Limpiar
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 0);
      
      toast.success('Plan exportado correctamente');
    } catch (error) {
      console.error('Error al exportar plan:', error);
      toast.error('Error al exportar plan: ' + error.message);
    }
  };
  
  // Formatear fecha
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };
  
  return (
    <div className="container mx-auto px-4 py-6">
      {/* Encabezado */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center">
          <FaArchive className="mr-3 text-primary-500" />
          Planes Históricos
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Gestiona tus planes de entrenamiento archivados y accede a sus estadísticas.
        </p>
      </div>
      
      {/* Barra de búsqueda y filtros */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400 dark:text-gray-500" />
            </div>
            <input
              type="text"
              placeholder="Buscar planes históricos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
            />
          </div>
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <FaFilter className="mr-2" />
            Filtros
          </button>
          
          <div className="flex items-center">
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              {sortOrder === 'asc' ? <FaSortAmountUp className="mr-2" /> : <FaSortAmountDown className="mr-2" />}
              Ordenar
            </button>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="ml-2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
            >
              <option value="archivedAt">Fecha de archivado</option>
              <option value="name">Nombre</option>
              <option value="createdAt">Fecha de creación</option>
            </select>
          </div>
        </div>
        
        {/* Filtros avanzados */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Fecha de archivado desde
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaCalendarAlt className="text-gray-400 dark:text-gray-500" />
                  </div>
                  <input
                    type="date"
                    value={dateRange.startDate}
                    onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Fecha de archivado hasta
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaCalendarAlt className="text-gray-400 dark:text-gray-500" />
                  </div>
                  <input
                    type="date"
                    value={dateRange.endDate}
                    onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex justify-end mt-4">
              <button
                onClick={() => {
                  setSearchQuery('');
                  setDateRange({ startDate: '', endDate: '' });
                  setSortBy('archivedAt');
                  setSortOrder('desc');
                }}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
              >
                Limpiar filtros
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Lista de planes históricos */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
        {loading ? (
          <div className="p-6 text-center">
            <p className="text-gray-500 dark:text-gray-400">Cargando planes históricos...</p>
          </div>
        ) : filteredPlans.length === 0 ? (
          <div className="p-6 text-center">
            <FaArchive className="mx-auto text-gray-400 dark:text-gray-500 text-4xl mb-3" />
            <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-1">No hay planes históricos</h3>
            <p className="text-gray-500 dark:text-gray-400">
              Los planes que archives aparecerán aquí.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Nombre
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Archivado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Razón
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Duración
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredPlans.map(plan => (
                  <tr key={plan.id} className="hover:bg-gray-50 dark:hover:bg-gray-750">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-800 dark:text-white">{plan.name}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{plan.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-700 dark:text-gray-300">{formatDate(plan.archivedAt)}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
                        {plan.archiveReason || 'No especificada'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-700 dark:text-gray-300">
                        {plan.microcycles?.length || 0} semanas
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Link
                          to={`/plan/history/${plan.id}`}
                          className="text-primary-600 hover:text-primary-700 dark:text-primary-500 dark:hover:text-primary-400"
                          title="Ver detalles"
                        >
                          <FaEye />
                        </Link>
                        
                        <Link
                          to={`/plan/stats/${plan.id}`}
                          className="text-blue-600 hover:text-blue-700 dark:text-blue-500 dark:hover:text-blue-400"
                          title="Ver estadísticas"
                        >
                          <FaChartLine />
                        </Link>
                        
                        <button
                          onClick={() => {
                            setSelectedPlanId(plan.id);
                            setShowConfirmRestore(true);
                          }}
                          className="text-green-600 hover:text-green-700 dark:text-green-500 dark:hover:text-green-400"
                          title="Restaurar plan"
                        >
                          <FaUndo />
                        </button>
                        
                        <button
                          onClick={() => handleExportPlan(plan.id)}
                          className="text-amber-600 hover:text-amber-700 dark:text-amber-500 dark:hover:text-amber-400"
                          title="Exportar plan"
                        >
                          <FaFileExport />
                        </button>
                        
                        <button
                          onClick={() => {
                            setSelectedPlanId(plan.id);
                            setShowConfirmDelete(true);
                          }}
                          className="text-red-600 hover:text-red-700 dark:text-red-500 dark:hover:text-red-400"
                          title="Eliminar permanentemente"
                        >
                          <FaTrashAlt />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {/* Diálogo de confirmación para restaurar */}
      {showConfirmRestore && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Confirmar restauración</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              ¿Estás seguro de que deseas restaurar este plan? El plan se moverá a la lista de planes disponibles.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowConfirmRestore(false)}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleRestorePlan}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Restaurar
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Diálogo de confirmación para eliminar */}
      {showConfirmDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Confirmar eliminación</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              ¿Estás seguro de que deseas eliminar permanentemente este plan? Esta acción no se puede deshacer.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowConfirmDelete(false)}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeletePlan}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HistoricalPlansPage;
