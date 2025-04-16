import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaCalendarAlt, FaDumbbell, FaCog, FaChevronDown, FaChevronUp, FaCheck, FaStopwatch } from 'react-icons/fa';
import { useTraining } from '../context/TrainingContext';

const NewPlanPage = () => {
  const navigate = useNavigate();
  const { trainingPlan, userPreferences, loading } = useTraining();

  const [expandedMicrocycle, setExpandedMicrocycle] = useState(null);
  const [expandedSession, setExpandedSession] = useState(null);

  // Expandir el microciclo actual por defecto
  useEffect(() => {
    if (trainingPlan && userPreferences && !expandedMicrocycle) {
      const currentPhase = userPreferences.trainingPreferences.currentPhase;

      // Buscar microciclos de la fase actual
      const phaseMicrocycles = trainingPlan.microcycles.filter(mc => mc.phase === currentPhase);

      if (phaseMicrocycles.length > 0) {
        setExpandedMicrocycle(phaseMicrocycles[0].id);
      }
    }
  }, [trainingPlan, userPreferences, expandedMicrocycle]);

  // Manejar la expansión de un microciclo
  const toggleMicrocycle = (microcycleId) => {
    if (expandedMicrocycle === microcycleId) {
      setExpandedMicrocycle(null);
    } else {
      setExpandedMicrocycle(microcycleId);
      setExpandedSession(null);
    }
  };

  // Manejar la expansión de una sesión
  const toggleSession = (sessionId) => {
    if (expandedSession === sessionId) {
      setExpandedSession(null);
    } else {
      setExpandedSession(sessionId);
    }
  };

  // Formatear el tiempo de descanso
  const formatRest = (rest) => {
    if (!rest) return '60 seg';

    // Si ya tiene formato, devolverlo tal cual
    if (typeof rest === 'string' && (rest.includes('seg') || rest.includes('min'))) {
      return rest;
    }

    // Convertir a segundos
    const seconds = parseInt(rest);
    if (isNaN(seconds)) return '60 seg';

    if (seconds >= 60) {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      return remainingSeconds > 0 ? `${minutes}:${remainingSeconds.toString().padStart(2, '0')} min` : `${minutes} min`;
    } else {
      return `${seconds} seg`;
    }
  };

  // Obtener el color de progreso
  const getProgressColor = (progress) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  // Nombres de los días de la semana
  const dayNames = {
    0: 'Domingo',
    1: 'Lunes',
    2: 'Martes',
    3: 'Miércoles',
    4: 'Jueves',
    5: 'Viernes',
    6: 'Sábado'
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 pt-16 pb-24 max-w-lg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Cargando plan de entrenamiento...</p>
        </div>
      </div>
    );
  }

  if (!trainingPlan) {
    return (
      <div className="container mx-auto px-4 py-8 pt-16 pb-24 max-w-lg">
        <div className="text-center">
          <div className="bg-yellow-50 dark:bg-yellow-900/30 p-6 rounded-xl border border-yellow-200 dark:border-yellow-800 mb-6">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">No hay plan disponible</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              No se ha encontrado ningún plan de entrenamiento. Puedes crear uno nuevo haciendo clic en el botón de abajo.
            </p>
            <button
              onClick={() => navigate('/plan/config')}
              className="py-2 px-4 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors"
            >
              Crear Plan
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Filtrar microciclos por fase actual
  const currentPhase = userPreferences?.trainingPreferences?.currentPhase || 1;
  const currentMicrocycles = trainingPlan.microcycles.filter(mc => mc.phase === currentPhase);

  return (
    <div className="container mx-auto px-4 py-8 pt-16 pb-24 max-w-lg">
      {/* Encabezado */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <FaArrowLeft className="text-gray-600 dark:text-gray-300" />
        </button>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Plan de Entrenamiento</h1>
        <button
          onClick={() => navigate('/plan/config')}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <FaCog className="text-gray-600 dark:text-gray-300" />
        </button>
      </div>

      {/* Información del plan */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden mb-6">
        <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
          <h2 className="text-xl font-bold">{trainingPlan.name}</h2>
          <p className="text-white text-opacity-90 mt-1">{trainingPlan.description}</p>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Objetivo principal</p>
              <p className="font-medium text-gray-800 dark:text-white">
                {trainingPlan.primaryGoal === 'hypertrophy' ? 'Hipertrofia' :
                 trainingPlan.primaryGoal === 'strength' ? 'Fuerza' :
                 trainingPlan.primaryGoal === 'endurance' ? 'Resistencia' :
                 trainingPlan.primaryGoal === 'fat_loss' ? 'Pérdida de grasa' :
                 'Fitness general'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Duración</p>
              <p className="font-medium text-gray-800 dark:text-white">{trainingPlan.planDuration} semanas</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Periodización</p>
              <p className="font-medium text-gray-800 dark:text-white">
                {trainingPlan.periodizationType === 'linear' ? 'Lineal' :
                 trainingPlan.periodizationType === 'undulating' ? 'Ondulante' :
                 trainingPlan.periodizationType === 'block' ? 'Bloques' :
                 trainingPlan.periodizationType === 'conjugate' ? 'Conjugada' :
                 'Auto-regulada'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Progreso</p>
              <div className="flex items-center">
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mr-2">
                  <div
                    className={`h-2.5 rounded-full ${getProgressColor(trainingPlan.calculateProgress())}`}
                    style={{ width: `${trainingPlan.calculateProgress()}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-gray-800 dark:text-white">{trainingPlan.calculateProgress()}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Selector de fase */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden mb-6">
        <div className="p-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
          <h2 className="font-semibold text-gray-800 dark:text-white flex items-center">
            <FaCalendarAlt className="mr-2 text-primary-500" />
            Fase actual
          </h2>
        </div>
        <div className="p-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Fase</p>
              <p className="font-medium text-gray-800 dark:text-white">Fase {currentPhase}</p>
            </div>
            <div className="flex space-x-2">
              {[1, 2, 3].map(phase => (
                <button
                  key={phase}
                  onClick={() => navigate(`/settings`)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                    phase === currentPhase
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {phase}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Lista de microciclos */}
      <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center">
        <FaDumbbell className="mr-2 text-primary-500" />
        Microciclos
      </h2>

      <div className="space-y-4">
        {currentMicrocycles.length === 0 ? (
          <div className="bg-yellow-50 dark:bg-yellow-900/30 p-6 rounded-xl border border-yellow-200 dark:border-yellow-800">
            <p className="text-gray-600 dark:text-gray-400">
              No hay microciclos disponibles para la fase actual.
            </p>
          </div>
        ) : (
          currentMicrocycles.map(microcycle => (
            <div key={microcycle.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
              {/* Encabezado del microciclo */}
              <button
                onClick={() => toggleMicrocycle(microcycle.id)}
                className="w-full p-4 flex items-center justify-between bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600"
              >
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-white">{microcycle.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {microcycle.weeklyFrequency} días/semana • {microcycle.trainingSessions.length} sesiones
                  </p>
                </div>
                <div className="flex items-center">
                  <div className="w-16 bg-gray-200 dark:bg-gray-600 rounded-full h-2 mr-2">
                    <div
                      className={`h-2 rounded-full ${getProgressColor(microcycle.calculateProgress())}`}
                      style={{ width: `${microcycle.calculateProgress()}%` }}
                    ></div>
                  </div>
                  {expandedMicrocycle === microcycle.id ? (
                    <FaChevronUp className="text-gray-500 dark:text-gray-400" />
                  ) : (
                    <FaChevronDown className="text-gray-500 dark:text-gray-400" />
                  )}
                </div>
              </button>

              {/* Contenido del microciclo */}
              {expandedMicrocycle === microcycle.id && (
                <div className="p-4">
                  {/* Información del microciclo */}
                  <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Intensidad</p>
                        <p className="font-medium text-gray-800 dark:text-white">
                          {microcycle.cycleIntensity === 'light' ? 'Ligera' :
                           microcycle.cycleIntensity === 'medium' ? 'Media' :
                           'Alta'}
                          {microcycle.isDeload && ' (Descarga)'}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Configuración</p>
                        <p className="font-medium text-gray-800 dark:text-white">
                          {microcycle.splitConfiguration === 'fullbody' ? 'Cuerpo Completo' :
                           microcycle.splitConfiguration === 'upper_lower' ? 'Superior/Inferior' :
                           microcycle.splitConfiguration === 'push_pull_legs' ? 'Push/Pull/Legs' :
                           microcycle.splitConfiguration === 'arnold' ? 'Arnold Split' :
                           'Bro Split'}
                        </p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-gray-500 dark:text-gray-400">Días de entrenamiento</p>
                        <p className="font-medium text-gray-800 dark:text-white">
                          {microcycle.trainingDays.map(day => dayNames[day]).join(', ')}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Lista de sesiones */}
                  <h4 className="font-medium text-gray-800 dark:text-white mb-2">Sesiones de entrenamiento</h4>
                  <div className="space-y-2">
                    {microcycle.trainingSessions.map(session => (
                      <div key={session.id} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                        {/* Encabezado de la sesión */}
                        <button
                          onClick={() => toggleSession(session.id)}
                          className="w-full p-3 flex items-center justify-between bg-white dark:bg-gray-800"
                        >
                          <div>
                            <h5 className="font-medium text-gray-800 dark:text-white">{session.name}</h5>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {session.recommendedDay} • {session.exercises.length} ejercicios • {session.sessionDuration} min
                            </p>
                          </div>
                          <div className="flex items-center">
                            {session.completed && (
                              <span className="mr-2 w-5 h-5 flex items-center justify-center bg-green-100 dark:bg-green-800 rounded-full">
                                <FaCheck className="text-green-500 dark:text-green-300 text-xs" />
                              </span>
                            )}
                            {expandedSession === session.id ? (
                              <FaChevronUp className="text-gray-500 dark:text-gray-400" />
                            ) : (
                              <FaChevronDown className="text-gray-500 dark:text-gray-400" />
                            )}
                          </div>
                        </button>

                        {/* Contenido de la sesión */}
                        {expandedSession === session.id && (
                          <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30">
                            {/* Estructura de la sesión */}
                            {session.sessionStructure && (
                              <div className="mb-4">
                                {session.sessionStructure.warmup && session.sessionStructure.warmup.length > 0 && (
                                  <div className="mb-3">
                                    <h6 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Calentamiento</h6>
                                    <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1 pl-4">
                                      {session.sessionStructure.warmup.map((item, index) => (
                                        <li key={index} className="list-disc">{item}</li>
                                      ))}
                                    </ul>
                                  </div>
                                )}

                                {session.sessionStructure.finisher && session.sessionStructure.finisher.length > 0 && (
                                  <div>
                                    <h6 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Finalización</h6>
                                    <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1 pl-4">
                                      {session.sessionStructure.finisher.map((item, index) => (
                                        <li key={index} className="list-disc">{item}</li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                              </div>
                            )}

                            {/* Lista de ejercicios */}
                            <h6 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Ejercicios</h6>
                            <div className="space-y-3">
                              {session.exercises.map((exercise, index) => (
                                <div key={exercise.id} className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                                  <div className="flex justify-between items-start mb-2">
                                    <div>
                                      <h6 className="font-medium text-gray-800 dark:text-white">{index + 1}. {exercise.name}</h6>
                                      <p className="text-xs text-gray-500 dark:text-gray-400">
                                        {exercise.muscleGroups.join(', ')} • {exercise.equipment} • Descanso: {formatRest(exercise.rest)}
                                      </p>
                                    </div>
                                    <div className="w-8 h-8 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-full">
                                      <span className="text-xs font-medium text-gray-800 dark:text-white">{exercise.sets.length}x</span>
                                    </div>
                                  </div>

                                  {/* Series */}
                                  <div className="mt-2">
                                    <div className="grid grid-cols-3 gap-1 text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                                      <div>Serie</div>
                                      <div>Reps</div>
                                      <div>Peso</div>
                                    </div>
                                    {exercise.sets.map((set, setIndex) => (
                                      <div key={setIndex} className="grid grid-cols-3 gap-1 text-sm py-1 border-t border-gray-100 dark:border-gray-700">
                                        <div className="font-medium text-gray-700 dark:text-gray-300">{setIndex + 1}</div>
                                        <div className="text-gray-800 dark:text-white">{set.reps}</div>
                                        <div className="text-gray-800 dark:text-white">
                                          {set.weight === 'Peso corporal' ? 'Peso corporal' :
                                           set.weight ? parseFloat(set.weight).toFixed(1) + 'kg' : '-'}
                                        </div>
                                      </div>
                                    ))}
                                  </div>

                                  {/* Notas */}
                                  {exercise.notes && (
                                    <div className="mt-2 text-xs text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/30 p-2 rounded">
                                      <span className="font-medium">Notas:</span> {exercise.notes}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>

                            {/* Botones para registrar entrenamiento */}
                            <div className="grid grid-cols-2 gap-2 mt-4">
                              <button
                                onClick={() => navigate(`/workout/${session.id}`)}
                                className="py-2 px-4 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors flex items-center justify-center"
                              >
                                <FaDumbbell className="mr-2" />
                                Registro Básico
                              </button>
                              <button
                                onClick={() => navigate(`/workout/advanced/${session.id}`)}
                                className="py-2 px-4 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center"
                              >
                                <FaStopwatch className="mr-2" />
                                Registro Avanzado
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NewPlanPage;
