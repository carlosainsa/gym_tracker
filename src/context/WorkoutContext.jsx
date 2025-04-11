import { createContext, useContext, useState, useEffect } from 'react';
import { workoutPlan, emptyWorkoutLog } from '../data/workoutPlan';
import exerciseLibrary from '../data/exerciseLibrary';

// Crear el contexto
const WorkoutContext = createContext();

// Hook personalizado para usar el contexto
export const useWorkout = () => {
  return useContext(WorkoutContext);
};

// Proveedor del contexto
export const WorkoutProvider = ({ children }) => {
  // Estado para el plan de entrenamiento
  const [plan, setPlan] = useState(() => {
    const savedPlan = localStorage.getItem('workoutPlan');
    return savedPlan ? JSON.parse(savedPlan) : workoutPlan;
  });

  // Estado para la fase actual (1, 2 o 3)
  const [currentPhase, setCurrentPhase] = useState(() => {
    const savedPhase = localStorage.getItem('currentPhase');
    return savedPhase ? parseInt(savedPhase) : 1;
  });

  // Estado para los registros de entrenamiento
  const [workoutLogs, setWorkoutLogs] = useState(() => {
    const savedLogs = localStorage.getItem('workoutLogs');
    return savedLogs ? JSON.parse(savedLogs) : emptyWorkoutLog;
  });

  // Estado para las rutinas personalizadas
  const [routines, setRoutines] = useState(() => {
    const savedRoutines = localStorage.getItem('customRoutines');
    return savedRoutines ? JSON.parse(savedRoutines) : [];
  });

  // Estado para la biblioteca de ejercicios
  const [exercises, setExercises] = useState(exerciseLibrary);

  // Guardar cambios en localStorage
  useEffect(() => {
    localStorage.setItem('workoutPlan', JSON.stringify(plan));
  }, [plan]);

  useEffect(() => {
    localStorage.setItem('currentPhase', currentPhase.toString());
  }, [currentPhase]);

  useEffect(() => {
    localStorage.setItem('workoutLogs', JSON.stringify(workoutLogs));
  }, [workoutLogs]);

  useEffect(() => {
    localStorage.setItem('customRoutines', JSON.stringify(routines));
  }, [routines]);

  // Función para agregar un nuevo registro de entrenamiento
  const addWorkoutLog = (log) => {
    setWorkoutLogs(prevLogs => ({
      logs: [...prevLogs.logs, { ...log, id: Date.now(), date: new Date().toISOString() }]
    }));

    // Actualizar el progreso del ejercicio en el plan
    if (log.exerciseId && log.actualSets) {
      updateExerciseProgress(log.exerciseId, log.actualSets);
    }
  };

  // Función para actualizar el progreso de un ejercicio
  const updateExerciseProgress = (exerciseId, actualSets) => {
    setPlan(prevPlan => {
      const newPlan = [...prevPlan];

      // Buscar el ejercicio en todos los días del plan
      for (let i = 0; i < newPlan.length; i++) {
        const exerciseIndex = newPlan[i].exercises.findIndex(ex => ex.id === exerciseId);

        if (exerciseIndex !== -1) {
          // Actualizar los valores reales
          newPlan[i].exercises[exerciseIndex].actualSets = actualSets;

          // Calcular el progreso
          const exercise = newPlan[i].exercises[exerciseIndex];
          let totalPlannedReps = 0;
          let totalActualReps = 0;

          exercise.sets.forEach((set, index) => {
            const plannedReps = typeof set.reps === 'string'
              ? parseInt(set.reps.split('-')[1] || set.reps)
              : set.reps;

            totalPlannedReps += plannedReps;

            if (actualSets && actualSets[index]) {
              totalActualReps += actualSets[index].reps || 0;
            }
          });

          exercise.progress = totalPlannedReps > 0
            ? Math.round((totalActualReps / totalPlannedReps) * 100)
            : 0;

          // Actualizar el progreso del día
          updateDayProgress(newPlan[i]);
          break;
        }
      }

      return newPlan;
    });
  };

  // Función para actualizar el progreso de un día
  const updateDayProgress = (day) => {
    let totalProgress = 0;
    day.exercises.forEach(ex => {
      totalProgress += ex.progress || 0;
    });

    day.progress = day.exercises.length > 0
      ? Math.round(totalProgress / day.exercises.length)
      : 0;
  };

  // Función para obtener los registros de un ejercicio específico
  const getExerciseLogs = (exerciseId) => {
    return workoutLogs.logs.filter(log => log.exerciseId === exerciseId);
  };

  // Función para cambiar la fase actual
  const changePhase = (phase) => {
    if (phase >= 1 && phase <= 3) {
      setCurrentPhase(phase);
    }
  };

  // Función para guardar una nueva rutina
  const saveRoutine = (newRoutine) => {
    setRoutines(prev => [...prev, newRoutine]);
  };

  // Función para eliminar una rutina
  const deleteRoutine = (routineId) => {
    setRoutines(prev => prev.filter(routine => routine.id !== routineId));
  };

  // Función para añadir un día al plan con una rutina personalizada
  const addDayToPlan = (routineId) => {
    const routine = routines.find(r => r.id === routineId);

    if (routine) {
      const newDay = {
        id: Date.now(),
        name: routine.name,
        description: routine.description,
        exercises: routine.exercises.map(ex => ({
          ...ex,
          id: Date.now() + Math.random(),
          progress: 0,
          actualSets: []
        })),
        progress: 0
      };

      setPlan(prev => [...prev, newDay]);
    }
  };

  // Valores que se proporcionarán a través del contexto
  const value = {
    plan,
    setPlan,
    currentPhase,
    workoutLogs,
    routines,
    exercises,
    addWorkoutLog,
    getExerciseLogs,
    changePhase,
    saveRoutine,
    deleteRoutine,
    addDayToPlan,
    updateExerciseProgress
  };

  return (
    <WorkoutContext.Provider value={value}>
      {children}
    </WorkoutContext.Provider>
  );
};
