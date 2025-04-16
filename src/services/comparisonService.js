import analyticsService from './analyticsService';

/**
 * Servicio para comparación de planes de entrenamiento
 */
class ComparisonService {
  /**
   * Compara dos planes de entrenamiento
   * @param {Object} planA - Primer plan de entrenamiento
   * @param {Object} planB - Segundo plan de entrenamiento
   * @param {Array} logsA - Registros del primer plan
   * @param {Array} logsB - Registros del segundo plan
   * @returns {Object} - Resultados de la comparación
   */
  comparePlans(planA, planB, logsA = [], logsB = []) {
    if (!planA || !planB) {
      return null;
    }
    
    // Analizar ambos planes
    const statsA = analyticsService.analyzePlan(planA, logsA);
    const statsB = analyticsService.analyzePlan(planB, logsB);
    
    // Comparar estadísticas básicas
    const basicComparison = this._compareBasicStats(statsA.basic, statsB.basic);
    
    // Comparar estadísticas de volumen
    const volumeComparison = this._compareVolumeStats(statsA.volume, statsB.volume);
    
    // Comparar estadísticas de intensidad
    const intensityComparison = this._compareIntensityStats(statsA.intensity, statsB.intensity);
    
    // Comparar estadísticas de progresión
    const progressionComparison = this._compareProgressionStats(statsA.progression, statsB.progression);
    
    // Comparar distribución de ejercicios
    const distributionComparison = this._compareDistributionStats(
      statsA.exerciseDistribution, 
      statsB.exerciseDistribution
    );
    
    return {
      basic: basicComparison,
      volume: volumeComparison,
      intensity: intensityComparison,
      progression: progressionComparison,
      distribution: distributionComparison,
      rawStats: {
        planA: statsA,
        planB: statsB
      }
    };
  }
  
  /**
   * Compara estadísticas básicas
   * @param {Object} statsA - Estadísticas básicas del plan A
   * @param {Object} statsB - Estadísticas básicas del plan B
   * @returns {Object} - Comparación de estadísticas básicas
   * @private
   */
  _compareBasicStats(statsA, statsB) {
    if (!statsA || !statsB) {
      return null;
    }
    
    return {
      duration: this._calculateDifference(statsA.duration, statsB.duration),
      sessionCount: this._calculateDifference(statsA.sessionCount, statsB.sessionCount),
      exerciseCount: this._calculateDifference(statsA.exerciseCount, statsB.exerciseCount),
      setCount: this._calculateDifference(statsA.setCount, statsB.setCount),
      uniqueExerciseCount: this._calculateDifference(statsA.uniqueExerciseCount, statsB.uniqueExerciseCount),
      frequency: this._calculateDifference(statsA.frequency, statsB.frequency),
      exercisesPerSession: this._calculateDifference(statsA.exercisesPerSession, statsB.exercisesPerSession),
      setsPerExercise: this._calculateDifference(statsA.setsPerExercise, statsB.setsPerExercise)
    };
  }
  
  /**
   * Compara estadísticas de volumen
   * @param {Object} statsA - Estadísticas de volumen del plan A
   * @param {Object} statsB - Estadísticas de volumen del plan B
   * @returns {Object} - Comparación de estadísticas de volumen
   * @private
   */
  _compareVolumeStats(statsA, statsB) {
    if (!statsA || !statsB) {
      return null;
    }
    
    // Comparar totales
    const totalComparison = {
      totalSets: this._calculateDifference(statsA.totalSets, statsB.totalSets),
      totalReps: this._calculateDifference(statsA.totalReps, statsB.totalReps),
      totalWeight: this._calculateDifference(statsA.totalWeight, statsB.totalWeight)
    };
    
    // Comparar volumen por grupo muscular
    const muscleGroupComparison = {};
    
    // Obtener todos los grupos musculares
    const allMuscleGroups = new Set([
      ...Object.keys(statsA.volumeByMuscleGroup || {}),
      ...Object.keys(statsB.volumeByMuscleGroup || {})
    ]);
    
    // Comparar cada grupo muscular
    allMuscleGroups.forEach(group => {
      const volumeA = statsA.volumeByMuscleGroup[group]?.weight || 0;
      const volumeB = statsB.volumeByMuscleGroup[group]?.weight || 0;
      
      muscleGroupComparison[group] = this._calculateDifference(volumeA, volumeB);
    });
    
    return {
      totals: totalComparison,
      byMuscleGroup: muscleGroupComparison
    };
  }
  
