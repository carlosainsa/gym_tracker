/**
 * Servicio para calcular estadísticas de planes de entrenamiento
 */
class StatisticsService {
  /**
   * Calcula estadísticas generales de un plan de entrenamiento
   * @param {Object} plan - Plan de entrenamiento
   * @param {Object} workoutLogs - Registros de entrenamientos
   * @returns {Object} - Estadísticas del plan
   */
  calculatePlanStats(plan, workoutLogs) {
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
    
    // Calcular estadísticas básicas
    const totalWorkouts = planLogs.length;
    let totalExercises = 0;
    let totalSets = 0;
    let totalVolume = 0;
    let totalDuration = 0;
    let exerciseStats = {};
    let muscleGroupStats = {};
    let weeklyStats = {};
    
    // Inicializar estadísticas por grupo muscular
    const muscleGroups = [
      'chest', 'back', 'shoulders', 'biceps', 'triceps', 
      'quadriceps', 'hamstrings', 'glutes', 'calves', 'abs', 'other'
    ];
    
    muscleGroups.forEach(group => {
      muscleGroupStats[group] = {
        name: this.getMuscleGroupName(group),
        sets: 0,
        volume: 0,
        exercises: new Set()
      };
    });
    
    planLogs.forEach(log => {
      // Obtener la semana del entrenamiento
      const weekKey = this.getWeekKey(new Date(log.date));
      if (!weeklyStats[weekKey]) {
        weeklyStats[weekKey] = {
          workouts: 0,
          volume: 0,
          duration: 0
        };
      }
      
      // Incrementar contadores semanales
      weeklyStats[weekKey].workouts += 1;
      
      // Sumar duración
      if (log.duration) {
        totalDuration += log.duration;
        weeklyStats[weekKey].duration += log.duration;
      }
      
      // Procesar ejercicios
      if (log.exercises) {
        totalExercises += log.exercises.length;
        
        log.exercises.forEach(exercise => {
          const exerciseName = exercise.name;
          const muscleGroup = exercise.muscleGroup || this.inferMuscleGroup(exerciseName);
          
          // Inicializar datos del ejercicio si no existen
          if (!exerciseStats[exerciseName]) {
            exerciseStats[exerciseName] = {
              name: exerciseName,
              muscleGroup,
              sets: 0,
              totalVolume: 0,
              maxWeight: 0,
              totalReps: 0,
              sessions: 0
            };
          }
          
          // Incrementar contador de sesiones
          exerciseStats[exerciseName].sessions += 1;
          
          // Agregar ejercicio al grupo muscular
          if (muscleGroup && muscleGroupStats[muscleGroup]) {
            muscleGroupStats[muscleGroup].exercises.add(exerciseName);
          }
          
          // Procesar series
          if (exercise.sets) {
            const exerciseSets = exercise.sets.length;
            totalSets += exerciseSets;
            exerciseStats[exerciseName].sets += exerciseSets;
            
            // Incrementar series del grupo muscular
            if (muscleGroup && muscleGroupStats[muscleGroup]) {
              muscleGroupStats[muscleGroup].sets += exerciseSets;
            }
            
            exercise.sets.forEach(set => {
              if (set.actualReps && set.actualWeight) {
                const reps = parseInt(set.actualReps);
                const weight = parseFloat(set.actualWeight);
                
                if (!isNaN(reps) && !isNaN(weight)) {
                  // Calcular volumen (peso x repeticiones)
                  const volume = weight * reps;
                  totalVolume += volume;
                  exerciseStats[exerciseName].totalVolume += volume;
                  weeklyStats[weekKey].volume += volume;
                  
                  // Incrementar volumen del grupo muscular
                  if (muscleGroup && muscleGroupStats[muscleGroup]) {
                    muscleGroupStats[muscleGroup].volume += volume;
                  }
                  
                  // Actualizar máximos
                  if (weight > exerciseStats[exerciseName].maxWeight) {
                    exerciseStats[exerciseName].maxWeight = weight;
                  }
                  
                  // Sumar repeticiones
                  exerciseStats[exerciseName].totalReps += reps;
                }
              }
            });
          }
        });
      }
    });
    
    // Convertir Set a array para cada grupo muscular
    Object.keys(muscleGroupStats).forEach(group => {
      muscleGroupStats[group].exercises = Array.from(muscleGroupStats[group].exercises);
      muscleGroupStats[group].exerciseCount = muscleGroupStats[group].exercises.length;
    });
    
    // Calcular promedios
    const avgWorkoutDuration = totalWorkouts > 0 ? totalDuration / totalWorkouts : 0;
    const avgVolumePerWorkout = totalWorkouts > 0 ? totalVolume / totalWorkouts : 0;
    const avgSetsPerWorkout = totalWorkouts > 0 ? totalSets / totalWorkouts : 0;
    
    // Ordenar estadísticas semanales por fecha
    const sortedWeeklyStats = Object.entries(weeklyStats)
      .sort(([weekA], [weekB]) => {
        return new Date(weekA) - new Date(weekB);
      })
      .reduce((acc, [week, stats]) => {
        acc[week] = stats;
        return acc;
      }, {});
    
    // Establecer estadísticas
    return {
      totalWorkouts,
      totalExercises,
      totalSets,
      totalVolume,
      totalDuration,
      avgWorkoutDuration,
      avgVolumePerWorkout,
      avgSetsPerWorkout,
      exerciseStats,
      muscleGroupStats,
      weeklyStats: sortedWeeklyStats
    };
  }
  
