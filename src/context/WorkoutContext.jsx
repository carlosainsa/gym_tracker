import { createContext, useContext, useState, useEffect } from 'react';
import { workoutPlan, emptyWorkoutLog } from '../data/workoutPlan';

// Crear el contexto
const WorkoutContext = createContext();

// Hook personalizado para usar el contexto
export const useWorkout = () => {
  return useContext(WorkoutContext);
};

// Proveedor del contexto
export const WorkoutProvider = ({ children }) => {
  // Estado para el plan de entrenamiento
  const [plan, setPlan] = useState(workoutPlan);
  
  // Estado para la fase actual (1, 2 o 3)
  const [currentPhase, setCurrentPhase] = useState(1);
  
  // Estado para los registros de entrenamiento
  const [workoutLogs, setWorkoutLogs] = useState(() => {
    // Intentar cargar los registros desde localStorage
    const savedLogs = localStorage.getItem('workoutLogs');
    return savedLogs ? JSON.parse(savedLogs) : emptyWorkoutLog;
  });

  // Guardar los registros en localStorage cuando cambien
  useEffect(() => {
    localStorage.setItem('workoutLogs', JSON.stringify(workoutLogs));
  }, [workoutLogs]);

  // Función para agregar un nuevo registro de entrenamiento
  const addWorkoutLog = (log) => {
    setWorkoutLogs(prevLogs => ({
      logs: [...prevLogs.logs, { ...log, id: Date.now(), date: new Date().toISOString() }]
    }));
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

  // Valores que se proporcionarán a través del contexto
  const value = {
    plan,
    currentPhase,
    workoutLogs,
    addWorkoutLog,
    getExerciseLogs,
    changePhase
  };

  return (
    <WorkoutContext.Provider value={value}>
      {children}
    </WorkoutContext.Provider>
  );
};
