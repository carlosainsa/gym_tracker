import { v4 as uuidv4 } from 'uuid';
import { TrainingPlan, Microcycle, TrainingSession, Exercise, Set } from '../models/TrainingPlan';
import planService from './planService';
import statisticsService from './statisticsService';

/**
 * Servicio para gestionar la transición entre planes de entrenamiento
 */
class TransitionService {
  /**
   * Crea un plan de transición entre dos planes
   * @param {string} sourcePlanId - ID del plan de origen
   * @param {string} targetPlanId - ID del plan de destino
   * @param {Object} options - Opciones de transición
   * @returns {TrainingPlan} - Plan de transición creado
   */
  createTransitionPlan(sourcePlanId, targetPlanId, options = {}) {
    try {
      // Obtener los planes de origen y destino
      const sourcePlan = planService.getPlanById(sourcePlanId);
      const targetPlan = planService.getPlanById(targetPlanId);
      
      if (!sourcePlan || !targetPlan) {
        throw new Error('No se encontraron los planes de origen o destino');
      }
      
      const {
        name = `Transición: ${sourcePlan.name} → ${targetPlan.name}`,
        description = `Plan de transición entre "${sourcePlan.name}" y "${targetPlan.name}"`,
        duration = 2, // Duración en semanas
        intensity = 'moderate', // 'light', 'moderate', 'progressive'
        maintainExercises = true, // Mantener ejercicios comunes
        deloadWeek = true, // Incluir semana de descarga
      } = options;
      
      // Crear el plan de transición
      const transitionPlan = new TrainingPlan({
        id: uuidv4(),
        name,
        description,
        status: 'available',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        microcycles: []
      });
      
      // Analizar los planes para encontrar similitudes y diferencias
      const analysis = this.analyzePlans(sourcePlan, targetPlan);
      
      // Determinar la estructura del plan de transición
      const weekCount = duration;
      
      // Crear los microciclos
      for (let week = 1; week <= weekCount; week++) {
        const isDeloadWeek = deloadWeek && week === 1;
        const weekProgress = week / weekCount; // 0-1 progreso de la transición
        
        const microcycle = new Microcycle({
          id: uuidv4(),
          name: isDeloadWeek ? 'Microciclo de Descarga' : `Microciclo de Transición ${week}`,
          weekNumber: week,
          trainingSessions: []
        });
        
        // Determinar el número de sesiones para esta semana
        const sourceSessionCount = sourcePlan.microcycles[0]?.trainingSessions.length || 0;
        const targetSessionCount = targetPlan.microcycles[0]?.trainingSessions.length || 0;
        
        // Calcular el número de sesiones para esta semana de transición
        let sessionCount;
        if (isDeloadWeek) {
          // En semana de descarga, usar menos sesiones
          sessionCount = Math.min(sourceSessionCount, 3);
        } else if (week === weekCount) {
          // En la última semana, usar el número de sesiones del plan destino
          sessionCount = targetSessionCount;
        } else {
          // En semanas intermedias, hacer una transición gradual
          sessionCount = Math.round(sourceSessionCount + (targetSessionCount - sourceSessionCount) * weekProgress);
        }
        
        // Crear las sesiones de entrenamiento
        for (let day = 1; day <= sessionCount; day++) {
          const session = this.createTransitionSession(
            sourcePlan, 
            targetPlan, 
            analysis, 
            {
              day,
              weekProgress,
              isDeloadWeek,
              intensity,
              maintainExercises
            }
          );
          
          microcycle.trainingSessions.push(session);
        }
        
        transitionPlan.microcycles.push(microcycle);
      }
      
      // Guardar el plan de transición
      planService.savePlan(transitionPlan);
      
      return transitionPlan;
    } catch (error) {
      console.error('Error al crear plan de transición:', error);
      throw new Error(`No se pudo crear el plan de transición: ${error.message}`);
    }
  }
  
