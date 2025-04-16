/**
 * Servicio para análisis y estadísticas de planes de entrenamiento
 */
class AnalyticsService {
  /**
   * Analiza un plan de entrenamiento y genera estadísticas
   * @param {Object} plan - Plan de entrenamiento
   * @param {Array} workoutLogs - Registros de entrenamientos
   * @returns {Object} - Estadísticas del plan
   */
  analyzePlan(plan, workoutLogs = []) {
    if (!plan) {
      return null;
    }
    
    // Estadísticas básicas del plan
    const basicStats = this._getBasicStats(plan);
    
    // Estadísticas de volumen
    const volumeStats = this._getVolumeStats(plan);
    
    // Estadísticas de intensidad
    const intensityStats = this._getIntensityStats(plan);
    
    // Estadísticas de progresión
    const progressionStats = this._getProgressionStats(plan);
    
    // Estadísticas de cumplimiento
    const complianceStats = this._getComplianceStats(plan, workoutLogs);
    
    // Estadísticas de distribución de ejercicios
    const exerciseDistribution = this._getExerciseDistribution(plan);
    
    return {
      basic: basicStats,
      volume: volumeStats,
      intensity: intensityStats,
      progression: progressionStats,
      compliance: complianceStats,
      exerciseDistribution
    };
  }
  
  /**
   * Obtiene estadísticas básicas del plan
   * @param {Object} plan - Plan de entrenamiento
   * @returns {Object} - Estadísticas básicas
   * @private
   */
  _getBasicStats(plan) {
    // Contar microciclos, sesiones y ejercicios
    const microcycleCount = plan.microcycles?.length || 0;
    
    let sessionCount = 0;
    let exerciseCount = 0;
    let setCount = 0;
    let uniqueExercises = new Set();
    
    // Recorrer microciclos
    plan.microcycles?.forEach(microcycle => {
      sessionCount += microcycle.trainingSessions?.length || 0;
      
      // Recorrer sesiones
      microcycle.trainingSessions?.forEach(session => {
        exerciseCount += session.exercises?.length || 0;
        
        // Recorrer ejercicios
        session.exercises?.forEach(exercise => {
          uniqueExercises.add(exercise.name);
          setCount += exercise.sets?.length || 0;
        });
      });
    });
    
    return {
      duration: microcycleCount,
      sessionCount,
      exerciseCount,
      setCount,
      uniqueExerciseCount: uniqueExercises.size,
      frequency: sessionCount / microcycleCount || 0,
      exercisesPerSession: exerciseCount / sessionCount || 0,
      setsPerExercise: setCount / exerciseCount || 0
    };
  }
  
  /**
   * Obtiene estadísticas de volumen del plan
   * @param {Object} plan - Plan de entrenamiento
   * @returns {Object} - Estadísticas de volumen
   * @private
   */
  _getVolumeStats(plan) {
    let totalSets = 0;
    let totalReps = 0;
    let totalWeight = 0;
    
    // Volumen por grupo muscular
    const volumeByMuscleGroup = {};
    
    // Volumen por semana
    const volumeByWeek = {};
    
    // Recorrer microciclos
    plan.microcycles?.forEach(microcycle => {
      const weekNumber = microcycle.weekNumber || 0;
      volumeByWeek[weekNumber] = volumeByWeek[weekNumber] || { sets: 0, reps: 0, weight: 0 };
      
      // Recorrer sesiones
      microcycle.trainingSessions?.forEach(session => {
        // Recorrer ejercicios
        session.exercises?.forEach(exercise => {
          // Grupo muscular principal
          const muscleGroup = exercise.primaryMuscleGroup || 'other';
          volumeByMuscleGroup[muscleGroup] = volumeByMuscleGroup[muscleGroup] || { sets: 0, reps: 0, weight: 0 };
          
          // Recorrer series
          exercise.sets?.forEach(set => {
            // Calcular repeticiones (promedio si es un rango)
            const reps = set.repsMin && set.repsMax 
              ? (set.repsMin + set.repsMax) / 2 
              : set.reps || 0;
            
            // Calcular peso
            const weight = set.weight || 0;
            
            // Actualizar contadores
            totalSets++;
            totalReps += reps;
            totalWeight += weight * reps; // Volumen = peso * reps
            
            // Actualizar volumen por grupo muscular
            volumeByMuscleGroup[muscleGroup].sets++;
            volumeByMuscleGroup[muscleGroup].reps += reps;
            volumeByMuscleGroup[muscleGroup].weight += weight * reps;
            
            // Actualizar volumen por semana
            volumeByWeek[weekNumber].sets++;
            volumeByWeek[weekNumber].reps += reps;
            volumeByWeek[weekNumber].weight += weight * reps;
          });
        });
      });
    });
    
    return {
      totalSets,
      totalReps,
      totalWeight,
      volumeByMuscleGroup,
      volumeByWeek
    };
  }
  