  /**
   * Calcula estadísticas de progreso para un ejercicio específico
   * @param {string} exerciseName - Nombre del ejercicio
   * @param {Object} workoutLogs - Registros de entrenamientos
   * @returns {Object} - Estadísticas de progreso del ejercicio
   */
  calculateExerciseProgress(exerciseName, workoutLogs) {
    if (!exerciseName || !workoutLogs || !workoutLogs.logs) {
      return null;
    }
    
    // Filtrar los registros que contienen este ejercicio
    const relevantLogs = workoutLogs.logs.filter(log => 
      log.exercises && log.exercises.some(ex => ex.name === exerciseName)
    );
    
    if (relevantLogs.length === 0) {
      return null;
    }
    
    // Ordenar por fecha
    relevantLogs.sort((a, b) => new Date(a.date) - new Date(b.date));
    
    // Extraer datos de progreso
    const progressData = relevantLogs.map(log => {
      const exercise = log.exercises.find(ex => ex.name === exerciseName);
      if (!exercise || !exercise.sets || exercise.sets.length === 0) {
        return null;
      }
      
      // Calcular máximo peso y volumen total para este entrenamiento
      let maxWeight = 0;
      let totalVolume = 0;
      let totalReps = 0;
      
      exercise.sets.forEach(set => {
        if (set.actualReps && set.actualWeight) {
          const reps = parseInt(set.actualReps);
          const weight = parseFloat(set.actualWeight);
          
          if (!isNaN(reps) && !isNaN(weight)) {
            totalReps += reps;
            totalVolume += weight * reps;
            
            if (weight > maxWeight) {
              maxWeight = weight;
            }
          }
        }
      });
      
      return {
        date: log.date,
        maxWeight,
        totalVolume,
        totalReps,
        sets: exercise.sets.length
      };
    }).filter(Boolean);
    
    // Calcular tendencias
    let weightTrend = 0;
    let volumeTrend = 0;
    
    if (progressData.length >= 2) {
      const firstEntry = progressData[0];
      const lastEntry = progressData[progressData.length - 1];
      
      // Calcular cambio porcentual
      if (firstEntry.maxWeight > 0) {
        weightTrend = ((lastEntry.maxWeight - firstEntry.maxWeight) / firstEntry.maxWeight) * 100;
      }
      
      if (firstEntry.totalVolume > 0) {
        volumeTrend = ((lastEntry.totalVolume - firstEntry.totalVolume) / firstEntry.totalVolume) * 100;
      }
    }
    
    return {
      exerciseName,
      sessions: progressData.length,
      firstDate: progressData[0].date,
      lastDate: progressData[progressData.length - 1].date,
      initialMaxWeight: progressData[0].maxWeight,
      currentMaxWeight: progressData[progressData.length - 1].maxWeight,
      weightTrend,
      volumeTrend,
      progressData
    };
  }
  
