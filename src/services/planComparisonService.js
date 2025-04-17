import { v4 as uuidv4 } from 'uuid';
import planService from './planService';
import statisticsService from './statisticsService';
import analyticsService from './analyticsService';

/**
 * Servicio para comparar planes de entrenamiento
 */
class PlanComparisonService {
  /**
   * Compara dos planes de entrenamiento
   * @param {string} planAId - ID del primer plan
   * @param {string} planBId - ID del segundo plan
   * @param {Object} options - Opciones de comparación
   * @returns {Object} - Resultado de la comparación
   */
  comparePlans(planAId, planBId, options = {}) {
    try {
      const {
        includeStructure = true,
        includeExercises = true,
        includeVolume = true,
        includeIntensity = true,
        includeProgression = true
      } = options;
      
      // Obtener los planes
      const planA = planService.getPlanById(planAId);
      const planB = planService.getPlanById(planBId);
      
      if (!planA || !planB) {
        throw new Error('Uno o ambos planes no existen');
      }
      
      // Crear el objeto de comparación
      const comparison = {
        id: uuidv4(),
        createdAt: new Date().toISOString(),
        planA: {
          id: planA.id,
          name: planA.name,
          status: planA.status,
          primaryGoal: planA.primaryGoal,
          periodizationType: planA.periodizationType,
          duration: planA.microcycles?.length || 0
        },
        planB: {
          id: planB.id,
          name: planB.name,
          status: planB.status,
          primaryGoal: planB.primaryGoal,
          periodizationType: planB.periodizationType,
          duration: planB.microcycles?.length || 0
        },
        summary: this.generateSummary(planA, planB)
      };
      
      // Añadir comparaciones adicionales según las opciones
      if (includeStructure) {
        comparison.structure = this.compareStructure(planA, planB);
      }
      
      if (includeExercises) {
        comparison.exercises = this.compareExercises(planA, planB);
      }
      
      if (includeVolume) {
        comparison.volume = this.compareVolume(planA, planB);
      }
      
      if (includeIntensity) {
        comparison.intensity = this.compareIntensity(planA, planB);
      }
      
      if (includeProgression) {
        comparison.progression = this.compareProgression(planA, planB);
      }
      
      return comparison;
    } catch (error) {
      console.error('Error al comparar planes:', error);
      throw new Error(`No se pudieron comparar los planes: ${error.message}`);
    }
  }
  
  /**
   * Genera un resumen de la comparación
   * @param {Object} planA - Primer plan
   * @param {Object} planB - Segundo plan
   * @returns {Object} - Resumen de la comparación
   */
  generateSummary(planA, planB) {
    // Calcular estadísticas básicas
    const statsA = statisticsService.calculatePlanStats(planA);
    const statsB = statisticsService.calculatePlanStats(planB);
    
    // Calcular análisis avanzado
    const analysisA = analyticsService.analyzePlan(planA);
    const analysisB = analyticsService.analyzePlan(planB);
    
    // Calcular diferencias porcentuales
    const durationDiff = this.calculatePercentDifference(
      planA.microcycles?.length || 0,
      planB.microcycles?.length || 0
    );
    
    const volumeDiff = this.calculatePercentDifference(
      statsA.totalVolume || 0,
      statsB.totalVolume || 0
    );
    
    const intensityDiff = this.calculatePercentDifference(
      statsA.avgIntensity || 0,
      statsB.avgIntensity || 0
    );
    
    const frequencyDiff = this.calculatePercentDifference(
      this.calculateSessionsPerWeek(planA),
      this.calculateSessionsPerWeek(planB)
    );
    
    // Crear resumen
    return {
      durationComparison: {
        planA: planA.microcycles?.length || 0,
        planB: planB.microcycles?.length || 0,
        difference: (planB.microcycles?.length || 0) - (planA.microcycles?.length || 0),
        percentDifference: durationDiff
      },
      volumeComparison: {
        planA: statsA.totalVolume || 0,
        planB: statsB.totalVolume || 0,
        difference: (statsB.totalVolume || 0) - (statsA.totalVolume || 0),
        percentDifference: volumeDiff
      },
      intensityComparison: {
        planA: statsA.avgIntensity || 0,
        planB: statsB.avgIntensity || 0,
        difference: (statsB.avgIntensity || 0) - (statsA.avgIntensity || 0),
        percentDifference: intensityDiff
      },
      frequencyComparison: {
        planA: this.calculateSessionsPerWeek(planA),
        planB: this.calculateSessionsPerWeek(planB),
        difference: this.calculateSessionsPerWeek(planB) - this.calculateSessionsPerWeek(planA),
        percentDifference: frequencyDiff
      },
      similarityScore: this.calculateSimilarityScore(planA, planB, statsA, statsB, analysisA, analysisB)
    };
  }
  
