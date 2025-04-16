import { TrainingPlan, Microcycle, TrainingSession, Exercise, Set } from '../models/TrainingPlan';
import { v4 as uuidv4 } from 'uuid';

/**
 * Servicio para manejar la transición entre planes de entrenamiento
 */
class PlanTransitionService {
  /**
   * Crea un nuevo plan basado en uno existente, manteniendo la progresión
   * @param {TrainingPlan} sourcePlan - Plan de entrenamiento origen
   * @param {Object} options - Opciones de transición
   * @returns {TrainingPlan} - Nuevo plan de entrenamiento
   */
  createTransitionPlan(sourcePlan, options = {}) {
    if (!sourcePlan) {
      throw new Error('Se requiere un plan de origen para la transición');
    }
    
    const {
      name = `Transición desde ${sourcePlan.name}`,
      description = `Plan de transición basado en ${sourcePlan.name}`,
      adjustWeights = true,
      weightAdjustmentFactor = 1.05, // 5% de incremento por defecto
      keepExercises = true,
      keepStructure = true,
      duration = sourcePlan.duration || 4, // Duración en semanas
      periodizationType = sourcePlan.periodizationType || 'linear',
      frequency = sourcePlan.frequency || 3,
      splitType = sourcePlan.splitType || 'full_body',
      equipment = sourcePlan.equipment || ['bodyweight', 'dumbbell', 'barbell'],
      primaryGoal = sourcePlan.primaryGoal || 'strength',
      secondaryGoal = sourcePlan.secondaryGoal || 'hypertrophy',
      difficultyLevel = sourcePlan.difficultyLevel || 'intermediate'
    } = options;
    
    // Crear el nuevo plan
    const newPlan = new TrainingPlan({
      id: uuidv4(),
      name,
      description,
      createdAt: new Date(),
      updatedAt: new Date(),
      duration,
      periodizationType,
      frequency,
      splitType,
      equipment,
      primaryGoal,
      secondaryGoal,
      difficultyLevel,
      microcycles: []
    });
    
    // Si no queremos mantener la estructura, creamos un plan básico
    if (!keepStructure) {
      return this.createBasicPlan(newPlan, sourcePlan);
    }
    
    // Copiar y ajustar los microciclos
    sourcePlan.microcycles.forEach((microcycle, index) => {
      // Limitar al número de microciclos según la duración deseada
      if (index >= duration) return;
      
      const newMicrocycle = new Microcycle({
        id: uuidv4(),
        name: microcycle.name,
        order: microcycle.order,
        type: microcycle.type,
        focus: microcycle.focus,
        trainingSessions: []
      });
      
      // Copiar y ajustar las sesiones de entrenamiento
      microcycle.trainingSessions.forEach(session => {
        const newSession = new TrainingSession({
          id: uuidv4(),
          name: session.name,
          description: session.description,
          type: session.type,
          day: session.day,
          duration: session.duration,
          exercises: []
        });
        
        // Copiar y ajustar los ejercicios
        if (keepExercises) {
          session.exercises.forEach(exercise => {
            const newExercise = new Exercise({
              id: uuidv4(),
              name: exercise.name,
              description: exercise.description,
              muscleGroup: exercise.muscleGroup,
              equipment: exercise.equipment,
              videoUrl: exercise.videoUrl,
              notes: exercise.notes,
              sets: []
            });
            
            // Copiar y ajustar las series
            exercise.sets.forEach(set => {
              let newWeight = set.weight;
              
              // Ajustar pesos si es necesario
              if (adjustWeights && !isNaN(parseFloat(set.weight))) {
                newWeight = (parseFloat(set.weight) * weightAdjustmentFactor).toFixed(1);
              }
              
              const newSet = new Set({
                id: uuidv4(),
                order: set.order,
                type: set.type,
                repsMin: set.repsMin,
                repsMax: set.repsMax,
                weight: newWeight,
                restTime: set.restTime,
                notes: set.notes
              });
              
              newExercise.sets.push(newSet);
            });
            
            newSession.exercises.push(newExercise);
          });
        }
        
        newMicrocycle.trainingSessions.push(newSession);
      });
      
      newPlan.microcycles.push(newMicrocycle);
    });
    
    return newPlan;
  }
  