  /**
   * Compara estadísticas de intensidad
   * @param {Object} statsA - Estadísticas de intensidad del plan A
   * @param {Object} statsB - Estadísticas de intensidad del plan B
   * @returns {Object} - Comparación de estadísticas de intensidad
   * @private
   */
  _compareIntensityStats(statsA, statsB) {
    if (!statsA || !statsB) {
      return null;
    }
    
    // Comparar intensidad media
    const averageComparison = this._calculateDifference(
      statsA.averageIntensity, 
      statsB.averageIntensity
    );
    
    // Comparar intensidad por grupo muscular
    const muscleGroupComparison = {};
    
    // Obtener todos los grupos musculares
    const allMuscleGroups = new Set([
      ...Object.keys(statsA.intensityByMuscleGroup || {}),
      ...Object.keys(statsB.intensityByMuscleGroup || {})
    ]);
    
    // Comparar cada grupo muscular
    allMuscleGroups.forEach(group => {
      const intensityA = statsA.intensityByMuscleGroup[group]?.average || 0;
      const intensityB = statsB.intensityByMuscleGroup[group]?.average || 0;
      
      muscleGroupComparison[group] = this._calculateDifference(intensityA, intensityB);
    });
    
    return {
      average: averageComparison,
      byMuscleGroup: muscleGroupComparison
    };
  }
  
  /**
   * Compara estadísticas de progresión
   * @param {Object} statsA - Estadísticas de progresión del plan A
   * @param {Object} statsB - Estadísticas de progresión del plan B
   * @returns {Object} - Comparación de estadísticas de progresión
   * @private
   */
  _compareProgressionStats(statsA, statsB) {
    if (!statsA || !statsB) {
      return null;
    }
    
    return {
      volumeProgressionRate: this._calculateDifference(
        statsA.volumeProgressionRate, 
        statsB.volumeProgressionRate
      ),
      intensityProgressionRate: this._calculateDifference(
        statsA.intensityProgressionRate, 
        statsB.intensityProgressionRate
      )
    };
  }
  
  /**
   * Compara estadísticas de distribución
   * @param {Object} statsA - Estadísticas de distribución del plan A
   * @param {Object} statsB - Estadísticas de distribución del plan B
   * @returns {Object} - Comparación de estadísticas de distribución
   * @private
   */
  _compareDistributionStats(statsA, statsB) {
    if (!statsA || !statsB) {
      return null;
    }
    
    // Comparar distribución por tipo de ejercicio
    const typeComparison = this._compareDistributionCategory(
      statsA.byType || {}, 
      statsB.byType || {}
    );
    
    // Comparar distribución por grupo muscular
    const muscleGroupComparison = this._compareDistributionCategory(
      statsA.byMuscleGroup || {}, 
      statsB.byMuscleGroup || {}
    );
    
    // Comparar distribución por equipo
    const equipmentComparison = this._compareDistributionCategory(
      statsA.byEquipment || {}, 
      statsB.byEquipment || {}
    );
    
    return {
      byType: typeComparison,
      byMuscleGroup: muscleGroupComparison,
      byEquipment: equipmentComparison
    };
  }
  
  /**
   * Compara una categoría de distribución
   * @param {Object} categoryA - Categoría del plan A
   * @param {Object} categoryB - Categoría del plan B
   * @returns {Object} - Comparación de la categoría
   * @private
   */
  _compareDistributionCategory(categoryA, categoryB) {
    const comparison = {};
    
    // Obtener todas las claves
    const allKeys = new Set([
      ...Object.keys(categoryA),
      ...Object.keys(categoryB)
    ]);
    
    // Calcular totales
    const totalA = Object.values(categoryA).reduce((sum, count) => sum + count, 0);
    const totalB = Object.values(categoryB).reduce((sum, count) => sum + count, 0);
    
    // Comparar cada clave
    allKeys.forEach(key => {
      const countA = categoryA[key] || 0;
      const countB = categoryB[key] || 0;
      
      // Calcular porcentajes
      const percentA = totalA > 0 ? (countA / totalA) * 100 : 0;
      const percentB = totalB > 0 ? (countB / totalB) * 100 : 0;
      
      comparison[key] = {
        countDiff: this._calculateDifference(countA, countB),
        percentDiff: this._calculateDifference(percentA, percentB),
        valuesA: { count: countA, percent: percentA },
        valuesB: { count: countB, percent: percentB }
      };
    });
    
    return comparison;
  }
  
  /**
   * Calcula la diferencia entre dos valores
   * @param {number} valueA - Primer valor
   * @param {number} valueB - Segundo valor
   * @returns {Object} - Diferencia absoluta y porcentual
   * @private
   */
  _calculateDifference(valueA, valueB) {
    const absoluteDiff = valueB - valueA;
    
    let percentDiff = 0;
    if (valueA !== 0) {
      percentDiff = (absoluteDiff / Math.abs(valueA)) * 100;
    } else if (valueB !== 0) {
      percentDiff = 100; // Si A es 0 y B no, la diferencia es del 100%
    }
    
    return {
      absolute: absoluteDiff,
      percent: percentDiff,
      valueA,
      valueB
    };
  }
}

export default new ComparisonService();