  /**
   * Calcula la diferencia porcentual entre dos valores
   * @param {number} valueA - Primer valor
   * @param {number} valueB - Segundo valor
   * @returns {number} - Diferencia porcentual
   */
  calculatePercentDifference(valueA, valueB) {
    if (valueA === 0) return valueB === 0 ? 0 : 100;
    return ((valueB - valueA) / Math.abs(valueA)) * 100;
  }
  
  /**
   * Calcula el número promedio de sesiones por semana
   * @param {Object} plan - Plan de entrenamiento
   * @returns {number} - Sesiones por semana
   */
  calculateSessionsPerWeek(plan) {
    if (!plan.microcycles || plan.microcycles.length === 0) {
      return 0;
    }
    
    const totalSessions = plan.microcycles.reduce(
      (total, microcycle) => total + (microcycle.trainingSessions?.length || 0),
      0
    );
    
    return totalSessions / plan.microcycles.length;
  }
  
  /**
   * Calcula un puntaje de similitud entre dos planes
   * @param {Object} planA - Primer plan
   * @param {Object} planB - Segundo plan
   * @param {Object} statsA - Estadísticas del primer plan
   * @param {Object} statsB - Estadísticas del segundo plan
   * @param {Object} analysisA - Análisis del primer plan
   * @param {Object} analysisB - Análisis del segundo plan
   * @returns {number} - Puntaje de similitud (0-100)
   */
  calculateSimilarityScore(planA, planB, statsA, statsB, analysisA, analysisB) {
    let score = 0;
    let factors = 0;
    
    // Similitud de objetivo
    if (planA.primaryGoal === planB.primaryGoal) {
      score += 20;
    } else {
      // Objetivos relacionados
      const relatedGoals = {
        hypertrophy: ['strength'],
        strength: ['hypertrophy', 'power'],
        power: ['strength'],
        endurance: ['fat_loss'],
        fat_loss: ['endurance']
      };
      
      if (relatedGoals[planA.primaryGoal]?.includes(planB.primaryGoal)) {
        score += 10;
      }
    }
    factors++;
    
    // Similitud de periodización
    if (planA.periodizationType === planB.periodizationType) {
      score += 15;
    }
    factors++;
    
    // Similitud de duración
    const durationDiff = Math.abs(
      (planA.microcycles?.length || 0) - (planB.microcycles?.length || 0)
    );
    if (durationDiff === 0) {
      score += 15;
    } else if (durationDiff <= 2) {
      score += 10;
    } else if (durationDiff <= 4) {
      score += 5;
    }
    factors++;
    
    // Similitud de volumen
    const volumeDiff = Math.abs(
      this.calculatePercentDifference(statsA.totalVolume || 0, statsB.totalVolume || 0)
    );
    if (volumeDiff <= 10) {
      score += 15;
    } else if (volumeDiff <= 25) {
      score += 10;
    } else if (volumeDiff <= 50) {
      score += 5;
    }
    factors++;
    
    // Similitud de intensidad
    const intensityDiff = Math.abs(
      this.calculatePercentDifference(statsA.avgIntensity || 0, statsB.avgIntensity || 0)
    );
    if (intensityDiff <= 10) {
      score += 15;
    } else if (intensityDiff <= 25) {
      score += 10;
    } else if (intensityDiff <= 50) {
      score += 5;
    }
    factors++;
    
    // Similitud de ejercicios
    const exercisesA = this.getAllExerciseNames(planA);
    const exercisesB = this.getAllExerciseNames(planB);
    const commonExercises = exercisesA.filter(ex => exercisesB.includes(ex));
    
    const exerciseSimilarity = exercisesA.length > 0 
      ? (commonExercises.length / Math.max(exercisesA.length, exercisesB.length)) * 100
      : 0;
      
    if (exerciseSimilarity >= 80) {
      score += 20;
    } else if (exerciseSimilarity >= 60) {
      score += 15;
    } else if (exerciseSimilarity >= 40) {
      score += 10;
    } else if (exerciseSimilarity >= 20) {
      score += 5;
    }
    factors++;
    
    // Normalizar el puntaje a una escala de 0-100
    return Math.round((score / (factors * 20)) * 100);
  }
  
