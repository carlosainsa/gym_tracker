/**
 * Modelo para Plan de Entrenamiento
 * Representa un plan completo diseñado para un objetivo específico
 */
export class TrainingPlan {
  constructor({
    id = null,
    name = '',
    description = '',
    primaryGoal = '',
    secondaryGoals = [],
    goalPriorities = {},
    planDuration = 12, // en semanas
    periodizationType = 'linear',
    createdAt = new Date(),
    updatedAt = new Date(),
    userId = null,
    microcycles = [],
    isActive = true,
    version = '1.0',
    metadata = {}
  }) {
    this.id = id || `plan_${Date.now()}`;
    this.name = name;
    this.description = description;
    this.primaryGoal = primaryGoal;
    this.secondaryGoals = secondaryGoals;
    this.goalPriorities = goalPriorities;
    this.planDuration = planDuration;
    this.periodizationType = periodizationType;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.userId = userId;
    this.microcycles = microcycles;
    this.isActive = isActive;
    this.version = version;
    this.metadata = metadata;
  }

  /**
   * Convierte un plan antiguo al nuevo formato
   * @param {Object} legacyPlan - Plan en formato antiguo
   * @returns {TrainingPlan} - Nuevo plan en formato actualizado
   */
  static fromLegacyPlan(legacyPlan) {
    // Agrupar sesiones de entrenamiento por microciclo (anteriormente fase)
    const sessionsByMicrocycle = {};
    legacyPlan.forEach(workout => {
      if (!sessionsByMicrocycle[workout.phase]) {
        sessionsByMicrocycle[workout.phase] = [];
      }
      sessionsByMicrocycle[workout.phase].push(workout);
    });

    // Crear microciclos para cada fase anterior
    const microcycles = [];
    Object.keys(sessionsByMicrocycle).forEach(phase => {
      const sessions = sessionsByMicrocycle[phase];

      // Crear un microciclo por semana (4 semanas por fase anterior)
      for (let week = 0; week < 4; week++) {
        const microcycle = new Microcycle({
          name: `Semana ${week + 1}`,
          phase: parseInt(phase),
          weekNumber: week + 1,
          trainingSessions: sessions.map(session => {
            return TrainingSession.fromLegacyWorkout(session);
          })
        });
        microcycles.push(microcycle);
      }
    });

    return new TrainingPlan({
      name: 'Mi Primer Plan de Entrenamiento',
      description: 'Plan generado a partir del plan anterior',
      primaryGoal: 'hypertrophy',
      planDuration: microcycles.length,
      periodizationType: 'linear',
      microcycles: microcycles
    });
  }

  /**
   * Obtiene todas las sesiones de entrenamiento del plan
   * @returns {Array} - Lista de todas las sesiones
   */
  getAllSessions() {
    return this.microcycles.flatMap(microcycle => microcycle.trainingSessions);
  }

  /**
   * Obtiene todos los ejercicios del plan
   * @returns {Array} - Lista de todos los ejercicios
   */
  getAllExercises() {
    return this.getAllSessions().flatMap(session => session.exercises);
  }

  /**
   * Calcula el progreso general del plan
   * @returns {number} - Porcentaje de progreso (0-100)
   */
  calculateProgress() {
    const sessions = this.getAllSessions();
    if (sessions.length === 0) return 0;

    const totalProgress = sessions.reduce((sum, session) => sum + session.progress, 0);
    return Math.round(totalProgress / sessions.length);
  }

  /**
   * Agrega un microciclo al plan
   * @param {Microcycle} microcycle - Microciclo a agregar
   */
  addMicrocycle(microcycle) {
    this.microcycles.push(microcycle);
  }

  /**
   * Elimina un microciclo del plan
   * @param {string} microcycleId - ID del microciclo a eliminar
   * @returns {boolean} - true si se eliminó correctamente, false si no se encontró
   */
  removeMicrocycle(microcycleId) {
    const initialLength = this.microcycles.length;
    this.microcycles = this.microcycles.filter(microcycle => microcycle.id !== microcycleId);
    return initialLength > this.microcycles.length;
  }

