import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaExchangeAlt } from 'react-icons/fa';
import { useTraining } from '../context/TrainingContext';
import PlanTransitionForm from '../components/PlanTransitionForm';

/**
 * Página para crear un plan de transición a partir de un plan existente
 */
const PlanTransitionPage = () => {
  const { planId } = useParams();
  const navigate = useNavigate();
  const { trainingPlans } = useTraining();
  const [sourcePlan, setSourcePlan] = useState(null);
  
  // Cargar el plan de origen
  useEffect(() => {
    if (trainingPlans && planId) {
      const foundPlan = trainingPlans.find(p => p.id === planId);
      if (foundPlan) {
        setSourcePlan(foundPlan);
      }
    }
  }, [trainingPlans, planId]);
  
  // Manejar la finalización de la transición
  const handleTransitionComplete = (newPlan) => {
    if (newPlan) {
      // Navegar a la página de detalles del nuevo plan
      navigate(`/plan/${newPlan.id}`);
    } else {
      // Cancelar y volver a la página anterior
      navigate(-1);
    }
  };
  
  // Si no se encuentra el plan, mostrar mensaje de error
  if (!sourcePlan) {
    return (
      <div className="container mx-auto px-4 py-8 pt-16 pb-24 max-w-lg">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <FaArrowLeft className="text-gray-600 dark:text-gray-300" />
          </button>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Transición de Plan</h1>
          <div className="w-8"></div>
        </div>
        
        <div className="bg-yellow-50 dark:bg-yellow-900/30 p-6 rounded-xl border border-yellow-200 dark:border-yellow-800">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Plan no encontrado</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            No se ha encontrado el plan de entrenamiento solicitado.
          </p>
          <button
            onClick={() => navigate('/plans')}
            className="py-2 px-4 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors"
          >
            Volver a Planes
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8 pt-16 pb-24 max-w-2xl">
      {/* Encabezado */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <FaArrowLeft className="text-gray-600 dark:text-gray-300" />
        </button>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Transición de Plan</h1>
        <div className="w-8"></div>
      </div>
      
      {/* Información del plan de origen */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden mb-6">
        <div className="p-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white">
          <div className="flex items-center">
            <FaExchangeAlt className="mr-2" />
            <h2 className="text-lg font-medium">Crear plan de transición</h2>
          </div>
          <p className="text-white text-opacity-90 mt-1">
            Crea un nuevo plan basado en <span className="font-medium">{sourcePlan.name}</span>
          </p>
        </div>
        
        <div className="p-6">
          <PlanTransitionForm 
            sourcePlan={sourcePlan} 
            onTransitionComplete={handleTransitionComplete} 
          />
        </div>
      </div>
    </div>
  );
};

export default PlanTransitionPage;