  /**
   * Analiza dos planes para encontrar similitudes y diferencias
   * @param {TrainingPlan} sourcePlan - Plan de origen
   * @param {TrainingPlan} targetPlan - Plan de destino
   * @returns {Object} - Análisis de los planes
   */
  analyzePlans(sourcePlan, targetPlan) {
    try {
      // Extraer todos los ejercicios de ambos planes
      const sourceExercises = this.extractExercisesFromPlan(sourcePlan);
      const targetExercises = this.extractExercisesFromPlan(targetPlan);
      
      // Encontrar ejercicios comunes
      const commonExercises = sourceExercises.filter(sourceEx => 
        targetExercises.some(targetEx => targetEx.name.toLowerCase() === sourceEx.name.toLowerCase())
      );
      
      // Encontrar ejercicios únicos en cada plan
      const uniqueSourceExercises = sourceExercises.filter(sourceEx => 
        !targetExercises.some(targetEx => targetEx.name.toLowerCase() === sourceEx.name.toLowerCase())
      );
      
      const uniqueTargetExercises = targetExercises.filter(targetEx => 
        !sourceExercises.some(sourceEx => sourceEx.name.toLowerCase() === targetEx.name.toLowerCase())
      );
      
      // Analizar volumen e intensidad
      const sourceStats = statisticsService.calculatePlanStats(sourcePlan);
      const targetStats = statisticsService.calculatePlanStats(targetPlan);
      
      return {
        commonExercises,
        uniqueSourceExercises,
        uniqueTargetExercises,
        sourceStats,
        targetStats,
        sourceSessionsPerWeek: sourcePlan.microcycles[0]?.trainingSessions.length || 0,
        targetSessionsPerWeek: targetPlan.microcycles[0]?.trainingSessions.length || 0
      };
    } catch (error) {
      console.error('Error al analizar planes:', error);
      throw new Error(`No se pudo analizar los planes: ${error.message}`);
    }
  }
  
  /**
   * Extrae todos los ejercicios de un plan
   * @param {TrainingPlan} plan - Plan de entrenamiento
   * @returns {Array} - Lista de ejercicios
   */
  extractExercisesFromPlan(plan) {
    const exercises = [];
    
    plan.microcycles.forEach(microcycle => {
      microcycle.trainingSessions.forEach(session => {
        session.exercises.forEach(exercise => {
          // Verificar si ya existe este ejercicio
          const existingExercise = exercises.find(ex => ex.name.toLowerCase() === exercise.name.toLowerCase());
          
          if (!existingExercise) {
            exercises.push({
              name: exercise.name,
              sets: exercise.sets.length,
              avgReps: this.calculateAverageReps(exercise.sets),
              avgWeight: this.calculateAverageWeight(exercise.sets)
            });
          }
        });
      });
    });
    
    return exercises;
  }
  
  /**
   * Calcula el promedio de repeticiones de un conjunto de series
   * @param {Array} sets - Conjunto de series
   * @returns {number} - Promedio de repeticiones
   */
  calculateAverageReps(sets) {
    if (!sets || sets.length === 0) return 0;
    
    const total = sets.reduce((sum, set) => {
      // Si hay un rango de repeticiones, usar el promedio
      if (set.repsMin !== undefined && set.repsMax !== undefined) {
        return sum + ((set.repsMin + set.repsMax) / 2);
      }
      // Si solo hay un valor de repeticiones
      return sum + (set.reps || 0);
    }, 0);
    
    return total / sets.length;
  }
  
  /**
   * Calcula el promedio de peso de un conjunto de series
   * @param {Array} sets - Conjunto de series
   * @returns {number} - Promedio de peso
   */
  calculateAverageWeight(sets) {
    if (!sets || sets.length === 0) return 0;
    
    const setsWithWeight = sets.filter(set => set.weight !== undefined && set.weight !== null);
    if (setsWithWeight.length === 0) return 0;
    
    const total = setsWithWeight.reduce((sum, set) => sum + (set.weight || 0), 0);
    return total / setsWithWeight.length;
  }
  