  /**
   * Actualiza un microciclo existente
   * @param {string} microcycleId - ID del microciclo a actualizar
   * @param {Object} updatedData - Datos actualizados del microciclo
   * @returns {boolean} - true si se actualizó correctamente, false si no se encontró
   */
  updateMicrocycle(microcycleId, updatedData) {
    const microcycleIndex = this.microcycles.findIndex(microcycle => microcycle.id === microcycleId);
    if (microcycleIndex === -1) return false;

    // Crear un nuevo microciclo con los datos actualizados
    const currentMicrocycle = this.microcycles[microcycleIndex];
    const updatedMicrocycle = new Microcycle({
      ...currentMicrocycle,
      ...updatedData
    });

    // Reemplazar el microciclo antiguo con el actualizado
    this.microcycles[microcycleIndex] = updatedMicrocycle;
    return true;
  }

  /**
   * Obtiene un microciclo por su ID
   * @param {string} microcycleId - ID del microciclo a buscar
   * @returns {Microcycle|null} - El microciclo encontrado o null si no existe
   */
  getMicrocycleById(microcycleId) {
    return this.microcycles.find(microcycle => microcycle.id === microcycleId) || null;
  }

  /**
   * Obtiene microciclos por fase
   * @param {number} phase - Número de fase
   * @returns {Array<Microcycle>} - Lista de microciclos de la fase
   */
  getMicrocyclesByPhase(phase) {
    return this.microcycles.filter(microcycle => microcycle.phase === phase);
  }

  /**
   * Calcula el progreso detallado del plan
   * @returns {Object} - Objeto con detalles del progreso
   */
  calculateDetailedProgress() {
    if (this.microcycles.length === 0) {
      return {
        overall: 0,
        byPhase: {},
        byMicrocycle: [],
        totalSessions: 0,
        completedSessions: 0
      };
    }

    const sessions = this.getAllSessions();
    const completedSessions = sessions.filter(session => session.completed).length;

    // Progreso por fase
    const phases = [...new Set(this.microcycles.map(mc => mc.phase))].sort((a, b) => a - b);
    const byPhase = {};

    phases.forEach(phase => {
      const phaseMicrocycles = this.getMicrocyclesByPhase(phase);
      const phaseSessions = phaseMicrocycles.flatMap(mc => mc.trainingSessions);

      if (phaseSessions.length > 0) {
        const phaseProgress = Math.round(
          phaseSessions.reduce((sum, session) => sum + session.progress, 0) / phaseSessions.length
        );

        byPhase[phase] = {
          progress: phaseProgress,
          totalSessions: phaseSessions.length,
          completedSessions: phaseSessions.filter(session => session.completed).length
        };
      } else {
        byPhase[phase] = { progress: 0, totalSessions: 0, completedSessions: 0 };
      }
    });

    // Progreso por microciclo
    const byMicrocycle = this.microcycles.map(microcycle => ({
      id: microcycle.id,
      name: microcycle.name,
      phase: microcycle.phase,
      weekNumber: microcycle.weekNumber,
      progress: microcycle.calculateProgress(),
      isDeload: microcycle.isDeload
    }));

    return {
      overall: this.calculateProgress(),
      byPhase,
      byMicrocycle,
      totalSessions: sessions.length,
      completedSessions
    };
  }
}

/**
 * Modelo para Microciclo
 * Representa un periodo de 1 semana dentro del plan de entrenamiento
 */