  /**
   * Calcula estadísticas comparativas entre dos planes
   * @param {Object} baseStats - Estadísticas del plan base
   * @param {Object} compareStats - Estadísticas del plan a comparar
   * @returns {Object} - Estadísticas comparativas
   */
  calculateComparativeStats(baseStats, compareStats) {
    if (!baseStats || !compareStats) {
      return null;
    }
    
    // Calcular diferencias porcentuales
    const volumeDiff = this.calculatePercentageDiff(baseStats.totalVolume, compareStats.totalVolume);
    const durationDiff = this.calculatePercentageDiff(baseStats.totalDuration, compareStats.totalDuration);
    const workoutsDiff = this.calculatePercentageDiff(baseStats.totalWorkouts, compareStats.totalWorkouts);
    const avgVolumeDiff = this.calculatePercentageDiff(baseStats.avgVolumePerWorkout, compareStats.avgVolumePerWorkout);
    const avgDurationDiff = this.calculatePercentageDiff(baseStats.avgWorkoutDuration, compareStats.avgWorkoutDuration);
    
    // Comparar grupos musculares
    const muscleGroupComparison = {};
    
    Object.keys(baseStats.muscleGroupStats).forEach(group => {
      const baseGroup = baseStats.muscleGroupStats[group];
      const compareGroup = compareStats.muscleGroupStats[group];
      
      if (baseGroup && compareGroup) {
        muscleGroupComparison[group] = {
          name: this.getMuscleGroupName(group),
          volumeDiff: this.calculatePercentageDiff(baseGroup.volume, compareGroup.volume),
          setsDiff: this.calculatePercentageDiff(baseGroup.sets, compareGroup.sets),
          exerciseCountDiff: this.calculatePercentageDiff(
            baseGroup.exerciseCount || 0, 
            compareGroup.exerciseCount || 0
          )
        };
      }
    });
    
    // Comparar ejercicios comunes
    const commonExercises = {};
    
    Object.keys(baseStats.exerciseStats)
      .filter(exercise => compareStats.exerciseStats[exercise])
      .forEach(exercise => {
        const baseExercise = baseStats.exerciseStats[exercise];
        const compareExercise = compareStats.exerciseStats[exercise];
        
        commonExercises[exercise] = {
          name: exercise,
          maxWeightDiff: this.calculatePercentageDiff(baseExercise.maxWeight, compareExercise.maxWeight),
          volumeDiff: this.calculatePercentageDiff(baseExercise.totalVolume, compareExercise.totalVolume),
          repsDiff: this.calculatePercentageDiff(baseExercise.totalReps, compareExercise.totalReps),
          setsDiff: this.calculatePercentageDiff(baseExercise.sets, compareExercise.sets)
        };
      });
    
    return {
      volumeDiff,
      durationDiff,
      workoutsDiff,
      avgVolumeDiff,
      avgDurationDiff,
      muscleGroupComparison,
      commonExercises
    };
  }
  
  /**
   * Calcula la diferencia porcentual entre dos valores
   * @param {number} value1 - Valor base
   * @param {number} value2 - Valor a comparar
   * @returns {number} - Diferencia porcentual
   */
  calculatePercentageDiff(value1, value2) {
    if (!value1 || !value2) return 0;
    return ((value2 - value1) / value1) * 100;
  }
  
  /**
   * Obtiene la clave de la semana para una fecha
   * @param {Date} date - Fecha
   * @returns {string} - Clave de la semana (YYYY-WW)
   */
  getWeekKey(date) {
    const year = date.getFullYear();
    const firstDayOfYear = new Date(year, 0, 1);
    const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
    const weekNumber = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
    return `${year}-${weekNumber.toString().padStart(2, '0')}`;
  }
  
  /**
   * Infiere el grupo muscular a partir del nombre del ejercicio
   * @param {string} exerciseName - Nombre del ejercicio
   * @returns {string} - Grupo muscular
   */
  inferMuscleGroup(exerciseName) {
    const name = exerciseName.toLowerCase();
    
    if (name.includes('press') && (name.includes('bench') || name.includes('pecho'))) return 'chest';
    if (name.includes('fly') || name.includes('flye') || name.includes('pec')) return 'chest';
    
    if (name.includes('row') || name.includes('pull') || name.includes('remo')) return 'back';
    if (name.includes('lat') || name.includes('dorsal')) return 'back';
    
    if (name.includes('shoulder') || name.includes('delt') || name.includes('hombro')) return 'shoulders';
    if (name.includes('press') && !name.includes('bench')) return 'shoulders';
    
    if (name.includes('bicep') || name.includes('curl')) return 'biceps';
    
    if (name.includes('tricep') || name.includes('extension')) return 'triceps';
    if (name.includes('pushdown') || name.includes('press down')) return 'triceps';
    
    if (name.includes('squat') || name.includes('leg press') || name.includes('sentadilla')) return 'quadriceps';
    if (name.includes('quad') || name.includes('hack')) return 'quadriceps';
    
    if (name.includes('hamstring') || name.includes('leg curl') || name.includes('femoral')) return 'hamstrings';
    if (name.includes('deadlift') || name.includes('peso muerto')) return 'hamstrings';
    
    if (name.includes('glute') || name.includes('hip thrust') || name.includes('gluteo')) return 'glutes';
    
    if (name.includes('calf') || name.includes('gemelo')) return 'calves';
    
    if (name.includes('ab') || name.includes('crunch') || name.includes('plank')) return 'abs';
    
    return 'other';
  }
  
  /**
   * Obtiene el nombre legible de un grupo muscular
   * @param {string} muscleGroup - Código del grupo muscular
   * @returns {string} - Nombre legible
   */
  getMuscleGroupName(muscleGroup) {
    const names = {
      'chest': 'Pecho',
      'back': 'Espalda',
      'shoulders': 'Hombros',
      'biceps': 'Bíceps',
      'triceps': 'Tríceps',
      'quadriceps': 'Cuádriceps',
      'hamstrings': 'Isquiotibiales',
      'glutes': 'Glúteos',
      'calves': 'Gemelos',
      'abs': 'Abdominales',
      'other': 'Otros'
    };
    
    return names[muscleGroup] || muscleGroup;
  }
}

export default new StatisticsService();
