import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaChevronDown, FaChevronUp, FaCalendarAlt, FaEllipsisH, FaArchive, FaTrash, FaEye, FaChartLine, FaExchangeAlt, FaFileImport, FaFileExport, FaExternalLinkAlt } from 'react-icons/fa';
import { useTraining } from '../context/TrainingContext';
import ImportExportPlans from '../components/ImportExportPlans';

/**
 * Página para gestionar los planes de entrenamiento
 */
const PlansManagementPage = () => {
  const navigate = useNavigate();
  const { trainingPlans, activePlanId, archivePlan, deletePlan, activatePlan } = useTraining();

  const [activePlans, setActivePlans] = useState([]);
  const [availablePlans, setAvailablePlans] = useState([]);
  const [historicalPlans, setHistoricalPlans] = useState([]);
  const [expandedPlanId, setExpandedPlanId] = useState(null);
  const [menuOpenPlanId, setMenuOpenPlanId] = useState(null);

  // Clasificar los planes
  useEffect(() => {
    if (trainingPlans) {
      setActivePlans(trainingPlans.filter(plan => plan.status === 'active'));
      setAvailablePlans(trainingPlans.filter(plan => plan.status === 'available'));
      setHistoricalPlans(trainingPlans.filter(plan => plan.status === 'archived'));
    }
  }, [trainingPlans]);

  // Alternar la expansión de un plan
  const togglePlanExpansion = (planId) => {
    setExpandedPlanId(expandedPlanId === planId ? null : planId);
  };

  // Alternar el menú de opciones
  const toggleMenu = (planId, e) => {
    e.stopPropagation();
    setMenuOpenPlanId(menuOpenPlanId === planId ? null : planId);
  };

  // Cerrar el menú cuando se hace clic fuera
  useEffect(() => {
    const handleClickOutside = () => {
      setMenuOpenPlanId(null);
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  // Activar un plan
  const handleActivatePlan = (planId, e) => {
    e.stopPropagation();
    activatePlan(planId);
    setMenuOpenPlanId(null);
  };

  // Archivar un plan
  const handleArchivePlan = (planId, e) => {
    e.stopPropagation();
    archivePlan(planId);
    setMenuOpenPlanId(null);
  };

  // Eliminar un plan
  const handleDeletePlan = (planId, e) => {
    e.stopPropagation();
    if (window.confirm('¿Estás seguro de que deseas eliminar este plan? Esta acción no se puede deshacer.')) {
      deletePlan(planId);
    }
    setMenuOpenPlanId(null);
  };

  // Ver detalles de un plan
  const handleViewPlan = (planId, e) => {
    e.stopPropagation();
    navigate(`/plan/view/${planId}`);
  };

  // Ver estadísticas de un plan
  const handleViewStats = (planId, e) => {
    e.stopPropagation();
    navigate(`/plan/stats/${planId}`);
  };

  // Comparar planes
  const handleComparePlans = (planId, e) => {
    e.stopPropagation();
    navigate(`/plan/compare/${planId}`);
  };

  // Renderizar un plan
  const renderPlan = (plan, isActive = false) => {
    const isExpanded = expandedPlanId === plan.id;
    const isMenuOpen = menuOpenPlanId === plan.id;

    return (
      <div
        key={plan.id}
        className={`bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden mb-4 transition-all ${
          isExpanded ? 'ring-2 ring-primary-500' : ''
        }`}
      >
        <div
          className="p-4 cursor-pointer flex justify-between items-center"
          onClick={() => togglePlanExpansion(plan.id)}
        >
          <div className="flex items-center">
            <div className={`w-2 h-10 rounded-full mr-3 ${isActive ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
            <div>
              <h3 className="font-bold text-gray-800 dark:text-white">{plan.name}</h3>
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                <FaCalendarAlt className="mr-1" />
                <span>{plan.duration} semanas</span>
                <span className="mx-2">•</span>
                <span>{plan.primaryGoal === 'hypertrophy' ? 'Hipertrofia' :
                       plan.primaryGoal === 'strength' ? 'Fuerza' :
                       plan.primaryGoal === 'fat_loss' ? 'Pérdida de grasa' :
                       plan.primaryGoal === 'endurance' ? 'Resistencia' : 'General'}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center">
            <div className="relative">
              <button
                onClick={(e) => toggleMenu(plan.id, e)}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <FaEllipsisH className="text-gray-500 dark:text-gray-400" />
              </button>

              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-10 border border-gray-200 dark:border-gray-700">
                  {!isActive && plan.status !== 'archived' && (
                    <button
                      onClick={(e) => handleActivatePlan(plan.id, e)}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                    >
                      <FaCalendarAlt className="mr-2" />
                      Activar plan
                    </button>
                  )}

                  <button
                    onClick={(e) => handleViewPlan(plan.id, e)}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                  >
                    <FaEye className="mr-2" />
                    Ver detalles
                  </button>

                  <button
                    onClick={(e) => handleViewStats(plan.id, e)}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                  >
                    <FaChartLine className="mr-2" />
                    Ver estadísticas
                  </button>

                  <button
                    onClick={(e) => handleComparePlans(plan.id, e)}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                  >
                    <FaExchangeAlt className="mr-2" />
                    Comparar
                  </button>

                  {plan.status !== 'archived' && (
                    <button
                      onClick={(e) => handleArchivePlan(plan.id, e)}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                    >
                      <FaArchive className="mr-2" />
                      Archivar
                    </button>
                  )}

                  <button
                    onClick={(e) => handleDeletePlan(plan.id, e)}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center"
                  >
                    <FaTrash className="mr-2" />
                    Eliminar
                  </button>
                </div>
              )}
            </div>

            {isExpanded ? <FaChevronUp className="ml-2 text-gray-400" /> : <FaChevronDown className="ml-2 text-gray-400" />}
          </div>
        </div>

        {isExpanded && (
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-gray-600 dark:text-gray-400 mb-4">{plan.description}</p>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Objetivo principal</h4>
                <p className="text-gray-800 dark:text-white">
                  {plan.primaryGoal === 'hypertrophy' ? 'Hipertrofia' :
                   plan.primaryGoal === 'strength' ? 'Fuerza' :
                   plan.primaryGoal === 'fat_loss' ? 'Pérdida de grasa' :
                   plan.primaryGoal === 'endurance' ? 'Resistencia' : 'General'}
                </p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Objetivos secundarios</h4>
                <p className="text-gray-800 dark:text-white">
                  {plan.secondaryGoals && plan.secondaryGoals.length > 0
                    ? plan.secondaryGoals.map(goal =>
                        goal === 'hypertrophy' ? 'Hipertrofia' :
                        goal === 'strength' ? 'Fuerza' :
                        goal === 'fat_loss' ? 'Pérdida de grasa' :
                        goal === 'endurance' ? 'Resistencia' : 'General'
                      ).join(', ')
                    : 'Ninguno'}
                </p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Duración</h4>
                <p className="text-gray-800 dark:text-white">{plan.planDuration} semanas</p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Periodización</h4>
                <p className="text-gray-800 dark:text-white">
                  {plan.periodizationType === 'linear' ? 'Lineal' :
                   plan.periodizationType === 'undulating' ? 'Ondulante' :
                   plan.periodizationType === 'block' ? 'Por bloques' : 'Personalizada'}
                </p>
              </div>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={(e) => handleViewPlan(plan.id, e)}
                className="py-2 px-4 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors flex-1 flex items-center justify-center"
              >
                <FaEye className="mr-2" />
                Ver detalles
              </button>

              {!isActive && plan.status !== 'archived' && (
                <button
                  onClick={(e) => handleActivatePlan(plan.id, e)}
                  className="py-2 px-4 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors flex-1 flex items-center justify-center"
                >
                  <FaCalendarAlt className="mr-2" />
                  Activar plan
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-6 pt-14 pb-20">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Planes de Entrenamiento</h1>
        <div className="flex space-x-2">
          <button
            onClick={() => navigate('/plans/import-export')}
            className="py-2 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center"
          >
            <FaExchangeAlt className="mr-2" />
            Importar/Exportar
          </button>
          <button
            onClick={() => navigate('/plan/config')}
            className="py-2 px-4 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors flex items-center"
          >
            <FaPlus className="mr-2" />
            Crear Plan
          </button>
        </div>
      </div>

      {/* Planes activos */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Planes de Entrenamiento Activos</h2>

        {activePlans.length > 0 ? (
          activePlans.map(plan => renderPlan(plan, plan.id === activePlanId))
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 text-center">
            <p className="text-gray-600 dark:text-gray-400">No hay planes activos. Activa un plan disponible o crea uno nuevo.</p>
          </div>
        )}
      </div>

      {/* Planes disponibles */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Planes de Entrenamiento Disponibles</h2>

        {availablePlans.length > 0 ? (
          availablePlans.map(plan => renderPlan(plan))
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 text-center">
            <p className="text-gray-600 dark:text-gray-400">No hay planes disponibles. Crea un nuevo plan.</p>
          </div>
        )}
      </div>

      {/* Planes históricos */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">Planes de Entrenamiento Históricos</h2>
          <button
            onClick={() => navigate('/plans/history')}
            className="py-1.5 px-3 bg-amber-600 text-white rounded-lg text-sm font-medium hover:bg-amber-700 transition-colors flex items-center"
          >
            <FaExternalLinkAlt className="mr-1.5" />
            Ver todos
          </button>
        </div>

        {historicalPlans.length > 0 ? (
          <div>
            {historicalPlans.slice(0, 3).map(plan => renderPlan(plan))}

            {historicalPlans.length > 3 && (
              <div className="text-center mt-4">
                <button
                  onClick={() => navigate('/plans/history')}
                  className="text-primary-600 hover:text-primary-700 dark:text-primary-500 dark:hover:text-primary-400 font-medium"
                >
                  Ver {historicalPlans.length - 3} planes históricos más
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 text-center">
            <p className="text-gray-600 dark:text-gray-400">No hay planes históricos. Los planes archivados aparecerán aquí.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlansManagementPage;
