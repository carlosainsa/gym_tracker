import React, { createContext, useContext, useState, useEffect } from 'react';
import { TrainingPlan, Microcycle, TrainingSession, Exercise, Set } from '../models/TrainingPlan';
import { UserPreferences } from '../models/UserPreferences';
import trainingPlanService from '../services/trainingPlanService';
import userPreferencesService from '../services/userPreferencesService';
import dataMigrationService from '../services/dataMigrationService';
import importExportService from '../services/importExportService';
import planTransitionService from '../services/planTransitionService';
import { useAuth } from './AuthContext';
import { workoutPlan, emptyWorkoutLog } from '../data/workoutPlan';
import { primerPlan } from '../data/primerPlan';

// Crear el contexto
const TrainingContext = createContext();

// Hook personalizado para usar el contexto
export const useTraining = () => {
  return useContext(TrainingContext);
};

// Versión del plan para control de cambios
const PLAN_VERSION = '3.0';

// Proveedor del contexto
export const TrainingProvider = ({ children }) => {
  const { currentUser } = useAuth();

  // Estado para el plan de entrenamiento activo (nuevo formato)
  const [trainingPlan, setTrainingPlan] = useState(primerPlan);

  // Estado para todos los planes de entrenamiento
  const [trainingPlans, setTrainingPlans] = useState(() => {
    const savedPlans = localStorage.getItem('trainingPlans');
    return savedPlans ? JSON.parse(savedPlans) : [primerPlan];
  });

  // Estado para el ID del plan activo
  const [activePlanId, setActivePlanId] = useState(() => {
    const savedActivePlanId = localStorage.getItem('activePlanId');
    return savedActivePlanId || primerPlan.id;
  });

  // Estado para el plan de entrenamiento (formato antiguo para compatibilidad)
  const [legacyPlan, setLegacyPlan] = useState(() => {
    const savedPlan = localStorage.getItem('workoutPlan');
    return savedPlan ? JSON.parse(savedPlan) : workoutPlan;
  });

  // Estado para las preferencias del usuario
  const [userPreferences, setUserPreferences] = useState(null);

  // Estado para los registros de entrenamiento
  const [workoutLogs, setWorkoutLogs] = useState(() => {
    const savedLogs = localStorage.getItem('workoutLogs');
    return savedLogs ? JSON.parse(savedLogs) : emptyWorkoutLog;
  });

  // Estado para el día expandido
  const [expandedDay, setExpandedDay] = useState(null);

  // Estado para indicar si se está cargando
  const [loading, setLoading] = useState(true);

  // Inicializar el contexto
  useEffect(() => {
    const initializeContext = async () => {
      setLoading(true);

      try {
        // Cargar preferencias del usuario
        let preferences;
        if (currentUser) {
          // Si hay un usuario autenticado, intentar cargar desde Firestore
          preferences = await userPreferencesService.loadFromFirestore(currentUser.uid);
        } else {
          // Si no hay usuario autenticado, cargar desde localStorage
          preferences = userPreferencesService.loadFromLocalStorage();
        }
        setUserPreferences(preferences);

        // Verificar si es necesario migrar los datos
        if (dataMigrationService.needsMigration()) {
          console.log('Migrando datos al nuevo formato...');

          // Migrar todos los datos
          const migratedData = dataMigrationService.migrateAllData();

          // Guardar los datos migrados
          dataMigrationService.saveMigratedData(migratedData);

          // Establecer los datos migrados en el estado
          setTrainingPlan(migratedData.trainingPlan);
          setUserPreferences(migratedData.userPreferences);
          setWorkoutLogs(migratedData.workoutLogs);

          console.log('Migración completada.');
        } else {
          // Cargar el plan existente
          const savedNewPlan = localStorage.getItem('trainingPlan');
          if (savedNewPlan) {
            // Convertir el JSON a objetos del modelo
            const planData = JSON.parse(savedNewPlan);
            const plan = new TrainingPlan(planData);

            // Reconstruir los objetos anidados
            plan.microcycles = planData.microcycles.map(mc => {
              const microcycle = new Microcycle(mc);

              microcycle.trainingSessions = mc.trainingSessions.map(ts => {
                const session = new TrainingSession(ts);

                session.exercises = ts.exercises.map(ex => {
                  const exercise = new Exercise(ex);

                  exercise.sets = ex.sets.map(s => new Set(s));

                  return exercise;
                });

                return session;
              });

              return microcycle;
            });

            setTrainingPlan(plan);
          } else {
            // Usar el Primer Plan de Entrenamiento predefinido
            // El estado ya está inicializado con primerPlan

            // Guardar el nuevo plan en localStorage
            localStorage.setItem('trainingPlan', JSON.stringify(primerPlan));
          }
        }
      } catch (error) {
        console.error('Error al inicializar el contexto:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeContext();
  }, [currentUser]);

  // Guardar cambios en localStorage
  useEffect(() => {
    if (trainingPlan) {
      localStorage.setItem('trainingPlan', JSON.stringify(trainingPlan));
    }
  }, [trainingPlan]);

  // Guardar todos los planes en localStorage
  useEffect(() => {
    if (trainingPlans) {
      localStorage.setItem('trainingPlans', JSON.stringify(trainingPlans));
    }
  }, [trainingPlans]);

  // Guardar el ID del plan activo en localStorage
  useEffect(() => {
    if (activePlanId) {
      localStorage.setItem('activePlanId', activePlanId);

      // Actualizar el plan activo
      const activePlan = trainingPlans.find(plan => plan.id === activePlanId);
      if (activePlan) {
        setTrainingPlan(activePlan);
      }
    }
  }, [activePlanId, trainingPlans]);

  useEffect(() => {
    if (legacyPlan) {
      localStorage.setItem('workoutPlan', JSON.stringify(legacyPlan));
    }
  }, [legacyPlan]);

  useEffect(() => {
    if (userPreferences) {
      userPreferencesService.saveToLocalStorage(userPreferences);
    }
  }, [userPreferences]);

  useEffect(() => {
    if (workoutLogs) {
      localStorage.setItem('workoutLogs', JSON.stringify(workoutLogs));
    }
  }, [workoutLogs]);

  // Función para actualizar las preferencias del usuario
  const updateUserPreferences = (category, key, value) => {
    if (!userPreferences) return;

    const updatedPreferences = userPreferencesService.updatePreference(
      userPreferences,
      category,
      key,
      value
    );

    setUserPreferences(updatedPreferences);

    // Si hay un usuario autenticado, guardar en Firestore
    if (currentUser) {
      userPreferencesService.saveToFirestore(currentUser.uid, updatedPreferences);
    }
  };

  // Función para cambiar de microciclo (anteriormente fase)
  const changePhase = (newPhase) => {
    updateUserPreferences('training', 'currentPhase', parseInt(newPhase));
  };

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
    if (!trainingPlan) return;

    // Crear una copia del plan
    const updatedPlan = { ...trainingPlan };

    // Buscar el ejercicio en todos los microciclos y sesiones
    updatedPlan.microcycles = updatedPlan.microcycles.map(microcycle => {
      const updatedMicrocycle = { ...microcycle };

      updatedMicrocycle.trainingSessions = updatedMicrocycle.trainingSessions.map(session => {
        const updatedSession = { ...session };

        // Buscar el ejercicio en esta sesión
        const exerciseIndex = updatedSession.exercises.findIndex(ex => ex.id === exerciseId);
        if (exerciseIndex >= 0) {
          // Crear una copia de los ejercicios
          const updatedExercises = [...updatedSession.exercises];

          // Actualizar el ejercicio específico
          updatedExercises[exerciseIndex] = {
            ...updatedExercises[exerciseIndex],
            progress: calculateExerciseProgress(
              updatedExercises[exerciseIndex].sets,
              actualSets
            )
          };

          updatedSession.exercises = updatedExercises;

          // Actualizar el progreso de la sesión
          updatedSession.progress = calculateSessionProgress(updatedExercises);
        }

        return updatedSession;
      });

      // Actualizar el progreso del microciclo
      updatedMicrocycle.progress = calculateMicrocycleProgress(updatedMicrocycle.trainingSessions);

      return updatedMicrocycle;
    });

    // Actualizar el plan
    setTrainingPlan(updatedPlan);
  };

  // Función para calcular el progreso de un ejercicio
  const calculateExerciseProgress = (plannedSets, actualSets) => {
    if (!plannedSets || !actualSets || plannedSets.length === 0) return 0;

    // Calcular el progreso para cada serie
    let totalProgress = 0;
    const setsToEvaluate = Math.min(plannedSets.length, actualSets.length);

    for (let i = 0; i < setsToEvaluate; i++) {
      const planned = plannedSets[i];
      const actual = actualSets[i];

      if (!actual.reps || !actual.weight) continue;

      // Calcular progreso de repeticiones
      let repsProgress = 0;
      if (typeof planned.reps === 'string' && planned.reps.includes('-')) {
        // Rango de repeticiones (ej: "8-10")
        const [minReps, maxReps] = planned.reps.split('-').map(Number);
        const actualReps = parseInt(actual.reps);

        if (actualReps >= maxReps) {
          repsProgress = 100;
        } else if (actualReps >= minReps) {
          repsProgress = 80 + ((actualReps - minReps) / (maxReps - minReps)) * 20;
        } else if (actualReps >= minReps * 0.8) {
          repsProgress = (actualReps / minReps) * 80;
        } else {
          repsProgress = (actualReps / minReps) * 80;
        }
      } else {
        // Repeticiones fijas
        const plannedReps = parseInt(planned.reps);
        const actualReps = parseInt(actual.reps);

        repsProgress = Math.min(100, (actualReps / plannedReps) * 100);
      }

      // Calcular progreso de peso
      let weightProgress = 0;
      if (planned.weight && actual.weight) {
        const plannedWeight = parseFloat(planned.weight);
        const actualWeight = parseFloat(actual.weight);

        weightProgress = Math.min(100, (actualWeight / plannedWeight) * 100);
      }

      // Promedio de progreso para esta serie
      const setProgress = (repsProgress + weightProgress) / 2;
      totalProgress += setProgress;
    }

    // Devolver el progreso promedio
    return Math.round(totalProgress / setsToEvaluate);
  };

  // Función para calcular el progreso de una sesión
  const calculateSessionProgress = (exercises) => {
    if (!exercises || exercises.length === 0) return 0;

    const totalProgress = exercises.reduce((sum, exercise) => sum + exercise.progress, 0);
    return Math.round(totalProgress / exercises.length);
  };

  // Función para calcular el progreso de un microciclo
  const calculateMicrocycleProgress = (sessions) => {
    if (!sessions || sessions.length === 0) return 0;

    const totalProgress = sessions.reduce((sum, session) => sum + session.progress, 0);
    return Math.round(totalProgress / sessions.length);
  };

  // Función para crear un nuevo plan
  const createNewPlan = (planPreferences) => {
    const newPlan = trainingPlanService.createNewPlan(planPreferences);

    // Actualizar el plan activo
    setTrainingPlan(newPlan);

    // Agregar el nuevo plan a la lista de planes
    setTrainingPlans(prevPlans => {
      const updatedPlans = [...prevPlans, { ...newPlan, status: 'active' }];
      return updatedPlans;
    });

    // Establecer el nuevo plan como activo
    setActivePlanId(newPlan.id);

    return newPlan;
  };

  // Función para archivar un plan
  const archivePlan = (planId) => {
    setTrainingPlans(prevPlans => {
      return prevPlans.map(plan => {
        if (plan.id === planId) {
          return { ...plan, status: 'archived' };
        }
        return plan;
      });
    });

    // Si el plan archivado era el activo, establecer otro plan como activo
    if (planId === activePlanId) {
      const availablePlans = trainingPlans.filter(plan =>
        plan.id !== planId && plan.status === 'available'
      );

      if (availablePlans.length > 0) {
        setActivePlanId(availablePlans[0].id);
      } else {
        // Si no hay planes disponibles, crear uno nuevo
        const defaultPlan = primerPlan;
        setTrainingPlan(defaultPlan);
        setActivePlanId(defaultPlan.id);

        // Agregar el plan por defecto a la lista
        setTrainingPlans(prevPlans => [
          ...prevPlans.filter(p => p.id !== defaultPlan.id),
          { ...defaultPlan, status: 'active' }
        ]);
      }
    }
  };

  // Función para eliminar un plan
  const deletePlan = (planId) => {
    // No permitir eliminar el plan activo
    if (planId === activePlanId) {
      return false;
    }

    setTrainingPlans(prevPlans => {
      return prevPlans.filter(plan => plan.id !== planId);
    });

    return true;
  };

  // Función para activar un plan
  const activatePlan = (planId) => {
    // Buscar el plan a activar
    const planToActivate = trainingPlans.find(plan => plan.id === planId);

    if (!planToActivate) {
      return false;
    }

    // Actualizar el estado de los planes
    setTrainingPlans(prevPlans => {
      return prevPlans.map(plan => {
        if (plan.id === planId) {
          return { ...plan, status: 'active' };
        } else if (plan.id === activePlanId) {
          return { ...plan, status: 'available' };
        }
        return plan;
      });
    });

    // Establecer el nuevo plan activo
    setActivePlanId(planId);

    return true;
  };

  // Función para obtener la sesión de entrenamiento actual
  const getCurrentSession = () => {
    if (!trainingPlan || !userPreferences) return null;

    // Obtener el microciclo actual (anteriormente fase)
    const currentPhase = userPreferences.trainingPreferences.currentPhase;

    // Obtener el día de la semana actual (0-6)
    const today = new Date().getDay();

    // Verificar si es un día de entrenamiento
    const isTrainingDay = !userPreferences.trainingPreferences.restDays.includes(today);

    if (!isTrainingDay) return null;

    // Buscar microciclos del microciclo actual
    const phaseMicrocycles = trainingPlan.microcycles.filter(mc => mc.phase === currentPhase);

    if (phaseMicrocycles.length === 0) return null;

    // Usar el primer microciclo del microciclo actual
    const currentMicrocycle = phaseMicrocycles[0];

    // Buscar la sesión para el día actual
    const dayIndex = currentMicrocycle.trainingDays.indexOf(today);

    if (dayIndex < 0 || dayIndex >= currentMicrocycle.trainingSessions.length) return null;

    return currentMicrocycle.trainingSessions[dayIndex];
  };

  // Función para obtener todas las sesiones de entrenamiento disponibles
  const getAvailableSessions = () => {
    if (!trainingPlan || !userPreferences) return [];

    // Obtener el microciclo actual (anteriormente fase)
    const currentPhase = userPreferences.trainingPreferences.currentPhase;

    // Buscar microciclos del microciclo actual
    const phaseMicrocycles = trainingPlan.microcycles.filter(mc => mc.phase === currentPhase);

    if (phaseMicrocycles.length === 0) return [];

    // Usar el primer microciclo del microciclo actual
    const currentMicrocycle = phaseMicrocycles[0];

    return currentMicrocycle.trainingSessions;
  };

  // Función para importar datos
  const importData = (data) => {
    if (data.trainingPlan) {
      setTrainingPlan(new TrainingPlan(data.trainingPlan));
    }

    if (data.legacyPlan) {
      setLegacyPlan(data.legacyPlan);
    }

    if (data.workoutLogs) {
      setWorkoutLogs(data.workoutLogs);
    }

    if (data.userPreferences) {
      setUserPreferences(new UserPreferences(data.userPreferences));
    }

    // Guardar en localStorage
    if (data.trainingPlan) {
      localStorage.setItem('trainingPlan', JSON.stringify(data.trainingPlan));
    }

    if (data.legacyPlan) {
      localStorage.setItem('workoutPlan', JSON.stringify(data.legacyPlan));
    }

    if (data.workoutLogs) {
      localStorage.setItem('workoutLogs', JSON.stringify(data.workoutLogs));
    }

    if (data.userPreferences) {
      userPreferencesService.saveToLocalStorage(data.userPreferences);
    }
  };

  // Función para exportar un plan a JSON
  const exportPlanToJson = (planId) => {
    const plan = planId ? trainingPlans.find(p => p.id === planId) : trainingPlan;
    if (!plan) return null;

    return importExportService.exportPlanToJson(plan);
  };

  // Función para descargar un plan como archivo JSON
  const downloadPlanAsJson = (planId) => {
    const plan = planId ? trainingPlans.find(p => p.id === planId) : trainingPlan;
    if (!plan) return false;

    return importExportService.downloadPlanAsJson(plan);
  };

  // Función para importar un plan desde JSON
  const importPlanFromJson = (jsonString) => {
    try {
      const importedData = importExportService.importPlanFromJson(jsonString);

      // Verificar si es un array de planes o un solo plan
      if (Array.isArray(importedData)) {
        // Agregar los planes importados a la lista de planes
        setTrainingPlans(prevPlans => {
          // Crear un mapa de IDs existentes para evitar duplicados
          const existingIds = new Set(prevPlans.map(p => p.id));

          // Filtrar planes duplicados y agregar los nuevos
          const newPlans = importedData.filter(plan => !existingIds.has(plan.id));
          return [...prevPlans, ...newPlans.map(plan => ({ ...plan, status: 'available' }))];
        });

        return importedData;
      } else {
        // Es un solo plan
        const importedPlan = importedData;

        // Agregar el plan importado a la lista de planes
        setTrainingPlans(prevPlans => {
          // Verificar si ya existe un plan con el mismo ID
          if (prevPlans.some(p => p.id === importedPlan.id)) {
            // Generar un nuevo ID para evitar duplicados
            const newPlan = { ...importedPlan, id: Date.now().toString(), status: 'available' };
            return [...prevPlans, newPlan];
          }
          return [...prevPlans, { ...importedPlan, status: 'available' }];
        });

        return importedPlan;
      }
    } catch (error) {
      console.error('Error al importar el plan:', error);
      throw error;
    }
  };

  // Función para crear un plan de transición
  const createTransitionPlan = (sourcePlanId, options = {}) => {
    try {
      // Buscar el plan de origen
      const sourcePlan = trainingPlans.find(p => p.id === sourcePlanId);
      if (!sourcePlan) {
        throw new Error('Plan de origen no encontrado');
      }

      // Crear el plan de transición
      const transitionPlan = planTransitionService.createTransitionPlan(sourcePlan, options);

      // Agregar el plan a la lista de planes
      setTrainingPlans(prevPlans => {
        return [...prevPlans, { ...transitionPlan, status: 'available' }];
      });

      return transitionPlan;
    } catch (error) {
      console.error('Error al crear el plan de transición:', error);
      throw error;
    }
  };

  // Función para analizar un plan para transición
  const analyzePlanForTransition = (planId) => {
    try {
      // Buscar el plan
      const plan = trainingPlans.find(p => p.id === planId);
      if (!plan) {
        throw new Error('Plan no encontrado');
      }

      // Analizar el plan
      return planTransitionService.analyzePlanForTransition(plan, workoutLogs);
    } catch (error) {
      console.error('Error al analizar el plan para transición:', error);
      throw error;
    }
  };

  // Función para duplicar un plan de entrenamiento
  const duplicatePlan = (planId, options = {}) => {
    try {
      // Buscar el plan a duplicar
      const sourcePlan = trainingPlans.find(p => p.id === planId);
      if (!sourcePlan) {
        throw new Error('Plan no encontrado');
      }

      // Duplicar el plan
      const duplicatedPlan = trainingPlanService.duplicatePlan(sourcePlan, options);

      // Agregar el plan duplicado a la lista de planes
      setTrainingPlans(prevPlans => {
        return [...prevPlans, duplicatedPlan];
      });

      return duplicatedPlan;
    } catch (error) {
      console.error('Error al duplicar el plan:', error);
      throw error;
    }
  };

  // Valores que se proporcionarán a través del contexto
  const value = {
    // Nuevos modelos
    trainingPlan,
    setTrainingPlan,
    trainingPlans,
    setTrainingPlans,
    activePlanId,
    setActivePlanId,
    userPreferences,
    setUserPreferences,
    updateUserPreferences,

    // Compatibilidad con el modelo antiguo
    legacyPlan,
    setLegacyPlan,
    currentPhase: userPreferences?.trainingPreferences?.currentPhase || 1,

    // Funciones comunes
    workoutLogs,
    setWorkoutLogs,
    addWorkoutLog,
    updateExerciseProgress,
    changePhase,
    createNewPlan,
    archivePlan,
    deletePlan,
    activatePlan,
    getCurrentSession,
    getAvailableSessions,
    expandedDay,
    setExpandedDay,
    importData,
    loading,

    // Funciones de importación/exportación
    exportPlanToJson,
    downloadPlanAsJson,
    importPlanFromJson,

    // Funciones de transición de planes
    createTransitionPlan,
    analyzePlanForTransition,

    // Funciones de duplicación de planes
    duplicatePlan
  };

  return (
    <TrainingContext.Provider value={value}>
      {children}
    </TrainingContext.Provider>
  );
};