export class Microcycle {
  constructor({
    id = null,
    name = '',
    description = '',
    phase = 1,
    weekNumber = 1,
    weeklyFrequency = 3,
    splitConfiguration = 'fullbody',
    trainingDays = [1, 3, 5], // Lunes, Miércoles, Viernes
    cycleIntensity = 'medium',
    trainingSessions = [],
    isDeload = false,
    deloadStrategy = 'volume', // 'volume', 'intensity', 'both'
    volumeAdjustment = 0, // Porcentaje de ajuste de volumen (-20 = reducir 20%)
    intensityAdjustment = 0, // Porcentaje de ajuste de intensidad
    notes = '',
    metadata = {}
  }) {
    this.id = id || `microcycle_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    this.name = name;
    this.description = description;
    this.phase = phase;
    this.weekNumber = weekNumber;
    this.weeklyFrequency = weeklyFrequency;
    this.splitConfiguration = splitConfiguration;
    this.trainingDays = trainingDays;
    this.cycleIntensity = cycleIntensity;
    this.trainingSessions = trainingSessions;
    this.isDeload = isDeload;
    this.deloadStrategy = deloadStrategy;
    this.volumeAdjustment = volumeAdjustment;
    this.intensityAdjustment = intensityAdjustment;
    this.notes = notes;
    this.metadata = metadata;
  }

  /**
   * Calcula el progreso del microciclo
   * @returns {number} - Porcentaje de progreso (0-100)
   */
  calculateProgress() {
    if (this.trainingSessions.length === 0) return 0;

    const totalProgress = this.trainingSessions.reduce((sum, session) => sum + session.progress, 0);
    return Math.round(totalProgress / this.trainingSessions.length);
  }

  /**
   * Calcula el progreso detallado del microciclo
   * @returns {Object} - Objeto con detalles del progreso
   */
  calculateDetailedProgress() {
    if (this.trainingSessions.length === 0) {
      return {
        overall: 0,
        completed: 0,
        totalSessions: 0,
        completedSessions: 0,
        sessionsProgress: []
      };
    }

    const completedSessions = this.trainingSessions.filter(session => session.completed).length;
    const sessionsProgress = this.trainingSessions.map(session => ({
      id: session.id,
      name: session.name,
      progress: session.progress,
      completed: session.completed,
      completedDate: session.completedDate
    }));

    return {
      overall: Math.round(this.trainingSessions.reduce((sum, session) => sum + session.progress, 0) / this.trainingSessions.length),
      completed: Math.round((completedSessions / this.trainingSessions.length) * 100),
      totalSessions: this.trainingSessions.length,
      completedSessions,
      sessionsProgress
    };
  }

  /**
   * Agrega una sesión de entrenamiento al microciclo
   * @param {TrainingSession} session - Sesión de entrenamiento a agregar
   */
  addSession(session) {
    this.trainingSessions.push(session);
  }

  /**
   * Elimina una sesión de entrenamiento del microciclo
   * @param {string} sessionId - ID de la sesión a eliminar
   * @returns {boolean} - true si se eliminó correctamente, false si no se encontró
   */
  removeSession(sessionId) {
    const initialLength = this.trainingSessions.length;
    this.trainingSessions = this.trainingSessions.filter(session => session.id !== sessionId);
    return initialLength > this.trainingSessions.length;
  }

  /**
   * Actualiza una sesión de entrenamiento existente
   * @param {string} sessionId - ID de la sesión a actualizar
   * @param {Object} updatedData - Datos actualizados de la sesión
   * @returns {boolean} - true si se actualizó correctamente, false si no se encontró
   */
  updateSession(sessionId, updatedData) {
    const sessionIndex = this.trainingSessions.findIndex(session => session.id === sessionId);
    if (sessionIndex === -1) return false;

    // Crear una nueva sesión con los datos actualizados
    const currentSession = this.trainingSessions[sessionIndex];
    const updatedSession = new TrainingSession({
      ...currentSession,
      ...updatedData
    });

    // Reemplazar la sesión antigua con la actualizada
    this.trainingSessions[sessionIndex] = updatedSession;
    return true;
  }

  /**
   * Obtiene una sesión de entrenamiento por su ID
   * @param {string} sessionId - ID de la sesión a buscar
   * @returns {TrainingSession|null} - La sesión encontrada o null si no existe
   */
  getSessionById(sessionId) {
    return this.trainingSessions.find(session => session.id === sessionId) || null;
  }
}

/**
 * Modelo para Sesión de Entrenamiento
 * Representa una sesión de entrenamiento específica para un día
 */
export class TrainingSession {
  constructor({
    id = null,
    name = '',
    description = '',
    recommendedDay = null,
    sessionDuration = 60, // en minutos
    sessionFocus = [],
    availableEquipment = [],
    sessionStructure = {
      warmup: [],
      main: [],
      finisher: []
    },
    exercises = [],
    progress = 0,
    completed = false,
    completedDate = null,
    metadata = {}
  }) {
    this.id = id || `session_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    this.name = name;
    this.description = description;
    this.recommendedDay = recommendedDay;
    this.sessionDuration = sessionDuration;
    this.sessionFocus = sessionFocus;
    this.availableEquipment = availableEquipment;
    this.sessionStructure = sessionStructure;
    this.exercises = exercises;
    this.progress = progress;
    this.completed = completed;
    this.completedDate = completedDate;
    this.metadata = metadata;
  }

