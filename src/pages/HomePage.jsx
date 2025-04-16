import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWorkout } from '../context/WorkoutContext';
import { FaHistory, FaDumbbell, FaCalendarAlt, FaChevronRight, FaCheck } from 'react-icons/fa';
import WorkoutCard from '../components/WorkoutCard';
import TodaysWorkoutCard from '../components/TodaysWorkoutCard';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { workoutPlan } from '../data/workoutPlan';
import { isTrainingDay, getTrainingIndexForDay } from '../config/trainingConfig';

const HomePage = () => {
  const navigate = useNavigate();
  const { plan, currentPhase, workoutLogs } = useWorkout();
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [todaysWorkout, setTodaysWorkout] = useState(null);
  const [recentWorkouts, setRecentWorkouts] = useState([]);
  const [completionRate, setCompletionRate] = useState(0);
  const [mounted, setMounted] = useState(true);

  const currentPhaseDays = useMemo(() => {
    return workoutPlan.filter(day => day.phase === currentPhase);
  }, [workoutPlan, currentPhase]);

  // Función para actualizar el entrenamiento del día
  const updateTodaysWorkout = useCallback(() => {
    if (!mounted) return;

    const today = new Date().getDay(); // 0-6 (Domingo-Sábado)

    // Usar la configuración de trainingConfig para determinar si es día de entrenamiento
    const trainingDay = isTrainingDay(today);

    // Si no es día de entrenamiento, mostrar mensaje de descanso
    if (!trainingDay) {
      // Crear un objeto de entrenamiento de descanso
      const restWorkout = {
        id: 'rest-day',
        name: 'Día de Descanso',
        description: 'Hoy es tu día de descanso. Aprovecha para recuperarte.',
        exercises: [],
        isRestDay: true,
        recommendedDay: 'Hoy'
      };

      setTodaysWorkout(restWorkout);
      setSelectedDayIndex(-1); // Usar -1 para indicar que no es un día de entrenamiento regular
      return;
    }

    // Obtener el índice de entrenamiento para hoy usando la configuración
    const trainingIndex = getTrainingIndexForDay(today);

    if (trainingIndex >= 0 && trainingIndex < currentPhaseDays.length) {
      setTodaysWorkout(currentPhaseDays[trainingIndex]);
      setSelectedDayIndex(trainingIndex);
    } else if (currentPhaseDays.length > 0) {
      // Si no hay un entrenamiento específico para hoy, usar el primero
      setTodaysWorkout(currentPhaseDays[0]);
      setSelectedDayIndex(0);
    }
  }, [currentPhaseDays, mounted]);

  // Efecto inicial para asegurar que haya un entrenamiento seleccionado
  useEffect(() => {
    if (!todaysWorkout && currentPhaseDays.length > 0) {
      setTodaysWorkout(currentPhaseDays[0]);
      setSelectedDayIndex(0);
    }
  }, [currentPhaseDays, todaysWorkout]);

  // Efecto para actualizar el workout del día
  useEffect(() => {
    updateTodaysWorkout();
  }, [updateTodaysWorkout]);

  // Memoizar la función de actualización de estadísticas
  const updateWorkoutStats = useCallback(async () => {
    if (!mounted) return;

    try {
      if (workoutLogs?.logs) {
      const sortedLogs = [...workoutLogs.logs]
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5);
      setRecentWorkouts(sortedLogs);
    }

    if (currentPhaseDays.length > 0) {
      const totalProgress = currentPhaseDays.reduce((sum, day) => sum + (day.progress || 0), 0);
      setCompletionRate(Math.round(totalProgress / currentPhaseDays.length));
    }
    } catch (error) {
      console.error('Error al actualizar estadísticas:', error);
    }
  }, [workoutLogs, currentPhaseDays, mounted]);

  // Efecto para workouts recientes y tasa de completado
  useEffect(() => {
    updateWorkoutStats();
  }, [updateWorkoutStats]);

  // Cleanup effect
  useEffect(() => {
    return () => {
      setMounted(false);
    };
  }, []);

  // Memoizar la función de registro de cambios
  const logWorkoutChange = useCallback(async (fromWorkout, toWorkout, reason) => {
    if (!mounted) return;

    try {
      const now = new Date();
      const newLog = {
        id: `change-${now.getTime()}`,
        date: now.toISOString(),
        type: 'workout-change',
        from: fromWorkout ? fromWorkout.name : 'Día de Descanso',
        to: toWorkout ? toWorkout.name : 'Día de Descanso',
        reason: reason
      };

      setRecentWorkouts(prev => [newLog, ...prev.slice(0, 4)]);
    } catch (error) {
      console.error('Error al registrar cambio de entrenamiento:', error);
    }
  }, [mounted]);

  const formattedDate = format(new Date(), "EEEE, d 'de' MMMM", { locale: es });

  const restMessage = {
    title: "Día de Descanso",
    description: "Hoy es un día de descanso programado. El descanso activo es fundamental para la recuperación muscular y el progreso en tu entrenamiento. Actividades recomendadas para hoy:\n- Caminata ligera (20-30 min)\n- Estiramientos suaves\n- Yoga básico\n- Movilidad articular"
  };

  return (
    <div className="container mx-auto px-4 py-8 pt-16 pb-24 max-w-lg">
      {/* Encabezado con fecha y fase */}
      <div className="mb-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold">
          {formattedDate}
        </h1>
        <p className="text-white text-opacity-90 mt-1">
          Microciclo {currentPhase} de tu plan de entrenamiento
        </p>
      </div>

      {/* Sesión de Entrenamiento de hoy - Sección destacada */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
          <span className="bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 p-2 rounded-lg mr-3">
            <FaDumbbell />
          </span>
          Sesión de Entrenamiento de hoy
        </h2>
        {todaysWorkout ? (
          <div className="transform transition-all duration-300 hover:scale-[1.01]">
            <TodaysWorkoutCard workout={todaysWorkout} />
          </div>
        ) : (
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl shadow-md p-6 text-center border-l-4 border-blue-500">
            <h3 className="text-xl font-medium text-gray-700 dark:text-gray-200 mb-3">
              Día de Descanso
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {restMessage.description}
            </p>
          </div>
        )}
      </div>

      {/* Sesiones de Entrenamiento Disponibles */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
          <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 p-2 rounded-lg mr-3">
            <FaCalendarAlt />
          </span>
          Sesiones de Entrenamiento Disponibles
        </h2>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-700">
          <div className="grid grid-cols-1 divide-y divide-gray-100 dark:divide-gray-700">
            {/* Opción de Descanso (ahora al principio) */}
            <button
              onClick={() => {
                const previousWorkout = todaysWorkout;
                setTodaysWorkout(null);
                setSelectedDayIndex(-1);
                if (previousWorkout) {
                  logWorkoutChange(previousWorkout, null, 'Cambio a descanso');
                }
              }}
              className={`w-full text-left p-4 transition-colors ${
                todaysWorkout === null
                  ? 'bg-primary-50 dark:bg-primary-900/30'
                  : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
              }`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium text-gray-800 dark:text-white">
                    Día de Descanso
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    Recuperación activa • Actividades suaves recomendadas
                  </p>
                </div>
                {todaysWorkout === null && (
                  <span className="w-6 h-6 flex items-center justify-center bg-blue-100 dark:bg-blue-800 rounded-full">
                    <FaCheck className="text-blue-500 dark:text-blue-300 text-xs" />
                  </span>
                )}
              </div>
            </button>
            {/* Sesiones de entrenamiento regulares */}
            {currentPhaseDays.map((day, index) => (
              <button
                key={day.id}
                onClick={() => {
                  const previousWorkout = todaysWorkout;
                  setSelectedDayIndex(index);
                  setTodaysWorkout(day);
                  if (previousWorkout?.id !== day.id) {
                    logWorkoutChange(previousWorkout, day, 'Cambio de sesión de entrenamiento');
                  }
                }}
                className={`w-full text-left p-4 transition-colors ${
                  todaysWorkout?.id === day.id
                    ? 'bg-primary-50 dark:bg-primary-900/30'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
                }`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium text-gray-800 dark:text-white">
                      {day.name}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      {day.recommendedDay || 'Flexible'} • {day.exercises.length} ejercicios
                    </p>
                  </div>

                  {day.progress > 0 ? (
                    <span className="px-2 py-0.5 bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200 rounded-full text-xs font-medium">
                      {day.progress}%
                    </span>
                  ) : (
                    <span className="w-6 h-6 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-full">
                      <FaChevronRight className="text-gray-400 dark:text-gray-500 text-xs" />
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Actividad reciente */}
      {recentWorkouts.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-3 text-gray-800 dark:text-white flex items-center">
            <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 p-2 rounded-lg mr-3">
              <FaHistory />
            </span>
            Actividad Reciente
          </h2>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-700">
            <div className="grid grid-cols-1 divide-y divide-gray-100 dark:divide-gray-700">
              {recentWorkouts.map(log => {
                if (log.type === 'workout-change') {
                  return (
                    <div key={log.id} className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-gray-800 dark:text-white">Cambio de Sesión de Entrenamiento</h3>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                            De: <span className="font-medium">{log.from}</span><br/>
                            A: <span className="font-medium">{log.to}</span>
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-500 mt-0.5">{format(new Date(log.date), "EEEE, d 'de' MMMM", { locale: es })}</p>
                        </div>
                        <span className="text-xs font-medium px-2 py-0.5 bg-yellow-100 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200 rounded-full">
                          Cambio
                        </span>
                      </div>
                    </div>
                  );
                }

                const exercise = plan.flatMap(day => day.exercises).find(ex => ex.id === log.exerciseId);
                return (
                  <div key={log.id} className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-800 dark:text-white">{exercise?.name || 'Ejercicio'}</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-0.5">{format(new Date(log.date), "EEEE, d 'de' MMMM", { locale: es })}</p>
                      </div>
                      <span className="text-xs font-medium px-2 py-0.5 bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 rounded-full">
                        {log.actualSets?.length || 0} series
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
