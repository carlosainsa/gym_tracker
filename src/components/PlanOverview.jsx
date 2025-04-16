import React, { useState } from 'react';
import { FaCalendarAlt, FaDumbbell, FaChevronDown, FaChevronUp } from 'react-icons/fa';

/**
 * Componente para mostrar una vista previa de un plan de entrenamiento
 */
const PlanOverview = ({ plan, isPreview = false }) => {
  const [expandedMicrocycleId, setExpandedMicrocycleId] = useState(null);
  const [expandedSessionId, setExpandedSessionId] = useState(null);
  
  // Manejar la expansión de un microciclo
  const toggleMicrocycle = (id) => {
    setExpandedMicrocycleId(expandedMicrocycleId === id ? null : id);
    setExpandedSessionId(null);
  };
  
  // Manejar la expansión de una sesión
  const toggleSession = (id) => {
    setExpandedSessionId(expandedSessionId === id ? null : id);
  };
  
  // Formatear el día de la semana
  const formatWeekday = (day) => {
    const weekdays = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    return weekdays[day % 7];
  };
  
  // Obtener el nombre legible del tipo de periodización
  const getPeriodizationName = (type) => {
    switch (type) {
      case 'linear':
        return 'Lineal';
      case 'undulating':
        return 'Ondulante';
      case 'block':
        return 'Por bloques';
      case 'conjugate':
        return 'Conjugada';
      default:
        return type;
    }
  };
  
  // Obtener el nombre legible del tipo de división
  const getSplitName = (split) => {
    switch (split) {
      case 'full_body':
        return 'Cuerpo completo';
      case 'upper_lower':
        return 'Superior/Inferior';
      case 'push_pull_legs':
        return 'Empuje/Tirón/Piernas';
      case 'body_part_split':
        return 'División por grupos musculares';
      default:
        return split;
    }
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
  
  if (!plan) {
    return null;
  }
  
  return (
    <div className="space-y-6">
      {/* Información general del plan */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
        <div className="p-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
          <h2 className="font-medium text-gray-800 dark:text-white flex items-center">
            <FaCalendarAlt className="text-primary-500 mr-2" />
            Información General
          </h2>
        </div>
        
        <div className="p-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Duración</p>
              <p className="text-lg font-bold text-gray-800 dark:text-white">{plan.microcycles?.length || plan.duration || '?'} semanas</p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Frecuencia</p>
              <p className="text-lg font-bold text-gray-800 dark:text-white">{plan.frequency || '?'} días/semana</p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Objetivo principal</p>
              <p className="text-lg font-bold text-gray-800 dark:text-white">{getGoalName(plan.primaryGoal)}</p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Nivel de dificultad</p>
              <p className="text-lg font-bold text-gray-800 dark:text-white">{getDifficultyName(plan.difficultyLevel)}</p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Tipo de periodización</p>
              <p className="text-lg font-bold text-gray-800 dark:text-white">{getPeriodizationName(plan.periodizationType)}</p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Tipo de división</p>
              <p className="text-lg font-bold text-gray-800 dark:text-white">{getSplitName(plan.splitType)}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Estructura del plan */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
        <div className="p-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
          <h2 className="font-medium text-gray-800 dark:text-white flex items-center">
            <FaDumbbell className="text-primary-500 mr-2" />
            Estructura del Plan
          </h2>
        </div>
        
        <div className="p-4">
          {plan.microcycles && plan.microcycles.length > 0 ? (
            <div className="space-y-4">
              {plan.microcycles.map((microcycle) => (
                <div key={microcycle.id} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                  <button
                    onClick={() => toggleMicrocycle(microcycle.id)}
                    className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 text-left"
                  >
                    <div>
                      <h3 className="font-medium text-gray-800 dark:text-white">{microcycle.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {microcycle.trainingSessions.length} sesiones
                      </p>
                    </div>
                    {expandedMicrocycleId === microcycle.id ? (
                      <FaChevronUp className="text-gray-500 dark:text-gray-400" />
                    ) : (
                      <FaChevronDown className="text-gray-500 dark:text-gray-400" />
                    )}
                  </button>
                  
                  {expandedMicrocycleId === microcycle.id && (
                    <div className="p-4 space-y-3">
                      {microcycle.trainingSessions.map((session) => (
                        <div key={session.id} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                          <button
                            onClick={() => toggleSession(session.id)}
                            className="w-full flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 text-left"
                          >
                            <div>
                              <h4 className="font-medium text-gray-800 dark:text-white">{session.name}</h4>
                              <p className="text-xs text-gray-600 dark:text-gray-400">
                                {formatWeekday(session.day)} • {session.exercises.length} ejercicios
                              </p>
                            </div>
                            {expandedSessionId === session.id ? (
                              <FaChevronUp className="text-gray-500 dark:text-gray-400" />
                            ) : (
                              <FaChevronDown className="text-gray-500 dark:text-gray-400" />
                            )}
                          </button>
                          
                          {expandedSessionId === session.id && (
                            <div className="p-3">
                              <div className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                                {session.description}
                              </div>
                              
                              <div className="space-y-3">
                                {session.exercises.map((exercise) => (
                                  <div key={exercise.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                                    <h5 className="font-medium text-gray-800 dark:text-white mb-2">{exercise.name}</h5>
                                    
                                    <div className="overflow-x-auto">
                                      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                        <thead>
                                          <tr>
                                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Serie</th>
                                            <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Reps</th>
                                            <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Peso (kg)</th>
                                            <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Descanso</th>
                                          </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                          {exercise.sets.map((set, index) => (
                                            <tr key={set.id}>
                                              <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">{index + 1}</td>
                                              <td className="px-3 py-2 whitespace-nowrap text-sm text-center text-gray-800 dark:text-white">
                                                {set.repsMin === set.repsMax ? set.repsMin : `${set.repsMin}-${set.repsMax}`}
                                              </td>
                                              <td className="px-3 py-2 whitespace-nowrap text-sm text-center text-gray-800 dark:text-white">
                                                {set.weight}
                                              </td>
                                              <td className="px-3 py-2 whitespace-nowrap text-sm text-center text-gray-800 dark:text-white">
                                                {set.restTime}s
                                              </td>
                                            </tr>
                                          ))}
                                        </tbody>
                                      </table>
                                    </div>
                                    
                                    {exercise.notes && (
                                      <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                                        <span className="font-medium">Notas:</span> {exercise.notes}
                                      </p>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 dark:text-gray-400 text-center py-4">
              No hay información detallada disponible para este plan.
            </p>
          )}
        </div>
      </div>
      
      {isPreview && (
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
          <p className="text-sm text-blue-700 dark:text-blue-400 text-center">
            Esta es una vista previa del plan. Para acceder a todas las funcionalidades, importa el plan a tu cuenta.
          </p>
        </div>
      )}
    </div>
  );
};

export default PlanOverview;