  /**
   * Crea una sesión de transición
   * @param {TrainingPlan} sourcePlan - Plan de origen
   * @param {TrainingPlan} targetPlan - Plan de destino
   * @param {Object} analysis - Análisis de los planes
   * @param {Object} options - Opciones de la sesión
   * @returns {TrainingSession} - Sesión de transición
   */
  createTransitionSession(sourcePlan, targetPlan, analysis, options) {
    const {
      day,
      weekProgress,
      isDeloadWeek,
      intensity,
      maintainExercises
    } = options;
    
    // Determinar qué sesiones usar como referencia
    const sourceSession = this.findSessionForDay(sourcePlan, day);
    const targetSession = this.findSessionForDay(targetPlan, day);
    
    // Crear la nueva sesión
    const session = new TrainingSession({
      id: uuidv4(),
      name: `Sesión de Transición ${day}`,
      day,
      exercises: []
    });
    
    // Si es una semana de descarga, reducir volumen e intensidad
    if (isDeloadWeek) {
      if (sourceSession) {
        session.name = `Sesión de Descarga ${day}`;
        
        // Usar ejercicios del plan de origen pero con menos volumen e intensidad
        sourceSession.exercises.forEach(exercise => {
          const newExercise = new Exercise({
            id: uuidv4(),
            name: exercise.name,
            sets: []
          });
          
          // Reducir el número de series para la descarga
          const setCount = Math.max(2, Math.floor(exercise.sets.length * 0.7));
          
          for (let i = 0; i < setCount; i++) {
            const originalSet = exercise.sets[i];
            if (!originalSet) continue;
            
            // Reducir la intensidad para la descarga
            const deloadWeight = originalSet.weight ? originalSet.weight * 0.7 : null;
            
            // Crear la nueva serie
            const newSet = new Set({
              id: uuidv4(),
              repsMin: originalSet.repsMin,
              repsMax: originalSet.repsMax,
              reps: originalSet.reps,
              weight: deloadWeight,
              restTime: originalSet.restTime,
              notes: 'Semana de descarga - intensidad reducida'
            });
            
            newExercise.sets.push(newSet);
          }
          
          session.exercises.push(newExercise);
        });
      }
    } else {
      // Para sesiones regulares de transición
      const exercisesToInclude = [];
      
      // Determinar qué ejercicios incluir basado en el progreso de la semana
      if (sourceSession && targetSession) {
        // Incluir ejercicios comunes si se especifica
        if (maintainExercises) {
          // Encontrar ejercicios comunes entre las dos sesiones
          const commonSessionExercises = sourceSession.exercises.filter(sourceEx => 
            targetSession.exercises.some(targetEx => 
              targetEx.name.toLowerCase() === sourceEx.name.toLowerCase()
            )
          );
          
          // Agregar ejercicios comunes
          commonSessionExercises.forEach(exercise => {
            exercisesToInclude.push({
              name: exercise.name,
              source: 'common'
            });
          });
        }
        
        // Determinar cuántos ejercicios únicos incluir de cada plan
        const remainingSlots = Math.max(5, Math.max(sourceSession.exercises.length, targetSession.exercises.length)) - exercisesToInclude.length;
        
        if (remainingSlots > 0) {
          // Encontrar ejercicios únicos en cada sesión
          const uniqueSourceExercises = sourceSession.exercises.filter(sourceEx => 
            !targetSession.exercises.some(targetEx => 
              targetEx.name.toLowerCase() === sourceEx.name.toLowerCase()
            )
          );
          
          const uniqueTargetExercises = targetSession.exercises.filter(targetEx => 
            !sourceSession.exercises.some(sourceEx => 
              sourceEx.name.toLowerCase() === targetEx.name.toLowerCase()
            )
          );
          
          // Calcular cuántos ejercicios tomar de cada plan basado en el progreso
          const sourceExerciseCount = Math.round(remainingSlots * (1 - weekProgress));
          const targetExerciseCount = remainingSlots - sourceExerciseCount;
          
          // Agregar ejercicios únicos del plan de origen
          uniqueSourceExercises.slice(0, sourceExerciseCount).forEach(exercise => {
            exercisesToInclude.push({
              name: exercise.name,
              source: 'source'
            });
          });
          
          // Agregar ejercicios únicos del plan de destino
          uniqueTargetExercises.slice(0, targetExerciseCount).forEach(exercise => {
            exercisesToInclude.push({
              name: exercise.name,
              source: 'target'
            });
          });
        }
      } else if (sourceSession) {
        // Si solo hay sesión de origen, usar esos ejercicios
        sourceSession.exercises.forEach(exercise => {
          exercisesToInclude.push({
            name: exercise.name,
            source: 'source'
          });
        });
      } else if (targetSession) {
        // Si solo hay sesión de destino, usar esos ejercicios
        targetSession.exercises.forEach(exercise => {
          exercisesToInclude.push({
            name: exercise.name,
            source: 'target'
          });
        });
      }
      
      // Crear los ejercicios para la sesión de transición
      exercisesToInclude.forEach(exerciseInfo => {
        let sourceExercise, targetExercise;
        
        // Buscar el ejercicio en ambos planes
        if (sourceSession) {
          sourceExercise = sourceSession.exercises.find(ex => 
            ex.name.toLowerCase() === exerciseInfo.name.toLowerCase()
          );
        }
        
        if (targetSession) {
          targetExercise = targetSession.exercises.find(ex => 
            ex.name.toLowerCase() === exerciseInfo.name.toLowerCase()
          );
        }
        
        // Crear el nuevo ejercicio
        const newExercise = new Exercise({
          id: uuidv4(),
          name: exerciseInfo.name,
          sets: []
        });
        
        // Determinar las series basado en la fuente del ejercicio
        if (exerciseInfo.source === 'common' && sourceExercise && targetExercise) {
          // Para ejercicios comunes, hacer una transición gradual
          this.createTransitionSets(newExercise, sourceExercise, targetExercise, weekProgress, intensity);
        } else if (exerciseInfo.source === 'source' && sourceExercise) {
          // Para ejercicios únicos del plan de origen, ajustar gradualmente hacia abajo
          this.createSourceSets(newExercise, sourceExercise, weekProgress, intensity);
        } else if (exerciseInfo.source === 'target' && targetExercise) {
          // Para ejercicios únicos del plan de destino, ajustar gradualmente hacia arriba
          this.createTargetSets(newExercise, targetExercise, weekProgress, intensity);
        }
        
        // Agregar el ejercicio a la sesión si tiene series
        if (newExercise.sets.length > 0) {
          session.exercises.push(newExercise);
        }
      });
    }
    
    return session;
  }
  
