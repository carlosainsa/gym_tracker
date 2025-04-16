import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useWorkout } from '../context/WorkoutContext';
import { FaDumbbell, FaArrowLeft, FaCheck } from 'react-icons/fa';
import RestTimer from '../components/RestTimer';
import ColorLegend from '../components/ColorLegend';
import HorizontalColorLegend from '../components/HorizontalColorLegend';
import ExerciseTimer from '../components/ExerciseTimer';
import ExerciseDuration from '../components/ExerciseDuration';
import WorkoutDuration from '../components/WorkoutDuration';
import SavedNotification from '../components/SavedNotification';

const WorkoutLogPage = () => {
  const navigate = useNavigate();
  const { id: workoutId } = useParams(); // Obtener el ID de la URL
  const { plan, addWorkoutLog, expandedDay, setExpandedDay } = useWorkout();
  const [workout, setWorkout] = useState(null);
  const [exerciseLogs, setExerciseLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeRestTimer, setActiveRestTimer] = useState(null); // { exerciseIndex, setIndex }
  const [showCompletedMessage, setShowCompletedMessage] = useState(false);
  const [timeLog, setTimeLog] = useState({
    startTime: null,
    exercises: {},
    sets: {},
    totalTime: 0
  });
  const [showSavedNotification, setShowSavedNotification] = useState(false);
  const [autoSaveTimer, setAutoSaveTimer] = useState(null);

  // Cargar el entrenamiento seleccionado
  useEffect(() => {
    setLoading(true);
    setError(null);

    // Determinar el ID del entrenamiento (de la URL o del estado)
    const targetWorkoutId = workoutId ? parseInt(workoutId) : expandedDay;

    if (targetWorkoutId) {
      // Si tenemos un ID, buscar el entrenamiento en el plan
      const selectedWorkout = plan.find(day => day.id === targetWorkoutId);

      if (selectedWorkout) {
        // Actualizar el estado expandedDay si viene de la URL
        if (workoutId && expandedDay !== targetWorkoutId) {
          setExpandedDay(targetWorkoutId);
        }

        setWorkout(selectedWorkout);
        // Inicializar los logs de ejercicios
        setExerciseLogs(
          selectedWorkout.exercises.map(exercise => ({
            exerciseId: exercise.id,
            sets: Array(typeof exercise.sets === 'number' ? exercise.sets : exercise.sets.length)
              .fill()
              .map(() => ({ reps: '', weight: '' })),
            notes: ''
          }))
        );

        // Inicializar el registro de tiempos
        const now = new Date();
        setTimeLog({
          startTime: now,
          exercises: {},
          sets: {},
          totalTime: 0
        });
      } else {
        setError('No se encontró el entrenamiento seleccionado');
      }
    } else {
      setError('No se ha seleccionado ningún entrenamiento');
    }

    setLoading(false);
  }, [workoutId, expandedDay, plan, setExpandedDay]);

  const handleSetChange = (exerciseIndex, setIndex, field, value) => {
    setExerciseLogs(prev => {
      const newLogs = [...prev];
      newLogs[exerciseIndex].sets[setIndex][field] = value;

      // Verificar si es un ejercicio basado en tiempo
      const exercise = workout.exercises[exerciseIndex];
      const isTimeBasedExercise = (exercise.reps || '').toString().includes('seg') ||
                                 (Array.isArray(exercise.sets) && exercise.sets[0]?.reps?.toString().includes('seg'));

      // Para ejercicios normales, verificar si ambos campos tienen valores
      // Para ejercicios de tiempo, solo necesitamos el valor de tiempo (reps)
      const currentSet = newLogs[exerciseIndex].sets[setIndex];
      if ((!isTimeBasedExercise && currentSet.reps && currentSet.weight && !activeRestTimer) ||
          (isTimeBasedExercise && currentSet.reps && !activeRestTimer)) {
        // Registrar el tiempo de la serie
        const now = new Date();
        const setKey = `${exerciseIndex}-${setIndex}`;

        setTimeLog(prevTimeLog => {
          const updatedSets = { ...prevTimeLog.sets };
          updatedSets[setKey] = {
            startTime: prevTimeLog.sets[setKey]?.startTime || prevTimeLog.startTime,
            endTime: now,
            duration: prevTimeLog.sets[setKey]?.startTime ?
                     (now - prevTimeLog.sets[setKey].startTime) / 1000 : // en segundos
                     (now - prevTimeLog.startTime) / 1000
          };

          // Actualizar el tiempo del ejercicio
          const exerciseKey = `${exerciseIndex}`;
          const updatedExercises = { ...prevTimeLog.exercises };
          if (!updatedExercises[exerciseKey]) {
            updatedExercises[exerciseKey] = {
              startTime: prevTimeLog.startTime,
              sets: 1,
              lastSetTime: now
            };
          } else {
            updatedExercises[exerciseKey].sets += 1;
            updatedExercises[exerciseKey].lastSetTime = now;
          }

          return {
            ...prevTimeLog,
            exercises: updatedExercises,
            sets: updatedSets
          };
        });

        // Activar el temporizador automáticamente
        setTimeout(() => {
          handleStartRestTimer(exerciseIndex, setIndex);
        }, 500); // Pequeño retraso para permitir que la UI se actualice
      }

      return newLogs;
    });
  };

  const handleNotesChange = (exerciseIndex, notes) => {
    setExerciseLogs(prev => {
      const newLogs = [...prev];
      newLogs[exerciseIndex].notes = notes;
      return newLogs;
    });
  };

  const handleSave = () => {
    // Calcular el tiempo total del entrenamiento
    const now = new Date();
    const totalTimeInSeconds = (now - timeLog.startTime) / 1000;

    // Actualizar el registro de tiempos
    const updatedTimeLog = {
      ...timeLog,
      endTime: now,
      totalTime: totalTimeInSeconds
    };

    // Guardar cada ejercicio como un registro separado
    exerciseLogs.forEach(log => {
      if (log.sets.some(set => set.reps || set.weight)) {
        const exercise = workout.exercises.find(ex => ex.id === log.exerciseId);
        const plannedSets = typeof exercise.sets === 'number'
          ? Array(exercise.sets).fill({ reps: exercise.reps, weight: exercise.weight })
          : exercise.sets;

        // Calcular el tiempo del ejercicio
        const exerciseIndex = workout.exercises.findIndex(ex => ex.id === log.exerciseId);
        const exerciseTimeLog = updatedTimeLog.exercises[exerciseIndex] || {};
        const exerciseDuration = exerciseTimeLog.lastSetTime ?
                               (exerciseTimeLog.lastSetTime - exerciseTimeLog.startTime) / 1000 : 0;

        addWorkoutLog({
          exerciseId: log.exerciseId,
          workoutId: workout.id,
          workoutName: workout.name,
          exerciseName: exercise.name,
          date: new Date().toISOString(),
          plannedSets,
          actualSets: log.sets,
          notes: log.notes,
          performance: calculatePerformance(plannedSets, log.sets),
          timeLog: {
            exerciseDuration,
            setTimes: Object.entries(updatedTimeLog.sets)
              .filter(([key]) => key.startsWith(`${exerciseIndex}-`))
              .map(([key, value]) => ({
                setIndex: parseInt(key.split('-')[1]),
                duration: value.duration
              }))
          }
        });
      }
    });

    // Guardar el tiempo total del entrenamiento en localStorage para referencia
    const workoutTimeLogs = JSON.parse(localStorage.getItem('workoutTimeLogs') || '{}');
    workoutTimeLogs[workout.id] = {
      date: now.toISOString(),
      totalTime: totalTimeInSeconds,
      exercises: updatedTimeLog.exercises
    };
    localStorage.setItem('workoutTimeLogs', JSON.stringify(workoutTimeLogs));

    // Mostrar el tiempo total en la consola para depuración
    console.log('Tiempo total del entrenamiento:', formatTime(totalTimeInSeconds));
    console.log('Detalles del tiempo:', updatedTimeLog);

    // Mostrar notificación de guardado
    setShowSavedNotification(true);

    // Volver a la página anterior después de mostrar la notificación
    setTimeout(() => {
      navigate('/plan');
    }, 2000);
  };

  // Función para el guardado automático
  const autoSave = () => {
    if (!workout) return;

    // Calcular el tiempo total del entrenamiento hasta ahora
    const now = new Date();
    const totalTimeInSeconds = (now - timeLog.startTime) / 1000;

    // Actualizar el registro de tiempos
    const updatedTimeLog = {
      ...timeLog,
      currentTime: now,
      totalTime: totalTimeInSeconds
    };

    // Guardar el registro de tiempos en localStorage
    const workoutLogs = JSON.parse(localStorage.getItem('workoutAutoSave') || '{}');
    const logKey = `workout_${workout.id}_${new Date().toISOString().split('T')[0]}`;
    workoutLogs[logKey] = {
      workoutId: workout.id,
      date: new Date().toISOString(),
      exercises: exerciseLogs,
      duration: totalTimeInSeconds,
      timeLog: updatedTimeLog
    };
    localStorage.setItem('workoutAutoSave', JSON.stringify(workoutLogs));

    console.log('Entrenamiento guardado automáticamente');
  };

  // Configurar guardado automático cada 2 minutos
  useEffect(() => {
    if (workout && !autoSaveTimer) {
      const timer = setInterval(() => {
        autoSave();
      }, 120000); // 2 minutos
      setAutoSaveTimer(timer);
    }

    return () => {
      if (autoSaveTimer) {
        clearInterval(autoSaveTimer);
      }
    };
  }, [workout]);

  // Función para formatear el tiempo en formato hh:mm:ss
  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return `${hrs > 0 ? hrs + ':' : ''}${mins < 10 && hrs > 0 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Función para iniciar el temporizador de descanso
  const handleStartRestTimer = (exerciseIndex, setIndex) => {
    console.log('Iniciando temporizador para ejercicio', exerciseIndex, 'serie', setIndex);
    setActiveRestTimer({ exerciseIndex, setIndex });
  };

  // Función para manejar la finalización del temporizador
  const handleRestComplete = () => {
    console.log('Temporizador completado');
    setShowCompletedMessage(true);

    // Mostrar el mensaje "¡Listos para la próxima serie!" durante 2 segundos
    setTimeout(() => {
      setShowCompletedMessage(false);
      setActiveRestTimer(null);
    }, 2000);
  };

  const calculatePerformance = (plannedSets, actualSets) => {
    let totalScore = 0;
    let totalSets = 0;

    actualSets.forEach((set, index) => {
      // Solo procesar sets con datos
      if (!set.reps && !set.weight) return;

      const planned = plannedSets[index];
      if (!planned) return;

      // Calcular puntuación para repeticiones
      let repsScore = 0;
      const actualReps = parseInt(set.reps);

      if (!isNaN(actualReps) && set.reps) {
        const repsStr = planned.reps.toString();
        if (repsStr.includes('-')) {
          const [minReps, maxReps] = repsStr.split('-').map(Number);
          if (actualReps >= minReps && actualReps <= maxReps) {
            repsScore = 1;
          } else if (actualReps >= minReps * 0.8) {
            repsScore = 0.5;
          }
        } else {
          const targetReps = parseInt(repsStr);
          if (!isNaN(targetReps)) {
            if (actualReps === targetReps) {
              repsScore = 1;
            } else if (actualReps >= targetReps * 0.8) {
              repsScore = 0.5;
            }
          }
        }
      }

      // Calcular puntuación para peso
      let weightScore = 0;
      const actualWeight = parseFloat(set.weight);

      if (!isNaN(actualWeight) && set.weight) {
        const plannedWeight = parseFloat(planned.weight);
        if (!isNaN(plannedWeight)) {
          const tolerance = 2.5;
          if (Math.abs(actualWeight - plannedWeight) <= tolerance) {
            weightScore = 1;
          } else if (actualWeight >= plannedWeight * 0.9) {
            weightScore = 0.5;
          }
        }
      }

      // Solo contar sets con al menos un valor válido
      if (set.reps || set.weight) {
        totalScore += (repsScore + weightScore) / 2;
        totalSets++;
      }
    });

    return totalSets > 0 ? Math.round((totalScore / totalSets) * 100) : 0;
  };

  // Mostrar mensaje de carga
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-gray-600">Cargando entrenamiento...</p>
      </div>
    );
  }

  // Mostrar mensaje de error
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-red-500">{error}</p>
        <button
          onClick={() => navigate('/plan')}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Volver al plan
        </button>
      </div>
    );
  }

  // Si no hay entrenamiento
  if (!workout) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-gray-600">No se ha seleccionado ningún entrenamiento.</p>
        <button
          onClick={() => navigate('/plan')}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Volver al plan
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 pt-16 pb-24 max-w-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate(-1)}
          className="p-2 text-gray-600 hover:text-gray-800"
        >
          <FaArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-bold text-gray-800">Registrar Entrenamiento</h1>
        <div className="w-8"></div>
      </div>

      {/* Workout Info */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="flex items-stretch">
          {/* Lado izquierdo: Información del entrenamiento */}
          <div className="flex-1 pr-6">
            {!workout.isRestDay ? (
              <div className="space-y-1">
                {workout.phase && (
                  <div className="text-sm text-primary-600 font-medium tracking-wide">Fase {workout.phase}</div>
                )}
                {workout.id && (
                  <div className="text-xl font-bold text-gray-800 dark:text-white">Entrenamiento {workout.id}</div>
                )}
                <div className="text-md font-semibold text-gray-700 dark:text-white">Cuerpo Completo</div>
                {workout.name && workout.name.includes('Empuje') && (
                  <div className="text-md font-semibold text-gray-700 dark:text-white">Énfasis en Empuje</div>
                )}
                {workout.name && workout.name.includes('Tracción') && (
                  <div className="text-md font-semibold text-gray-700 dark:text-white">Énfasis en Tracción</div>
                )}
                {workout.name && workout.name.includes('Piernas') && (
                  <div className="text-md font-semibold text-gray-700 dark:text-white">Énfasis en Piernas y Funcional</div>
                )}
              </div>
            ) : (
              <h2 className="font-semibold text-gray-800 text-lg">{workout.name}</h2>
            )}
          </div>

          {/* Separador vertical */}
          <div className="w-px bg-gray-200 self-stretch mx-4"></div>

          {/* Lado derecho: Leyenda de colores */}
          <div className="flex items-center">
            <HorizontalColorLegend />
          </div>
        </div>

        {/* Nota sobre ejercicios bilaterales */}
        {workout.exercises.some(ex => (ex.reps || '').toString().includes('/') ||
                              (Array.isArray(ex.sets) && ex.sets.some(s => (s.reps || '').toString().includes('/')))) && (
          <div className="mt-4 pt-4 border-t border-gray-100 text-xs text-gray-500 italic">
            <span className="font-medium text-gray-600 mr-1">Nota:</span>
            Para ejercicios bilaterales (por pierna/lado/brazo), se muestra el total esperado (20) y entre paréntesis el valor por lado (10 reps/pierna).
          </div>
        )}
      </div>

      {/* Exercise List */}
      <div className="space-y-6">
        {workout.exercises.map((exercise, exerciseIndex) => (
          <div key={exercise.id} className="bg-white rounded-xl shadow-md p-5">
            <div className="flex items-center mb-4">
              <FaDumbbell className="text-primary-500 mr-2" />
              <h3 className="font-semibold text-gray-800">{exercise.name}</h3>
            </div>

            {/* Sets */}
            <div className="space-y-4">
              <div className="grid grid-cols-12 gap-2 text-sm font-medium text-gray-500 mb-2">
                <div className="col-span-1 flex items-center justify-center h-8">Serie</div>
                <div className="col-span-5 flex items-center h-8">Planificado</div>
                {exercise.sets[0]?.reps?.toString().includes('seg') ? (
                  <div className="col-span-6 flex items-center justify-center h-8">Tiempo (seg)</div>
                ) : (
                  <>
                    <div className="col-span-3 flex items-center justify-center h-8">Reps</div>
                    <div className="col-span-3 flex items-center justify-center h-8">Peso (kg)</div>
                  </>
                )}
              </div>

              {exerciseLogs[exerciseIndex]?.sets.map((set, setIndex) => {
                // Mostrar el temporizador de descanso si está activo para esta serie
                const showTimer = activeRestTimer &&
                                activeRestTimer.exerciseIndex === exerciseIndex &&
                                activeRestTimer.setIndex === setIndex;

                const plannedSet = typeof exercise.sets === 'number'
                  ? { reps: exercise.reps, weight: exercise.weight }
                  : exercise.sets[setIndex];

                // Extraer los rangos de repeticiones planificadas
                const plannedRepsStr = (plannedSet?.reps || '').toString();

                // Detectar si es un ejercicio basado en tiempo (como planchas)
                const isTimeBasedExercise = plannedRepsStr.includes('seg');

                // Verificar si es un ejercicio por pierna/lado/brazo
                const isPerSide = /\/pierna|\/lado|\/brazo|\/pie|\/mano/i.test(plannedRepsStr);

                // Factor de multiplicación para ejercicios por pierna/lado
                const multiplier = isPerSide ? 2 : 1;

                // Limpiar el string de repeticiones
                let cleanRepsStr = plannedRepsStr;
                if (isPerSide) {
                  cleanRepsStr = cleanRepsStr.replace(/\/pierna|\/lado|\/brazo|\/pie|\/mano/gi, '').trim();
                }

                // Extraer los valores mínimo y máximo
                let minRepsBase, maxRepsBase;

                if (cleanRepsStr.includes('-')) {
                  [minRepsBase, maxRepsBase] = cleanRepsStr.split('-').map(n => parseInt(n.trim()));
                } else {
                  minRepsBase = parseInt(cleanRepsStr.trim());
                  maxRepsBase = minRepsBase; // Si no hay rango, el mínimo y máximo son iguales
                }

                // Aplicar el multiplicador para la evaluación
                const minReps = isNaN(minRepsBase) ? 0 : minRepsBase * multiplier;
                const maxReps = isNaN(maxRepsBase) ? 0 : maxRepsBase * multiplier;

                const actualReps = parseInt(set.reps);
                const actualWeight = parseFloat(set.weight);
                const plannedWeight = parseFloat(plannedSet?.weight);

                // Determinar el color basado en el rango
                const getRepsColor = () => {
                  if (!set.reps) return '';
                  if (isNaN(actualReps)) return 'border-red-500 bg-red-50';

                  // Mostrar información de depuración en la consola
                  console.log('Evaluando repeticiones:', {
                    isPerSide,
                    plannedRepsStr,
                    cleanRepsStr,
                    minRepsBase,
                    maxRepsBase,
                    minReps,
                    maxReps,
                    actualReps,
                    multiplier
                  });

                  // NUEVA LÓGICA PARA REPETICIONES:
                  // Para ejercicios bilaterales, tratamos el valor mínimo como el objetivo principal
                  if (isPerSide) {
                    // 1. Si el valor actual es mayor o igual al mínimo total, es verde
                    if (actualReps >= minReps) {
                      return 'border-green-500 bg-green-50';
                    }

                    // 2. Si el valor actual está entre el 80% y el 99% del mínimo total, es amarillo
                    const minThreshold = minReps * 0.8;
                    if (actualReps >= minThreshold) {
                      return 'border-yellow-500 bg-yellow-50';
                    }

                    // 3. Si el valor actual está por debajo del 80% del mínimo total, es rojo
                    return 'border-red-500 bg-red-50';
                  }

                  // Para ejercicios normales con rango
                  else if (minReps !== maxReps) {
                    // 1. Si el valor actual está dentro del rango, es verde
                    if (actualReps >= minReps && actualReps <= maxReps) {
                      return 'border-green-500 bg-green-50';
                    }

                    // Si el valor actual es mayor que el máximo, sigue siendo verde (bonus)
                    if (actualReps > maxReps) {
                      return 'border-green-500 bg-green-50';
                    }

                    // 2. Si el valor actual está entre (mínimo del rango × 0.8) y (mínimo del rango - 1), es amarillo
                    const minThreshold = minReps * 0.8;

                    if (actualReps >= minThreshold && actualReps < minReps) {
                      return 'border-yellow-500 bg-yellow-50';
                    }

                    // 3. Si el valor actual está por debajo del 80% del mínimo, es rojo
                    return 'border-red-500 bg-red-50';
                  }

                  // Si no es un rango (solo tiene un valor)
                  // Calcular el porcentaje respecto al valor planificado
                  const percentage = (actualReps / minReps) * 100;

                  console.log('Evaluando repeticiones (valor único):', {
                    minReps,
                    actualReps,
                    percentage,
                    isPerSide,
                    multiplier
                  });

                  // 1. Si el valor actual es mayor o igual al valor planificado, es verde
                  if (actualReps >= minReps) {
                    return 'border-green-500 bg-green-50';
                  }

                  // 2. Si el valor actual está entre el 80% y 99% del valor planificado, es amarillo
                  if (percentage >= 80) {
                    return 'border-yellow-500 bg-yellow-50';
                  }

                  // 3. Si el valor actual está por debajo del 80% del valor planificado, es rojo
                  return 'border-red-500 bg-red-50';
                };

                const getWeightColor = () => {
                  if (!set.weight) return '';
                  if (isNaN(actualWeight)) return 'border-red-500 bg-red-50';

                  // Calcular el porcentaje respecto al peso planificado
                  const percentage = (actualWeight / plannedWeight) * 100;

                  // NUEVA LÓGICA PARA PESOS:
                  // 1. Si el valor real es mayor o igual al valor planificado, es verde (100%)
                  if (actualWeight >= plannedWeight) {
                    return 'border-green-500 bg-green-50';
                  }

                  // 2. Si el valor real está entre el 80% y 99% del valor planificado, es amarillo
                  if (percentage >= 80) {
                    return 'border-yellow-500 bg-yellow-50';
                  }

                  // 3. Si el valor real está por debajo del 80% del valor planificado, es rojo
                  return 'border-red-500 bg-red-50';
                };

                return (
                  <div key={setIndex} className="mb-4">
                    {showTimer && (
                      <div className="grid grid-cols-12 gap-2 items-center mb-4">
                        <div className="col-span-12 border-t border-blue-200 pt-3">
                          <RestTimer
                            duration={exercise.rest ? parseInt(exercise.rest.replace(/[^0-9]/g, '')) : 60}
                            onComplete={handleRestComplete}
                            isActive={true}
                          />
                        </div>
                      </div>
                    )}
                    <div className="grid grid-cols-12 gap-2 items-center">
                      <div className="col-span-1 h-10 flex items-center justify-center text-sm font-medium text-gray-600">{setIndex + 1}</div>
                      <div className="col-span-5 px-3 h-10 bg-gray-50 rounded-lg border border-gray-200 text-sm text-gray-700 font-medium flex items-center overflow-hidden">
                        {isTimeBasedExercise ? (
                          // Para ejercicios basados en tiempo, mostrar solo el tiempo
                          <div className="w-full text-center">
                            <span className="text-primary-600 whitespace-nowrap text-xs font-semibold">
                              {plannedSet?.reps || '-'}
                            </span>
                          </div>
                        ) : (
                          // Para ejercicios normales, mostrar reps y peso
                          <>
                            <div className="w-2/5 text-left">
                              <span className="text-primary-600 whitespace-nowrap text-xs">
                                {isPerSide ? (
                                  <>
                                    <span className="font-semibold">
                                      {minRepsBase * 2}
                                      {minRepsBase !== maxRepsBase ? `-${maxRepsBase * 2}` : ''}
                                    </span>
                                    <span className="text-gray-500 text-xs ml-1">({plannedSet?.reps})</span>
                                  </>
                                ) : (
                                  plannedSet?.reps || '-'
                                )}
                              </span>
                            </div>
                            <div className="h-8 border-r border-gray-200 mx-1"></div>
                            <div className="w-3/5 text-right">
                              <span className="font-bold whitespace-nowrap text-xs">
                                {plannedSet?.weight === 'Peso corporal' ? 'Peso corporal' :
                                 plannedSet?.weight ? parseFloat(plannedSet.weight).toFixed(1) + 'kg' : '-'}
                              </span>
                            </div>
                          </>
                        )}
                      </div>

                      {isTimeBasedExercise ? (
                        // Interfaz para ejercicios basados en tiempo (como planchas)
                        <div className="col-span-6 flex gap-1">
                          {!set.reps ? (
                            // Mostrar el cronómetro si aún no se ha registrado el tiempo
                            <div className="w-full">
                              <ExerciseTimer
                                onComplete={(time) => {
                                  // Registrar el tiempo cuando se detiene el cronómetro
                                  handleSetChange(exerciseIndex, setIndex, 'reps', time.toString());
                                }}
                              />
                            </div>
                          ) : (
                            // Mostrar el tiempo registrado
                            <input
                              type="text"
                              inputMode="numeric"
                              value={set.reps}
                              onChange={(e) => handleSetChange(exerciseIndex, setIndex, 'reps', e.target.value)}
                              placeholder="Tiempo (seg)"
                              className={`w-full h-10 px-3 text-sm border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-center ${getRepsColor()}`}
                              disabled={activeRestTimer && (activeRestTimer.exerciseIndex === exerciseIndex && activeRestTimer.setIndex < setIndex)}
                            />
                          )}
                        </div>
                      ) : (
                        // Interfaz estándar para ejercicios basados en repeticiones y peso
                        <>
                          <div className="col-span-3 flex gap-1">
                            <input
                              type="text"
                              inputMode="numeric"
                              value={set.reps}
                              onChange={(e) => handleSetChange(exerciseIndex, setIndex, 'reps', e.target.value)}
                              placeholder="Reps"
                              className={`w-full h-10 px-3 text-sm border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-center ${getRepsColor()}`}
                              disabled={activeRestTimer && (activeRestTimer.exerciseIndex === exerciseIndex && activeRestTimer.setIndex < setIndex)}
                            />
                          </div>
                          <div className="col-span-3 flex gap-1">
                            <input
                              type="text"
                              inputMode="decimal"
                              value={set.weight}
                              onChange={(e) => handleSetChange(exerciseIndex, setIndex, 'weight', e.target.value)}
                              placeholder="Peso"
                              className={`w-full h-10 px-3 text-sm border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-center ${getWeightColor()}`}
                              disabled={activeRestTimer && (activeRestTimer.exerciseIndex === exerciseIndex && activeRestTimer.setIndex < setIndex)}
                            />
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Leyenda de colores movida arriba */}
            </div>

            {/* Mostrar la duración del ejercicio */}
            {timeLog.exercises[exerciseIndex] && (
              <ExerciseDuration
                duration={timeLog.exercises[exerciseIndex].lastSetTime ?
                  (timeLog.exercises[exerciseIndex].lastSetTime - timeLog.exercises[exerciseIndex].startTime) / 1000 : 0}
              />
            )}

            {/* Notes */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notas (opcional)
              </label>
              <textarea
                value={exerciseLogs[exerciseIndex]?.notes || ''}
                onChange={(e) => handleNotesChange(exerciseIndex, e.target.value)}
                placeholder="Ej: Aumentar peso en la próxima sesión"
                className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                rows="2"
              />
            </div>
          </div>
        ))}

        {/* Mostrar el tiempo total del entrenamiento */}
        {timeLog.startTime && (
          <WorkoutDuration
            duration={(new Date() - timeLog.startTime) / 1000}
          />
        )}
      </div>

      {/* Notificación de guardado */}
      <SavedNotification
        show={showSavedNotification}
        onClose={() => setShowSavedNotification(false)}
      />

      {/* Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <div className="container mx-auto max-w-lg flex gap-4">
          <button
            onClick={() => navigate(-1)}
            className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-3 px-4 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

export default WorkoutLogPage;