  /**
   * Crea un plan básico basado en otro plan
   * @param {TrainingPlan} newPlan - Plan base con propiedades generales
   * @param {TrainingPlan} sourcePlan - Plan de origen para referencia
   * @returns {TrainingPlan} - Plan básico
   */
  createBasicPlan(newPlan, sourcePlan) {
    // Crear microciclos básicos
    for (let i = 0; i < newPlan.duration; i++) {
      const microcycle = new Microcycle({
        id: uuidv4(),
        name: `Semana ${i + 1}`,
        order: i + 1,
        type: 'normal',
        focus: newPlan.primaryGoal,
        trainingSessions: []
      });
      
      // Crear sesiones según la frecuencia
      for (let j = 0; j < newPlan.frequency; j++) {
        const session = new TrainingSession({
          id: uuidv4(),
          name: `Entrenamiento ${j + 1}`,
          description: `Sesión de entrenamiento ${j + 1} de la semana ${i + 1}`,
          type: this.getSessionType(newPlan.splitType, j),
          day: j + 1,
          duration: 60, // 60 minutos por defecto
          exercises: []
        });
        
        microcycle.trainingSessions.push(session);
      }
      
      newPlan.microcycles.push(microcycle);
    }
    
    return newPlan;
  }
  
  /**
   * Obtiene el tipo de sesión según el tipo de split
   * @param {string} splitType - Tipo de split
   * @param {number} sessionIndex - Índice de la sesión
   * @returns {string} - Tipo de sesión
   */
  getSessionType(splitType, sessionIndex) {
    switch (splitType) {
      case 'full_body':
        return 'full_body';
      case 'upper_lower':
        return sessionIndex % 2 === 0 ? 'upper_body' : 'lower_body';
      case 'push_pull_legs':
        if (sessionIndex % 3 === 0) return 'push';
        if (sessionIndex % 3 === 1) return 'pull';
        return 'legs';
      case 'body_part_split':
        if (sessionIndex % 5 === 0) return 'chest';
        if (sessionIndex % 5 === 1) return 'back';
        if (sessionIndex % 5 === 2) return 'legs';
        if (sessionIndex % 5 === 3) return 'shoulders';
        return 'arms';
      default:
        return 'full_body';
    }
  }
  