  /**
   * Convierte un entrenamiento antiguo al nuevo formato de sesión
   * @param {Object} legacyWorkout - Entrenamiento en formato antiguo
   * @returns {TrainingSession} - Nueva sesión de entrenamiento en formato actualizado
   */
  static fromLegacyWorkout(legacyWorkout) {
    // Extraer secciones del description si existe
    let warmup = [];
    let main = [];
    let finisher = [];

    if (legacyWorkout.description) {
      const sections = legacyWorkout.description.split('\\n\\n');

      // Intentar extraer las secciones
      sections.forEach(section => {
        if (section.includes('Calentamiento')) {
          warmup = section.split('\\n').filter(line => line.includes('-')).map(line => line.trim());
        } else if (section.includes('Bloque Principal')) {
          main = section.split('\\n').filter(line => line.includes('-')).map(line => line.trim());
        } else if (section.includes('Finalización')) {
          finisher = section.split('\\n').filter(line => line.includes('-')).map(line => line.trim());
        }
      });
    }

    // Convertir ejercicios
    const exercises = legacyWorkout.exercises.map(ex => {
      return new Exercise({
        id: ex.id,
        name: ex.name,
        description: ex.description,
        muscleGroups: ex.muscleGroups,
        category: ex.category,
        equipment: ex.equipment,
        rest: ex.rest,
        sets: ex.sets.map(set => new Set({
          reps: set.reps,
          weight: set.weight
        })),
        progress: ex.progress || 0
      });
    });

    return new TrainingSession({
      id: legacyWorkout.id,
      name: legacyWorkout.name,
      description: legacyWorkout.description,
      recommendedDay: legacyWorkout.recommendedDay,
      sessionStructure: {
        warmup,
        main,
        finisher
      },
      exercises: exercises,
      progress: legacyWorkout.progress || 0
    });
  }

  /**
   * Calcula el tiempo estimado de la sesión
   * @returns {number} - Tiempo estimado en minutos
   */
  calculateEstimatedTime() {
    // Tiempo base para calentamiento y finalización
    let totalTime = 15; // 10 min calentamiento + 5 min finalización

    // Sumar tiempo de ejercicios
    this.exercises.forEach(exercise => {
      const sets = exercise.sets.length;
      const restTime = parseInt(exercise.rest) || 60;

      // Tiempo por serie (aprox. 45 segundos) + descanso
      const exerciseTime = sets * (45 + restTime) / 60; // convertir a minutos
      totalTime += exerciseTime;
    });

    return Math.round(totalTime);
  }

  /**
   * Agrega un ejercicio a la sesión
   * @param {Exercise} exercise - Ejercicio a agregar
   */
  addExercise(exercise) {
    this.exercises.push(exercise);
  }

  /**
   * Elimina un ejercicio de la sesión
   * @param {string} exerciseId - ID del ejercicio a eliminar
   * @returns {boolean} - true si se eliminó correctamente, false si no se encontró
   */
  removeExercise(exerciseId) {
    const initialLength = this.exercises.length;
    this.exercises = this.exercises.filter(exercise => exercise.id !== exerciseId);
    return initialLength > this.exercises.length;
  }

  /**
   * Actualiza un ejercicio existente
   * @param {string} exerciseId - ID del ejercicio a actualizar
   * @param {Object} updatedData - Datos actualizados del ejercicio
   * @returns {boolean} - true si se actualizó correctamente, false si no se encontró
   */
  updateExercise(exerciseId, updatedData) {
    const exerciseIndex = this.exercises.findIndex(exercise => exercise.id === exerciseId);
    if (exerciseIndex === -1) return false;

    // Crear un nuevo ejercicio con los datos actualizados
    const currentExercise = this.exercises[exerciseIndex];
    const updatedExercise = new Exercise({
      ...currentExercise,
      ...updatedData
    });

    // Reemplazar el ejercicio antiguo con el actualizado
    this.exercises[exerciseIndex] = updatedExercise;
    return true;
  }

  /**
   * Obtiene un ejercicio por su ID
   * @param {string} exerciseId - ID del ejercicio a buscar
   * @returns {Exercise|null} - El ejercicio encontrado o null si no existe
   */
  getExerciseById(exerciseId) {
    return this.exercises.find(exercise => exercise.id === exerciseId) || null;
  }