  /**
   * Obtiene todos los nombres de ejercicios de un plan
   * @param {Object} plan - Plan de entrenamiento
   * @returns {Array} - Lista de nombres de ejercicios
   */
  getAllExerciseNames(plan) {
    if (!plan.microcycles) return [];
    
    const exercises = new Set();
    
    plan.microcycles.forEach(microcycle => {
      if (microcycle.trainingSessions) {
        microcycle.trainingSessions.forEach(session => {
          if (session.exercises) {
            session.exercises.forEach(exercise => {
              exercises.add(exercise.name);
            });
          }
        });
      }
    });
    
    return Array.from(exercises);
  }
  
  /**
   * Compara la estructura de dos planes
   * @param {Object} planA - Primer plan
   * @param {Object} planB - Segundo plan
   * @returns {Object} - Comparación de estructura
   */
  compareStructure(planA, planB) {
    const microcyclesA = planA.microcycles?.length || 0;
    const microcyclesB = planB.microcycles?.length || 0;
    
    const sessionsA = planA.microcycles?.reduce(
      (total, microcycle) => total + (microcycle.trainingSessions?.length || 0),
      0
    ) || 0;
    
    const sessionsB = planB.microcycles?.reduce(
      (total, microcycle) => total + (microcycle.trainingSessions?.length || 0),
      0
    ) || 0;
    
    const exercisesA = this.getAllExerciseNames(planA).length;
    const exercisesB = this.getAllExerciseNames(planB).length;
    
    return {
      microcycles: {
        planA: microcyclesA,
        planB: microcyclesB,
        difference: microcyclesB - microcyclesA,
        percentDifference: this.calculatePercentDifference(microcyclesA, microcyclesB)
      },
      sessions: {
        planA: sessionsA,
        planB: sessionsB,
        difference: sessionsB - sessionsA,
        percentDifference: this.calculatePercentDifference(sessionsA, sessionsB)
      },
      sessionsPerWeek: {
        planA: microcyclesA > 0 ? sessionsA / microcyclesA : 0,
        planB: microcyclesB > 0 ? sessionsB / microcyclesB : 0,
        difference: (microcyclesB > 0 ? sessionsB / microcyclesB : 0) - (microcyclesA > 0 ? sessionsA / microcyclesA : 0),
        percentDifference: this.calculatePercentDifference(
          microcyclesA > 0 ? sessionsA / microcyclesA : 0,
          microcyclesB > 0 ? sessionsB / microcyclesB : 0
        )
      },
      uniqueExercises: {
        planA: exercisesA,
        planB: exercisesB,
        difference: exercisesB - exercisesA,
        percentDifference: this.calculatePercentDifference(exercisesA, exercisesB)
      }
    };
  }
  
  /**
   * Compara los ejercicios de dos planes
   * @param {Object} planA - Primer plan
   * @param {Object} planB - Segundo plan
   * @returns {Object} - Comparación de ejercicios
   */
  compareExercises(planA, planB) {
    const exercisesA = this.getAllExerciseNames(planA);
    const exercisesB = this.getAllExerciseNames(planB);
    
    const commonExercises = exercisesA.filter(ex => exercisesB.includes(ex));
    const uniqueToA = exercisesA.filter(ex => !exercisesB.includes(ex));
    const uniqueToB = exercisesB.filter(ex => !exercisesA.includes(ex));
    
    // Calcular frecuencia de ejercicios
    const frequencyA = this.calculateExerciseFrequency(planA);
    const frequencyB = this.calculateExerciseFrequency(planB);
    
    // Comparar frecuencia de ejercicios comunes
    const commonExerciseComparison = commonExercises.map(exercise => {
      const freqA = frequencyA[exercise] || 0;
      const freqB = frequencyB[exercise] || 0;
      
      return {
        name: exercise,
        frequencyA: freqA,
        frequencyB: freqB,
        difference: freqB - freqA,
        percentDifference: this.calculatePercentDifference(freqA, freqB)
      };
    });
    
    return {
      common: {
        exercises: commonExercises,
        count: commonExercises.length,
        percentage: exercisesA.length > 0 
          ? (commonExercises.length / Math.max(exercisesA.length, exercisesB.length)) * 100
          : 0
      },
      uniqueToA: {
        exercises: uniqueToA,
        count: uniqueToA.length,
        percentage: exercisesA.length > 0 ? (uniqueToA.length / exercisesA.length) * 100 : 0
      },
      uniqueToB: {
        exercises: uniqueToB,
        count: uniqueToB.length,
        percentage: exercisesB.length > 0 ? (uniqueToB.length / exercisesB.length) * 100 : 0
      },
      exerciseFrequencyComparison: commonExerciseComparison
    };
  }
  