  /**
   * Obtiene estadísticas de intensidad del plan
   * @param {Object} plan - Plan de entrenamiento
   * @returns {Object} - Estadísticas de intensidad
   * @private
   */
  _getIntensityStats(plan) {
    let totalIntensity = 0;
    let intensityCount = 0;
    
    // Intensidad por grupo muscular
    const intensityByMuscleGroup = {};
    
    // Intensidad por semana
    const intensityByWeek = {};
    
    // Recorrer microciclos
    plan.microcycles?.forEach(microcycle => {
      const weekNumber = microcycle.weekNumber || 0;
      intensityByWeek[weekNumber] = intensityByWeek[weekNumber] || { total: 0, count: 0 };
      
      // Recorrer sesiones
      microcycle.trainingSessions?.forEach(session => {
        // Recorrer ejercicios
        session.exercises?.forEach(exercise => {
          // Grupo muscular principal
          const muscleGroup = exercise.primaryMuscleGroup || 'other';
          intensityByMuscleGroup[muscleGroup] = intensityByMuscleGroup[muscleGroup] || { total: 0, count: 0 };
          
          // Recorrer series
          exercise.sets?.forEach(set => {
            // Solo considerar series con peso
            if (set.weight && set.weight > 0) {
              // Actualizar contadores
              totalIntensity += set.weight;
              intensityCount++;
              
              // Actualizar intensidad por grupo muscular
              intensityByMuscleGroup[muscleGroup].total += set.weight;
              intensityByMuscleGroup[muscleGroup].count++;
              
              // Actualizar intensidad por semana
              intensityByWeek[weekNumber].total += set.weight;
              intensityByWeek[weekNumber].count++;
            }
          });
        });
      });
    });
    
    // Calcular promedios
    const averageIntensity = intensityCount > 0 ? totalIntensity / intensityCount : 0;
    
    // Calcular promedios por grupo muscular
    Object.keys(intensityByMuscleGroup).forEach(group => {
      const { total, count } = intensityByMuscleGroup[group];
      intensityByMuscleGroup[group].average = count > 0 ? total / count : 0;
    });
    
    // Calcular promedios por semana
    Object.keys(intensityByWeek).forEach(week => {
      const { total, count } = intensityByWeek[week];
      intensityByWeek[week].average = count > 0 ? total / count : 0;
    });
    
    return {
      averageIntensity,
      intensityByMuscleGroup,
      intensityByWeek
    };
  }
  
  /**
   * Obtiene estadísticas de progresión del plan
   * @param {Object} plan - Plan de entrenamiento
   * @returns {Object} - Estadísticas de progresión
   * @private
   */
  _getProgressionStats(plan) {
    // Progresión de volumen por semana
    const volumeProgression = {};
    
    // Progresión de intensidad por semana
    const intensityProgression = {};
    
    // Recorrer microciclos
    plan.microcycles?.forEach(microcycle => {
      const weekNumber = microcycle.weekNumber || 0;
      volumeProgression[weekNumber] = { total: 0, count: 0 };
      intensityProgression[weekNumber] = { total: 0, count: 0 };
      
      // Recorrer sesiones
      microcycle.trainingSessions?.forEach(session => {
        // Recorrer ejercicios
        session.exercises?.forEach(exercise => {
          // Recorrer series
          exercise.sets?.forEach(set => {
            // Calcular repeticiones (promedio si es un rango)
            const reps = set.repsMin && set.repsMax 
              ? (set.repsMin + set.repsMax) / 2 
              : set.reps || 0;
            
            // Calcular peso
            const weight = set.weight || 0;
            
            // Actualizar volumen
            volumeProgression[weekNumber].total += weight * reps;
            volumeProgression[weekNumber].count++;
            
            // Actualizar intensidad
            if (weight > 0) {
              intensityProgression[weekNumber].total += weight;
              intensityProgression[weekNumber].count++;
            }
          });
        });
      });
    });
    
    // Calcular promedios
    Object.keys(volumeProgression).forEach(week => {
      const { total, count } = volumeProgression[week];
      volumeProgression[week].average = count > 0 ? total / count : 0;
    });
    
    Object.keys(intensityProgression).forEach(week => {
      const { total, count } = intensityProgression[week];
      intensityProgression[week].average = count > 0 ? total / count : 0;
    });
    
    // Calcular tasas de progresión
    const volumeProgressionRate = this._calculateProgressionRate(volumeProgression);
    const intensityProgressionRate = this._calculateProgressionRate(intensityProgression);
    
    return {
      volumeProgression,
      intensityProgression,
      volumeProgressionRate,
      intensityProgressionRate
    };
  }
  