  /**
   * Encuentra una sesión para un día específico
   * @param {TrainingPlan} plan - Plan de entrenamiento
   * @param {number} day - Día de la semana
   * @returns {TrainingSession|null} - Sesión encontrada o null
   */
  findSessionForDay(plan, day) {
    if (!plan || !plan.microcycles || plan.microcycles.length === 0) {
      return null;
    }
    
    // Usar el primer microciclo como referencia
    const microcycle = plan.microcycles[0];
    
    // Buscar la sesión para el día especificado
    return microcycle.trainingSessions.find(session => session.day === day) || null;
  }
  
  /**
   * Crea series de transición para un ejercicio común
   * @param {Exercise} newExercise - Nuevo ejercicio
   * @param {Exercise} sourceExercise - Ejercicio de origen
   * @param {Exercise} targetExercise - Ejercicio de destino
   * @param {number} progress - Progreso de la transición (0-1)
   * @param {string} intensity - Intensidad de la transición
   */
  createTransitionSets(newExercise, sourceExercise, targetExercise, progress, intensity) {
    // Determinar el número de series
    const sourceSetCount = sourceExercise.sets.length;
    const targetSetCount = targetExercise.sets.length;
    const setCount = Math.round(sourceSetCount + (targetSetCount - sourceSetCount) * progress);
    
    for (let i = 0; i < setCount; i++) {
      const sourceSet = i < sourceExercise.sets.length ? sourceExercise.sets[i] : null;
      const targetSet = i < targetExercise.sets.length ? targetExercise.sets[i] : null;
      
      // Si no hay series de referencia, saltar
      if (!sourceSet && !targetSet) continue;
      
      // Crear la nueva serie
      const newSet = new Set({
        id: uuidv4(),
        notes: 'Serie de transición'
      });
      
      // Calcular repeticiones
      if (sourceSet && targetSet) {
        // Transición gradual entre los dos valores
        if (sourceSet.repsMin !== undefined && targetSet.repsMin !== undefined) {
          newSet.repsMin = Math.round(sourceSet.repsMin + (targetSet.repsMin - sourceSet.repsMin) * progress);
        }
        
        if (sourceSet.repsMax !== undefined && targetSet.repsMax !== undefined) {
          newSet.repsMax = Math.round(sourceSet.repsMax + (targetSet.repsMax - sourceSet.repsMax) * progress);
        }
        
        if (sourceSet.reps !== undefined && targetSet.reps !== undefined) {
          newSet.reps = Math.round(sourceSet.reps + (targetSet.reps - sourceSet.reps) * progress);
        }
        
        // Calcular peso
        if (sourceSet.weight !== undefined && targetSet.weight !== undefined) {
          let weightProgress = progress;
          
          // Ajustar la progresión de peso según la intensidad
          if (intensity === 'light') {
            weightProgress = progress * 0.8;
          } else if (intensity === 'progressive') {
            weightProgress = Math.pow(progress, 0.7); // Progresión más lenta al principio
          }
          
          newSet.weight = sourceSet.weight + (targetSet.weight - sourceSet.weight) * weightProgress;
          // Redondear a 1 decimal
          newSet.weight = Math.round(newSet.weight * 10) / 10;
        }
        
        // Tiempo de descanso
        if (sourceSet.restTime !== undefined && targetSet.restTime !== undefined) {
          newSet.restTime = Math.round(sourceSet.restTime + (targetSet.restTime - sourceSet.restTime) * progress);
        }
      } else if (sourceSet) {
        // Usar valores del origen
        newSet.repsMin = sourceSet.repsMin;
        newSet.repsMax = sourceSet.repsMax;
        newSet.reps = sourceSet.reps;
        newSet.weight = sourceSet.weight;
        newSet.restTime = sourceSet.restTime;
      } else if (targetSet) {
        // Usar valores del destino
        newSet.repsMin = targetSet.repsMin;
        newSet.repsMax = targetSet.repsMax;
        newSet.reps = targetSet.reps;
        newSet.weight = targetSet.weight;
        newSet.restTime = targetSet.restTime;
      }
      
      newExercise.sets.push(newSet);
    }
  }
  