  /**
   * Calcula la frecuencia de cada ejercicio en un plan
   * @param {Object} plan - Plan de entrenamiento
   * @returns {Object} - Mapa de frecuencia de ejercicios
   */
  calculateExerciseFrequency(plan) {
    const frequency = {};
    
    if (!plan.microcycles) return frequency;
    
    plan.microcycles.forEach(microcycle => {
      if (microcycle.trainingSessions) {
        microcycle.trainingSessions.forEach(session => {
          if (session.exercises) {
            session.exercises.forEach(exercise => {
              frequency[exercise.name] = (frequency[exercise.name] || 0) + 1;
            });
          }
        });
      }
    });
    
    return frequency;
  }
  
  /**
   * Compara el volumen de dos planes
   * @param {Object} planA - Primer plan
   * @param {Object} planB - Segundo plan
   * @returns {Object} - Comparación de volumen
   */
  compareVolume(planA, planB) {
    // Calcular estadísticas
    const statsA = statisticsService.calculatePlanStats(planA);
    const statsB = statisticsService.calculatePlanStats(planB);
    
    // Comparar volumen total
    const totalVolumeA = statsA.totalVolume || 0;
    const totalVolumeB = statsB.totalVolume || 0;
    
    // Comparar volumen por grupo muscular
    const muscleGroupsA = statsA.volumeByMuscleGroup || {};
    const muscleGroupsB = statsB.volumeByMuscleGroup || {};
    
    // Obtener todos los grupos musculares
    const allMuscleGroups = [...new Set([
      ...Object.keys(muscleGroupsA),
      ...Object.keys(muscleGroupsB)
    ])];
    
    // Comparar volumen por grupo muscular
    const muscleGroupComparison = allMuscleGroups.map(group => {
      const volumeA = muscleGroupsA[group] || 0;
      const volumeB = muscleGroupsB[group] || 0;
      
      return {
        muscleGroup: group,
        volumeA,
        volumeB,
        difference: volumeB - volumeA,
        percentDifference: this.calculatePercentDifference(volumeA, volumeB)
      };
    });
    
    // Calcular volumen semanal promedio
    const weeklyVolumeA = totalVolumeA / (planA.microcycles?.length || 1);
    const weeklyVolumeB = totalVolumeB / (planB.microcycles?.length || 1);
    
    return {
      totalVolume: {
        planA: totalVolumeA,
        planB: totalVolumeB,
        difference: totalVolumeB - totalVolumeA,
        percentDifference: this.calculatePercentDifference(totalVolumeA, totalVolumeB)
      },
      weeklyVolume: {
        planA: weeklyVolumeA,
        planB: weeklyVolumeB,
        difference: weeklyVolumeB - weeklyVolumeA,
        percentDifference: this.calculatePercentDifference(weeklyVolumeA, weeklyVolumeB)
      },
      volumeByMuscleGroup: muscleGroupComparison,
      volumeDistribution: {
        planA: this.calculateVolumeDistribution(muscleGroupsA),
        planB: this.calculateVolumeDistribution(muscleGroupsB)
      }
    };
  }
  
  /**
   * Calcula la distribución de volumen por grupo muscular
   * @param {Object} volumeByMuscleGroup - Volumen por grupo muscular
   * @returns {Object} - Distribución de volumen
   */
  calculateVolumeDistribution(volumeByMuscleGroup) {
    const totalVolume = Object.values(volumeByMuscleGroup).reduce((sum, vol) => sum + vol, 0);
    
    if (totalVolume === 0) return {};
    
    const distribution = {};
    
    Object.entries(volumeByMuscleGroup).forEach(([group, volume]) => {
      distribution[group] = (volume / totalVolume) * 100;
    });
    
    return distribution;
  }
  