  /**
   * Calcula la tasa de progresión
   * @param {Object} progressionData - Datos de progresión
   * @returns {number} - Tasa de progresión
   * @private
   */
  _calculateProgressionRate(progressionData) {
    const weeks = Object.keys(progressionData).map(Number).sort((a, b) => a - b);
    
    if (weeks.length < 2) {
      return 0;
    }
    
    const firstWeek = weeks[0];
    const lastWeek = weeks[weeks.length - 1];
    
    const firstValue = progressionData[firstWeek].average;
    const lastValue = progressionData[lastWeek].average;
    
    if (firstValue === 0) {
      return 0;
    }
    
    // Tasa de progresión = (valor final - valor inicial) / valor inicial * 100
    return (lastValue - firstValue) / firstValue * 100;
  }
  
  /**
   * Obtiene estadísticas de cumplimiento del plan
   * @param {Object} plan - Plan de entrenamiento
   * @param {Array} workoutLogs - Registros de entrenamientos
   * @returns {Object} - Estadísticas de cumplimiento
   * @private
   */
  _getComplianceStats(plan, workoutLogs = []) {
    if (!workoutLogs || workoutLogs.length === 0) {
      return {
        sessionComplianceRate: 0,
        exerciseComplianceRate: 0,
        setComplianceRate: 0,
        complianceByWeek: {},
        complianceByMuscleGroup: {}
      };
    }
    
    // Contar sesiones planificadas y completadas
    let plannedSessions = 0;
    let completedSessions = 0;
    
    // Contar ejercicios planificados y completados
    let plannedExercises = 0;
    let completedExercises = 0;
    
    // Contar series planificadas y completadas
    let plannedSets = 0;
    let completedSets = 0;
    
    // Cumplimiento por semana
    const complianceByWeek = {};
    
    // Cumplimiento por grupo muscular
    const complianceByMuscleGroup = {};
    
    // Mapear registros de entrenamientos por ID de sesión
    const logsBySessionId = {};
    workoutLogs.forEach(log => {
      if (log.sessionId) {
        logsBySessionId[log.sessionId] = log;
      }
    });
    
    // Recorrer microciclos
    plan.microcycles?.forEach(microcycle => {
      const weekNumber = microcycle.weekNumber || 0;
      complianceByWeek[weekNumber] = complianceByWeek[weekNumber] || {
        planned: { sessions: 0, exercises: 0, sets: 0 },
        completed: { sessions: 0, exercises: 0, sets: 0 }
      };
      
      // Recorrer sesiones
      microcycle.trainingSessions?.forEach(session => {
        plannedSessions++;
        complianceByWeek[weekNumber].planned.sessions++;
        
        // Verificar si la sesión fue completada
        const sessionLog = logsBySessionId[session.id];
        const isSessionCompleted = sessionLog && sessionLog.completed;
        
        if (isSessionCompleted) {
          completedSessions++;
          complianceByWeek[weekNumber].completed.sessions++;
        }
        
        // Recorrer ejercicios
        session.exercises?.forEach(exercise => {
          plannedExercises++;
          complianceByWeek[weekNumber].planned.exercises++;
          
          // Grupo muscular principal
          const muscleGroup = exercise.primaryMuscleGroup || 'other';
          complianceByMuscleGroup[muscleGroup] = complianceByMuscleGroup[muscleGroup] || {
            planned: { exercises: 0, sets: 0 },
            completed: { exercises: 0, sets: 0 }
          };
          
          complianceByMuscleGroup[muscleGroup].planned.exercises++;
          
          // Verificar si el ejercicio fue completado
          const exerciseLog = sessionLog?.exercises?.find(e => e.id === exercise.id);
          const isExerciseCompleted = exerciseLog && exerciseLog.completed;
          
          if (isExerciseCompleted) {
            completedExercises++;
            complianceByWeek[weekNumber].completed.exercises++;
            complianceByMuscleGroup[muscleGroup].completed.exercises++;
          }
          
          // Recorrer series
          exercise.sets?.forEach(set => {
            plannedSets++;
            complianceByWeek[weekNumber].planned.sets++;
            complianceByMuscleGroup[muscleGroup].planned.sets++;
            
            // Verificar si la serie fue completada
            const setLog = exerciseLog?.sets?.find(s => s.id === set.id);
            const isSetCompleted = setLog && setLog.completed;
            
            if (isSetCompleted) {
              completedSets++;
              complianceByWeek[weekNumber].completed.sets++;
              complianceByMuscleGroup[muscleGroup].completed.sets++;
            }
          });
        });
      });
    });
    
    // Calcular tasas de cumplimiento
    const sessionComplianceRate = plannedSessions > 0 ? (completedSessions / plannedSessions) * 100 : 0;
    const exerciseComplianceRate = plannedExercises > 0 ? (completedExercises / plannedExercises) * 100 : 0;
    const setComplianceRate = plannedSets > 0 ? (completedSets / plannedSets) * 100 : 0;
    
    // Calcular tasas de cumplimiento por semana
    Object.keys(complianceByWeek).forEach(week => {
      const { planned, completed } = complianceByWeek[week];
      
      complianceByWeek[week].sessionRate = planned.sessions > 0 
        ? (completed.sessions / planned.sessions) * 100 
        : 0;
      
      complianceByWeek[week].exerciseRate = planned.exercises > 0 
        ? (completed.exercises / planned.exercises) * 100 
        : 0;
      
      complianceByWeek[week].setRate = planned.sets > 0 
        ? (completed.sets / planned.sets) * 100 
        : 0;
    });
    
    // Calcular tasas de cumplimiento por grupo muscular
    Object.keys(complianceByMuscleGroup).forEach(group => {
      const { planned, completed } = complianceByMuscleGroup[group];
      
      complianceByMuscleGroup[group].exerciseRate = planned.exercises > 0 
        ? (completed.exercises / planned.exercises) * 100 
        : 0;
      
      complianceByMuscleGroup[group].setRate = planned.sets > 0 
        ? (completed.sets / planned.sets) * 100 
        : 0;
    });
    
    return {
      sessionComplianceRate,
      exerciseComplianceRate,
      setComplianceRate,
      complianceByWeek,
      complianceByMuscleGroup
    };
  }
  