  /**
   * Crea series para un ejercicio único del plan de origen
   * @param {Exercise} newExercise - Nuevo ejercicio
   * @param {Exercise} sourceExercise - Ejercicio de origen
   * @param {number} progress - Progreso de la transición (0-1)
   * @param {string} intensity - Intensidad de la transición
   */
  createSourceSets(newExercise, sourceExercise, progress, intensity) {
    // Reducir gradualmente el número de series
    const setCount = Math.round(sourceExercise.sets.length * (1 - progress * 0.5));
    
    for (let i = 0; i < setCount; i++) {
      const sourceSet = sourceExercise.sets[i];
      if (!sourceSet) continue;
      
      // Crear la nueva serie
      const newSet = new Set({
        id: uuidv4(),
        repsMin: sourceSet.repsMin,
        repsMax: sourceSet.repsMax,
        reps: sourceSet.reps,
        restTime: sourceSet.restTime,
        notes: 'Ejercicio en transición hacia fuera'
      });
      
      // Ajustar el peso gradualmente
      if (sourceSet.weight !== undefined) {
        let weightFactor;
        
        if (intensity === 'light') {
          weightFactor = 1 - progress * 0.3; // Reducción más suave
        } else if (intensity === 'moderate') {
          weightFactor = 1 - progress * 0.2; // Reducción moderada
        } else {
          weightFactor = 1 - progress * 0.1; // Reducción más lenta
        }
        
        newSet.weight = sourceSet.weight * weightFactor;
        // Redondear a 1 decimal
        newSet.weight = Math.round(newSet.weight * 10) / 10;
      }
      
      newExercise.sets.push(newSet);
    }
  }
  