  /**
   * Analiza un plan y sugiere ajustes para la transición
   * @param {TrainingPlan} plan - Plan de entrenamiento a analizar
   * @param {Object} workoutLogs - Registros de entrenamientos
   * @returns {Object} - Sugerencias de ajustes
   */
  analyzePlanForTransition(plan, workoutLogs) {
    if (!plan || !workoutLogs || !workoutLogs.logs) {
      return null;
    }
    
    // Obtener todas las sesiones del plan
    const sessionIds = plan.microcycles.flatMap(
      microcycle => microcycle.trainingSessions.map(session => session.id)
    );
    
    // Filtrar los registros que pertenecen a este plan
    const planLogs = workoutLogs.logs.filter(
      log => sessionIds.includes(log.sessionId)
    );
    
    // Analizar el rendimiento por ejercicio
    const exercisePerformance = {};
    
    planLogs.forEach(log => {
      if (log.exercises) {
        log.exercises.forEach(exercise => {
          const exerciseName = exercise.name;
          
          // Inicializar datos del ejercicio si no existen
          if (!exercisePerformance[exerciseName]) {
            exercisePerformance[exerciseName] = {
              name: exerciseName,
              totalSets: 0,
              completedSets: 0,
              plannedVolume: 0,
              actualVolume: 0,
              successRate: 0,
              weightAdjustment: 1.0
            };
          }
          
          // Procesar series
          if (exercise.sets) {
            exercise.sets.forEach(set => {
              exercisePerformance[exerciseName].totalSets += 1;
              
              if (set.plannedReps && set.plannedWeight && set.actualReps && set.actualWeight) {
                const plannedReps = parseInt(set.plannedReps);
                const plannedWeight = parseFloat(set.plannedWeight);
                const actualReps = parseInt(set.actualReps);
                const actualWeight = parseFloat(set.actualWeight);
                
                if (!isNaN(plannedReps) && !isNaN(plannedWeight) && !isNaN(actualReps) && !isNaN(actualWeight)) {
                  const plannedVolume = plannedReps * plannedWeight;
                  const actualVolume = actualReps * actualWeight;
                  
                  exercisePerformance[exerciseName].plannedVolume += plannedVolume;
                  exercisePerformance[exerciseName].actualVolume += actualVolume;
                  
                  // Considerar completada si se alcanzó al menos el 90% del volumen planeado
                  if (actualVolume >= plannedVolume * 0.9) {
                    exercisePerformance[exerciseName].completedSets += 1;
                  }
                }
              }
            });
          }
        });
      }
    });
    
    // Calcular tasas de éxito y ajustes de peso
    Object.keys(exercisePerformance).forEach(key => {
      const performance = exercisePerformance[key];
      
      // Calcular tasa de éxito
      if (performance.totalSets > 0) {
        performance.successRate = (performance.completedSets / performance.totalSets) * 100;
      }
      
      // Sugerir ajuste de peso basado en la tasa de éxito
      if (performance.successRate >= 90) {
        // Incremento del 5-10% si la tasa de éxito es alta
        performance.weightAdjustment = 1.05 + (performance.successRate - 90) / 200; // 1.05 a 1.10
      } else if (performance.successRate >= 70) {
        // Incremento del 0-5% si la tasa de éxito es media
        performance.weightAdjustment = 1.0 + (performance.successRate - 70) / 400; // 1.00 a 1.05
      } else {
        // Reducción del 0-10% si la tasa de éxito es baja
        performance.weightAdjustment = 0.9 + (performance.successRate / 700); // 0.90 a 1.00
      }
      
      // Redondear a 2 decimales
      performance.weightAdjustment = Math.round(performance.weightAdjustment * 100) / 100;
    });
    
    // Calcular ajuste global de peso
    const globalSuccessRate = Object.values(exercisePerformance).reduce((sum, perf) => sum + perf.successRate, 0) / 
                             Object.keys(exercisePerformance).length;
    
    let globalWeightAdjustment = 1.0;
    
    if (globalSuccessRate >= 90) {
      globalWeightAdjustment = 1.05;
    } else if (globalSuccessRate >= 70) {
      globalWeightAdjustment = 1.025;
    } else if (globalSuccessRate < 50) {
      globalWeightAdjustment = 0.95;
    }
    
    return {
      exercisePerformance,
      globalSuccessRate,
      globalWeightAdjustment,
      suggestedPeriodizationType: this.suggestPeriodizationType(globalSuccessRate, plan),
      suggestedFrequency: this.suggestFrequency(globalSuccessRate, plan),
      suggestedDuration: this.suggestDuration(plan)
    };
  }
  
  /**
   * Sugiere un tipo de periodización basado en el rendimiento
   * @param {number} successRate - Tasa de éxito global
   * @param {TrainingPlan} plan - Plan actual
   * @returns {string} - Tipo de periodización sugerido
   */
  suggestPeriodizationType(successRate, plan) {
    const current = plan.periodizationType;
    
    if (successRate >= 90) {
      // Si el rendimiento es excelente, sugerir una periodización más avanzada
      if (current === 'linear') return 'undulating';
      if (current === 'undulating') return 'block';
      return current;
    } else if (successRate < 60) {
      // Si el rendimiento es bajo, sugerir una periodización más simple
      return 'linear';
    }
    
    // Mantener la periodización actual
    return current;
  }
  
  /**
   * Sugiere una frecuencia de entrenamiento basada en el rendimiento
   * @param {number} successRate - Tasa de éxito global
   * @param {TrainingPlan} plan - Plan actual
   * @returns {number} - Frecuencia sugerida
   */
  suggestFrequency(successRate, plan) {
    const current = plan.frequency || 3;
    
    if (successRate >= 90 && current < 5) {
      // Si el rendimiento es excelente, sugerir aumentar la frecuencia
      return current + 1;
    } else if (successRate < 60 && current > 2) {
      // Si el rendimiento es bajo, sugerir reducir la frecuencia
      return current - 1;
    }
    
    // Mantener la frecuencia actual
    return current;
  }
  
  /**
   * Sugiere una duración para el nuevo plan
   * @param {TrainingPlan} plan - Plan actual
   * @returns {number} - Duración sugerida
   */
  suggestDuration(plan) {
    const current = plan.duration || 4;
    
    // Sugerir una duración similar o ligeramente mayor
    return Math.min(12, current + 1);
  }
}

export default new PlanTransitionService();
