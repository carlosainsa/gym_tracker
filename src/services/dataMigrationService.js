import { TrainingPlan, Microcycle, TrainingSession, Exercise, Set } from '../models/TrainingPlan';
import { UserPreferences } from '../models/UserPreferences';
import { workoutPlan } from '../data/workoutPlan';
import { TRAINING_CONFIG } from '../config/trainingConfig';
import userPreferencesService from './userPreferencesService';

/**
 * Servicio para migrar datos del formato antiguo al nuevo
 */
class DataMigrationService {
  /**
   * Migra todos los datos del formato antiguo al nuevo
   * @returns {Object} - Datos migrados
   */
  migrateAllData() {
    // Migrar plan de entrenamiento
    const trainingPlan = this.migrateTrainingPlan();
    
    // Migrar preferencias de usuario
    const userPreferences = this.migrateUserPreferences();
    
    // Migrar registros de entrenamiento
    const workoutLogs = this.migrateWorkoutLogs();
    
    return {
      trainingPlan,
      userPreferences,
      workoutLogs
    };
  }

  /**
   * Migra el plan de entrenamiento del formato antiguo al nuevo
   * @returns {TrainingPlan} - Plan de entrenamiento en el nuevo formato
   */
  migrateTrainingPlan() {
    // Obtener el plan antiguo
    let legacyPlan = [];
    try {
      const savedPlan = localStorage.getItem('workoutPlan');
      legacyPlan = savedPlan ? JSON.parse(savedPlan) : workoutPlan;
    } catch (error) {
      console.error('Error al cargar el plan antiguo:', error);
      legacyPlan = workoutPlan;
    }
    
    // Agrupar entrenamientos por fase
    const workoutsByPhase = {};
    legacyPlan.forEach(workout => {
      if (!workoutsByPhase[workout.phase]) {
        workoutsByPhase[workout.phase] = [];
      }
      workoutsByPhase[workout.phase].push(workout);
    });
    
    // Crear microciclos para cada fase
    const microcycles = [];
    Object.keys(workoutsByPhase).forEach(phase => {
      const workouts = workoutsByPhase[phase];
      
      // Crear un microciclo por semana (4 semanas por fase)
      for (let week = 0; week < 4; week++) {
        const microcycle = new Microcycle({
          name: `Fase ${phase} - Semana ${week + 1}`,
          description: `Microciclo de la semana ${week + 1} de la fase ${phase}`,
          phase: parseInt(phase),
          weekNumber: week + 1,
          weeklyFrequency: workouts.length,
          splitConfiguration: 'fullbody',
          trainingDays: TRAINING_CONFIG.trainingDays.map(day => day.dayNumber),
          cycleIntensity: week === 3 ? 'light' : 'medium', // Última semana de cada fase es de descarga
          isDeload: week === 3,
          trainingSessions: workouts.map(workout => this.migrateWorkoutToSession(workout, week))
        });
        
        microcycles.push(microcycle);
      }
    });
    
    // Crear el plan completo
    return new TrainingPlan({
      name: 'Plan de entrenamiento personalizado',
      description: 'Plan generado a partir del plan anterior',
      primaryGoal: 'hypertrophy',
      secondaryGoals: ['strength'],
      planDuration: 12, // 3 fases x 4 semanas
      periodizationType: 'linear',
      microcycles: microcycles
    });
  }

