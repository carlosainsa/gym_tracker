import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaExchangeAlt, FaChartLine, FaArrowRight } from 'react-icons/fa';

/**
 * Componente para mostrar planes recomendados para comparar
 */
const RecommendedPlanComparisons = ({ recommendations, basePlanName }) => {
  const navigate = useNavigate();
  
  if (!recommendations || recommendations.length === 0) {
    return (
      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg text-center">
        <p className="text-gray-600 dark:text-gray-400">No hay planes recomendados para comparar.</p>
      </div>
    );
  }
  
  // Función para obtener el color de la puntuación de similitud
  const getSimilarityColor = (score) => {
    if (score >= 80) return 'text-green-600 dark:text-green-400';
    if (score >= 60) return 'text-blue-600 dark:text-blue-400';
    if (score >= 40) return 'text-amber-600 dark:text-amber-400';
    return 'text-gray-600 dark:text-gray-400';
  };
  
  return (
    <div className="space-y-3">
      {recommendations.map(plan => (
        <div 
          key={plan.id}
          className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => navigate(`/plan/compare/${plan.id}`)}
        >
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-medium text-gray-800 dark:text-white">{plan.name}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {plan.primaryGoal === 'hypertrophy' ? 'Hipertrofia' :
                 plan.primaryGoal === 'strength' ? 'Fuerza' :
                 plan.primaryGoal === 'fat_loss' ? 'Pérdida de grasa' :
                 plan.primaryGoal === 'endurance' ? 'Resistencia' : 'General'}
                 {plan.status === 'active' ? ' • Activo' : 
                  plan.status === 'available' ? ' • Disponible' : 
                  plan.status === 'archived' ? ' • Archivado' : ''}
              </p>
            </div>
            
            <div className="flex items-center">
              <div className="mr-3">
                <div className={`text-sm font-bold ${getSimilarityColor(plan.similarityScore)}`}>
                  {plan.similarityScore}%
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">similitud</div>
              </div>
              
              <FaArrowRight className="text-primary-500" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecommendedPlanComparisons;