  /**
   * Compara la intensidad de dos planes
   * @param {Object} planA - Primer plan
   * @param {Object} planB - Segundo plan
   * @returns {Object} - Comparación de intensidad
   */
  compareIntensity(planA, planB) {
    // Calcular estadísticas
    const statsA = statisticsService.calculatePlanStats(planA);
    const statsB = statisticsService.calculatePlanStats(planB);
    
    // Comparar intensidad promedio
    const avgIntensityA = statsA.avgIntensity || 0;
    const avgIntensityB = statsB.avgIntensity || 0;
    
    // Comparar intensidad por grupo muscular
    const muscleGroupsA = statsA.intensityByMuscleGroup || {};
    const muscleGroupsB = statsB.intensityByMuscleGroup || {};
    
    // Obtener todos los grupos musculares
    const allMuscleGroups = [...new Set([
      ...Object.keys(muscleGroupsA),
      ...Object.keys(muscleGroupsB)
    ])];
    
    // Comparar intensidad por grupo muscular
    const muscleGroupComparison = allMuscleGroups.map(group => {
      const intensityA = muscleGroupsA[group] || 0;
      const intensityB = muscleGroupsB[group] || 0;
      
      return {
        muscleGroup: group,
        intensityA,
        intensityB,
        difference: intensityB - intensityA,
        percentDifference: this.calculatePercentDifference(intensityA, intensityB)
      };
    });
    
    return {
      avgIntensity: {
        planA: avgIntensityA,
        planB: avgIntensityB,
        difference: avgIntensityB - avgIntensityA,
        percentDifference: this.calculatePercentDifference(avgIntensityA, avgIntensityB)
      },
      intensityByMuscleGroup: muscleGroupComparison
    };
  }
  
  /**
   * Compara la progresión de dos planes
   * @param {Object} planA - Primer plan
   * @param {Object} planB - Segundo plan
   * @returns {Object} - Comparación de progresión
   */
  compareProgression(planA, planB) {
    // Calcular análisis
    const analysisA = analyticsService.analyzePlan(planA);
    const analysisB = analyticsService.analyzePlan(planB);
    
    // Comparar progresión de peso
    const weightProgressionA = analysisA.progression?.weightProgression || 0;
    const weightProgressionB = analysisB.progression?.weightProgression || 0;
    
    // Comparar progresión de volumen
    const volumeProgressionA = analysisA.progression?.volumeProgression || 0;
    const volumeProgressionB = analysisB.progression?.volumeProgression || 0;
    
    return {
      weightProgression: {
        planA: weightProgressionA,
        planB: weightProgressionB,
        difference: weightProgressionB - weightProgressionA,
        percentDifference: this.calculatePercentDifference(weightProgressionA, weightProgressionB)
      },
      volumeProgression: {
        planA: volumeProgressionA,
        planB: volumeProgressionB,
        difference: volumeProgressionB - volumeProgressionA,
        percentDifference: this.calculatePercentDifference(volumeProgressionA, volumeProgressionB)
      },
      progressionModel: {
        planA: analysisA.progression?.model || 'unknown',
        planB: analysisB.progression?.model || 'unknown',
        isSame: (analysisA.progression?.model || 'unknown') === (analysisB.progression?.model || 'unknown')
      }
    };
  }
  
  /**
   * Obtiene planes recomendados para comparar con un plan dado
   * @param {string} planId - ID del plan
   * @param {number} limit - Número máximo de recomendaciones
   * @returns {Array} - Lista de planes recomendados
   */
  getRecommendedComparisons(planId, limit = 5) {
    try {
      // Obtener el plan
      const plan = planService.getPlanById(planId);
      
      if (!plan) {
        throw new Error('Plan no encontrado');
      }
      
      // Obtener todos los planes
      const allPlans = planService.getAllPlans();
      
      // Filtrar el plan actual
      const otherPlans = allPlans.filter(p => p.id !== planId);
      
      // Calcular puntuación de similitud para cada plan
      const plansWithScore = otherPlans.map(otherPlan => {
        const statsA = statisticsService.calculatePlanStats(plan);
        const statsB = statisticsService.calculatePlanStats(otherPlan);
        
        const analysisA = analyticsService.analyzePlan(plan);
        const analysisB = analyticsService.analyzePlan(otherPlan);
        
        const similarityScore = this.calculateSimilarityScore(
          plan, otherPlan, statsA, statsB, analysisA, analysisB
        );
        
        return {
          id: otherPlan.id,
          name: otherPlan.name,
          status: otherPlan.status,
          primaryGoal: otherPlan.primaryGoal,
          similarityScore
        };
      });
      
      // Ordenar por puntuación de similitud
      plansWithScore.sort((a, b) => b.similarityScore - a.similarityScore);
      
      // Limitar resultados
      return plansWithScore.slice(0, limit);
    } catch (error) {
      console.error('Error al obtener planes recomendados:', error);
      return [];
    }
  }
}

export default new PlanComparisonService();