  /**
   * Obtiene la distribución de ejercicios del plan
   * @param {Object} plan - Plan de entrenamiento
   * @returns {Object} - Distribución de ejercicios
   * @private
   */
  _getExerciseDistribution(plan) {
    // Distribución por tipo de ejercicio
    const byType = {};
    
    // Distribución por grupo muscular
    const byMuscleGroup = {};
    
    // Distribución por equipo
    const byEquipment = {};
    
    // Recorrer microciclos
    plan.microcycles?.forEach(microcycle => {
      // Recorrer sesiones
      microcycle.trainingSessions?.forEach(session => {
        // Recorrer ejercicios
        session.exercises?.forEach(exercise => {
          // Tipo de ejercicio
          const exerciseType = exercise.type || 'other';
          byType[exerciseType] = (byType[exerciseType] || 0) + 1;
          
          // Grupo muscular principal
          const primaryMuscleGroup = exercise.primaryMuscleGroup || 'other';
          byMuscleGroup[primaryMuscleGroup] = (byMuscleGroup[primaryMuscleGroup] || 0) + 1;
          
          // Grupos musculares secundarios
          exercise.secondaryMuscleGroups?.forEach(group => {
            byMuscleGroup[group] = (byMuscleGroup[group] || 0) + 0.5; // Peso menor para grupos secundarios
          });
          
          // Equipo
          const equipment = exercise.equipment || 'bodyweight';
          byEquipment[equipment] = (byEquipment[equipment] || 0) + 1;
        });
      });
    });
    
    return {
      byType,
      byMuscleGroup,
      byEquipment
    };
  }
}

export default new AnalyticsService();