  /**
   * Marca la sesión como completada
   * @param {Date} [date=new Date()] - Fecha de completado
   */
  markAsCompleted(date = new Date()) {
    this.completed = true;
    this.completedDate = date;
    this.progress = 100;
  }

  /**
   * Calcula el progreso detallado de la sesión
   * @returns {Object} - Objeto con detalles del progreso
   */
  calculateDetailedProgress() {
    if (this.exercises.length === 0) {
      return {
        overall: 0,
        byExercise: [],
        completed: this.completed
      };
    }

    const byExercise = this.exercises.map(exercise => ({
      id: exercise.id,
      name: exercise.name,
      progress: exercise.progress,
      totalSets: exercise.sets.length,
      completedSets: exercise.sets.filter(set => set.isCompleted).length
    }));

    return {
      overall: this.progress,
      byExercise,
      completed: this.completed,
      completedDate: this.completedDate
    };
  }
}

/**
 * Modelo para Ejercicio
 * Representa un movimiento específico con parámetros definidos
 */
export class Exercise {
  constructor({
    id = null,
    name = '',
    description = '',
    muscleGroups = [],
    category = '',
    equipment = '',
    videoUrl = '',
    imageUrl = '',
    rest = '60 seg',
    tempo = '2-0-2-0', // concéntrica-pausa-excéntrica-pausa
    sets = [],
    isTimeBased = false,
    progress = 0,
    notes = '',
    metadata = {}
  }) {
    this.id = id || `exercise_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    this.name = name;
    this.description = description;
    this.muscleGroups = muscleGroups;
    this.category = category;
    this.equipment = equipment;
    this.videoUrl = videoUrl;
    this.imageUrl = imageUrl;
    this.rest = rest;
    this.tempo = tempo;
    this.sets = sets;
    this.isTimeBased = isTimeBased || (sets.length > 0 && sets[0].reps && sets[0].reps.toString().includes('seg'));
    this.progress = progress;
    this.notes = notes;
    this.metadata = metadata;
  }

  /**
   * Calcula el volumen total del ejercicio (peso x repeticiones)
   * @returns {number} - Volumen total
   */
  calculateVolume() {
    if (this.isTimeBased) return 0;

    return this.sets.reduce((total, set) => {
      // Extraer el número de repeticiones (puede ser un rango como "8-10")
      let reps = set.reps;
      if (typeof reps === 'string' && reps.includes('-')) {
        const [min, max] = reps.split('-').map(Number);
        reps = (min + max) / 2; // Usar el promedio del rango
      } else if (typeof reps === 'string') {
        reps = parseInt(reps) || 0;
      }

      // Calcular el volumen de la serie
      const weight = parseFloat(set.weight) || 0;
      return total + (reps * weight);
    }, 0);
  }

  /**
   * Agrega una serie al ejercicio
   * @param {Set} set - Serie a agregar
   */
  addSet(set) {
    this.sets.push(set);
  }

  /**
   * Elimina una serie del ejercicio por su índice
   * @param {number} index - Índice de la serie a eliminar
   * @returns {boolean} - true si se eliminó correctamente, false si el índice es inválido
   */
  removeSet(index) {
    if (index < 0 || index >= this.sets.length) return false;

    this.sets.splice(index, 1);
    return true;
  }

  /**
   * Actualiza una serie existente
   * @param {number} index - Índice de la serie a actualizar
   * @param {Object} updatedData - Datos actualizados de la serie
   * @returns {boolean} - true si se actualizó correctamente, false si el índice es inválido
   */
  updateSet(index, updatedData) {
    if (index < 0 || index >= this.sets.length) return false;

    // Crear una nueva serie con los datos actualizados
    const currentSet = this.sets[index];
    const updatedSet = new Set({
      ...currentSet,
      ...updatedData
    });

    // Reemplazar la serie antigua con la actualizada
    this.sets[index] = updatedSet;
    return true;
  }

  /**
   * Calcula el progreso del ejercicio basado en las series completadas
   * @returns {number} - Porcentaje de progreso (0-100)
   */
  calculateProgress() {
    if (this.sets.length === 0) return 0;

    const completedSets = this.sets.filter(set => set.isCompleted).length;
    return Math.round((completedSets / this.sets.length) * 100);
  }

  /**
   * Marca todas las series del ejercicio como completadas
   * @param {Array} actualValues - Array de objetos con valores reales (opcional)
   */
  markAllSetsAsCompleted(actualValues = []) {
    this.sets.forEach((set, index) => {
      const actualValue = actualValues[index] || {};

      set.isCompleted = true;
      if (actualValue.reps !== undefined) set.actualReps = actualValue.reps;
      if (actualValue.weight !== undefined) set.actualWeight = actualValue.weight;
      if (actualValue.rpe !== undefined) set.actualRpe = actualValue.rpe;
    });

    this.progress = 100;
  }
}

/**
 * Modelo para Serie
 * Representa un conjunto de repeticiones de un ejercicio
 */
export class Set {
  constructor({
    reps = '',
    weight = '',
    rpe = null,
    tempo = null,
    restAfter = null,
    isCompleted = false,
    actualReps = null,
    actualWeight = null,
    actualRpe = null,
    completedDate = null,
    duration = null, // Duración en segundos para ejercicios basados en tiempo
    notes = '',
    metadata = {}
  }) {
    this.reps = reps;
    this.weight = weight;
    this.rpe = rpe;
    this.tempo = tempo;
    this.restAfter = restAfter;
    this.isCompleted = isCompleted;
    this.actualReps = actualReps;
    this.actualWeight = actualWeight;
    this.actualRpe = actualRpe;
    this.completedDate = completedDate;
    this.duration = duration;
    this.notes = notes;
    this.metadata = metadata;
  }

  /**
   * Marca la serie como completada
   * @param {Object} actualValues - Valores reales de la serie
   * @param {Date} [date=new Date()] - Fecha de completado
   */
  markAsCompleted(actualValues = {}, date = new Date()) {
    this.isCompleted = true;
    this.completedDate = date;

    if (actualValues.reps !== undefined) this.actualReps = actualValues.reps;
    if (actualValues.weight !== undefined) this.actualWeight = actualValues.weight;
    if (actualValues.rpe !== undefined) this.actualRpe = actualValues.rpe;
    if (actualValues.duration !== undefined) this.duration = actualValues.duration;
  }

  /**
   * Calcula el progreso de la serie comparando valores planeados vs. reales
   * @returns {number} - Porcentaje de progreso (0-100)
   */
  calculateProgress() {
    if (!this.isCompleted) return 0;

    // Para ejercicios basados en tiempo
    if (this.reps && this.reps.toString().includes('seg')) {
      const plannedTime = parseInt(this.reps) || 0;
      const actualTime = this.duration || 0;

      if (plannedTime === 0) return 100; // Si no hay tiempo planeado, considerar completado
      return Math.min(100, Math.round((actualTime / plannedTime) * 100));
    }

    // Para ejercicios basados en repeticiones
    let repsProgress = 0;
    let weightProgress = 0;

    // Calcular progreso de repeticiones
    if (this.reps && this.actualReps) {
      let plannedReps = this.reps;

      // Manejar rangos de repeticiones (ej: "8-10")
      if (typeof plannedReps === 'string' && plannedReps.includes('-')) {
        const [min, max] = plannedReps.split('-').map(Number);
        const targetReps = max; // Usar el máximo como objetivo
        repsProgress = Math.min(100, Math.round((this.actualReps / targetReps) * 100));
      } else {
        plannedReps = parseInt(plannedReps) || 0;
        if (plannedReps > 0) {
          repsProgress = Math.min(100, Math.round((this.actualReps / plannedReps) * 100));
        } else {
          repsProgress = 100; // Si no hay repeticiones planeadas, considerar completado
        }
      }
    } else if (this.isCompleted) {
      repsProgress = 100; // Si está marcado como completado pero sin datos, asumir 100%
    }

    // Calcular progreso de peso
    if (this.weight && this.actualWeight) {
      const plannedWeight = parseFloat(this.weight) || 0;
      const actualWeight = parseFloat(this.actualWeight) || 0;

      if (plannedWeight > 0) {
        weightProgress = Math.min(100, Math.round((actualWeight / plannedWeight) * 100));
      } else {
        weightProgress = 100; // Si no hay peso planeado, considerar completado
      }
    } else if (this.isCompleted) {
      weightProgress = 100; // Si está marcado como completado pero sin datos, asumir 100%
    }

    // Promedio de progreso
    return Math.round((repsProgress + weightProgress) / 2);
  }
}