  /**
   * Migra un entrenamiento del formato antiguo a una sesión en el nuevo formato
   * @param {Object} workout - Entrenamiento en formato antiguo
   * @param {number} week - Número de semana
   * @returns {TrainingSession} - Sesión en el nuevo formato
   */
  migrateWorkoutToSession(workout, week) {
    // Extraer secciones del description si existe
    let warmup = [];
    let main = [];
    let finisher = [];

    if (workout.description) {
      const sections = workout.description.split('\\n\\n');
      
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
    const exercises = workout.exercises ? workout.exercises.map(ex => {
      // Determinar si es un ejercicio basado en tiempo
      const isTimeBased = ex.sets && ex.sets.length > 0 && 
                          ex.sets[0].reps && 
                          ex.sets[0].reps.toString().includes('seg');
      
      return new Exercise({
        id: ex.id || `exercise_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
        name: ex.name,
        description: ex.description || '',
        muscleGroups: ex.muscleGroups || [],
        category: ex.category || '',
        equipment: ex.equipment || '',
        videoUrl: ex.videoUrl || '',
        imageUrl: ex.imageUrl || '',
        rest: ex.rest || '60 seg',
        tempo: ex.tempo || '2-0-2-0',
        sets: ex.sets ? ex.sets.map(set => new Set({
          reps: set.reps || '',
          weight: set.weight || '',
          isCompleted: set.isCompleted || false,
          actualReps: set.actualReps || null,
          actualWeight: set.actualWeight || null
        })) : [],
        isTimeBased: isTimeBased,
        progress: ex.progress || 0,
        notes: ex.notes || ''
      });
    }) : [];

    // Crear la sesión
    return new TrainingSession({
      id: workout.id || `session_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      name: workout.name || `Entrenamiento ${workout.id}`,
      description: workout.description || '',
      recommendedDay: workout.recommendedDay || '',
      sessionDuration: 60, // Valor por defecto
      sessionFocus: workout.focus || [],
      availableEquipment: [],
      sessionStructure: {
        warmup,
        main,
        finisher
      },
      exercises: exercises,
      progress: workout.progress || 0,
      completed: workout.completed || false,
      completedDate: workout.completedDate || null
    });
  }

  /**
   * Migra las preferencias de usuario del formato antiguo al nuevo
   * @returns {UserPreferences} - Preferencias de usuario en el nuevo formato
   */
  migrateUserPreferences() {
    return userPreferencesService.loadFromLocalStorage();
  }

  /**
   * Migra los registros de entrenamiento del formato antiguo al nuevo
   * @returns {Object} - Registros de entrenamiento en el nuevo formato
   */
  migrateWorkoutLogs() {
    // Obtener los registros antiguos
    let legacyLogs = { logs: [] };
    try {
      const savedLogs = localStorage.getItem('workoutLogs');
      legacyLogs = savedLogs ? JSON.parse(savedLogs) : { logs: [] };
    } catch (error) {
      console.error('Error al cargar los registros antiguos:', error);
      legacyLogs = { logs: [] };
    }
    
    // Convertir los registros
    const migratedLogs = {
      logs: legacyLogs.logs.map(log => {
        return {
          ...log,
          // Añadir campos adicionales si es necesario
          duration: log.duration || 0,
          migratedAt: new Date().toISOString()
        };
      })
    };
    
    return migratedLogs;
  }

  /**
   * Verifica si es necesario migrar los datos
   * @returns {boolean} - true si es necesario migrar, false en caso contrario
   */
  needsMigration() {
    // Verificar si ya existe un plan en el nuevo formato
    const savedNewPlan = localStorage.getItem('trainingPlan');
    
    // Si no existe, es necesario migrar
    return !savedNewPlan;
  }

  /**
   * Guarda los datos migrados
   * @param {Object} migratedData - Datos migrados
   */
  saveMigratedData(migratedData) {
    // Guardar el plan de entrenamiento
    if (migratedData.trainingPlan) {
      localStorage.setItem('trainingPlan', JSON.stringify(migratedData.trainingPlan));
    }
    
    // Guardar las preferencias de usuario
    if (migratedData.userPreferences) {
      userPreferencesService.saveToLocalStorage(migratedData.userPreferences);
    }
    
    // Guardar los registros de entrenamiento
    if (migratedData.workoutLogs) {
      localStorage.setItem('workoutLogs', JSON.stringify(migratedData.workoutLogs));
    }
    
    // Marcar la migración como completada
    localStorage.setItem('dataMigrationCompleted', 'true');
    localStorage.setItem('dataMigrationVersion', '1.0');
    localStorage.setItem('dataMigrationDate', new Date().toISOString());
  }
}

export default new DataMigrationService();