  /**
   * Crea series para un ejercicio único del plan de destino
   * @param {Exercise} newExercise - Nuevo ejercicio
   * @param {Exercise} targetExercise - Ejercicio de destino
   * @param {number} progress - Progreso de la transición (0-1)
   * @param {string} intensity - Intensidad de la transición
   */
  createTargetSets(newExercise, targetExercise, progress, intensity) {
    // Aumentar gradualmente el número de series
    const setCount = Math.round(targetExercise.sets.length * (0.5 + progress * 0.5));
    
    for (let i = 0; i < setCount; i++) {
      const targetSet = targetExercise.sets[i];
      if (!targetSet) continue;
      
      // Crear la nueva serie
      const newSet = new Set({
        id: uuidv4(),
        repsMin: targetSet.repsMin,
        repsMax: targetSet.repsMax,
        reps: targetSet.reps,
        restTime: targetSet.restTime,
        notes: 'Ejercicio en transición hacia dentro'
      });
      
      // Ajustar el peso gradualmente
      if (targetSet.weight !== undefined) {
        let weightFactor;
        
        if (intensity === 'light') {
          weightFactor = 0.7 + progress * 0.3; // Aumento más suave
        } else if (intensity === 'moderate') {
          weightFactor = 0.8 + progress * 0.2; // Aumento moderado
        } else {
          weightFactor = 0.9 + progress * 0.1; // Aumento más rápido
        }
        
        newSet.weight = targetSet.weight * weightFactor;
        // Redondear a 1 decimal
        newSet.weight = Math.round(newSet.weight * 10) / 10;
      }
      
      newExercise.sets.push(newSet);
    }
  }
  
  /**
   * Obtiene recomendaciones para la transición entre dos planes
   * @param {string} sourcePlanId - ID del plan de origen
   * @param {string} targetPlanId - ID del plan de destino
   * @returns {Object} - Recomendaciones para la transición
   */
  getTransitionRecommendations(sourcePlanId, targetPlanId) {
    try {
      // Obtener los planes
      const sourcePlan = planService.getPlanById(sourcePlanId);
      const targetPlan = planService.getPlanById(targetPlanId);
      
      if (!sourcePlan || !targetPlan) {
        throw new Error('No se encontraron los planes de origen o destino');
      }
      
      // Analizar los planes
      const analysis = this.analyzePlans(sourcePlan, targetPlan);
      
      // Determinar la duración recomendada
      let recommendedDuration = 2; // Valor por defecto
      
      // Si hay una gran diferencia en volumen o intensidad, recomendar más tiempo
      const volumeDifference = Math.abs(analysis.targetStats.totalVolume - analysis.sourceStats.totalVolume) / analysis.sourceStats.totalVolume;
      const intensityDifference = Math.abs(analysis.targetStats.avgIntensity - analysis.sourceStats.avgIntensity) / analysis.sourceStats.avgIntensity;
      
      if (volumeDifference > 0.3 || intensityDifference > 0.2) {
        recommendedDuration = 3;
      }
      
      // Si hay una diferencia significativa en la frecuencia semanal, recomendar más tiempo
      const frequencyDifference = Math.abs(analysis.targetSessionsPerWeek - analysis.sourceSessionsPerWeek);
      if (frequencyDifference >= 2) {
        recommendedDuration = Math.max(recommendedDuration, 3);
      }
      
      // Determinar si se recomienda una semana de descarga
      const recommendDeload = volumeDifference > 0.2 || intensityDifference > 0.15;
      
      // Determinar la intensidad recomendada
      let recommendedIntensity = 'moderate';
      if (intensityDifference > 0.25) {
        recommendedIntensity = 'light';
      } else if (intensityDifference < 0.1) {
        recommendedIntensity = 'progressive';
      }
      
      return {
        recommendedDuration,
        recommendDeload,
        recommendedIntensity,
        analysis: {
          commonExercisesCount: analysis.commonExercises.length,
          uniqueSourceExercisesCount: analysis.uniqueSourceExercises.length,
          uniqueTargetExercisesCount: analysis.uniqueTargetExercises.length,
          volumeDifference: volumeDifference * 100, // Convertir a porcentaje
          intensityDifference: intensityDifference * 100, // Convertir a porcentaje
          frequencyDifference
        }
      };
    } catch (error) {
      console.error('Error al obtener recomendaciones de transición:', error);
      throw new Error(`No se pudieron obtener las recomendaciones: ${error.message}`);
    }
  }
}

export default new TransitionService();
