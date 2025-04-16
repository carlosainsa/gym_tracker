import { TrainingPlan, Microcycle, TrainingSession, Exercise, Set } from '../models/TrainingPlan';
import { workoutPlan } from '../data/workoutPlan';

/**
 * Servicio para gestionar planes de entrenamiento
 */
class TrainingPlanService {
  /**
   * Convierte el plan actual al nuevo formato
   * @returns {TrainingPlan} - Plan en el nuevo formato
   */
  convertCurrentPlanToNewFormat() {
    return TrainingPlan.fromLegacyPlan(workoutPlan);
  }

  /**
   * Crea un nuevo plan de entrenamiento basado en las preferencias del usuario
   * @param {Object} userPreferences - Preferencias del usuario
   * @returns {TrainingPlan} - Nuevo plan de entrenamiento
   */
  createNewPlan(userPreferences) {
    const {
      name = '',
      primaryGoal,
      secondaryGoals = [],
      planDuration,
      periodizationType,
      weeklyFrequency,
      splitConfiguration,
      trainingDays,
      sessionDuration,
      availableEquipment = [],
      deloadFrequency = 4, // Cada cuántas semanas hay descarga
      deloadStrategy = 'volume', // 'volume', 'intensity', 'both'
      volumeAdjustment = -20, // Reducción del 20% en semanas de descarga
      intensityAdjustment = -10 // Reducción del 10% en semanas de descarga
    } = userPreferences;

    // Crear microciclos basados en la duración del plan
    const microcycles = [];
    for (let week = 1; week <= planDuration; week++) {
      // Determinar la fase basada en la semana
      const phase = Math.ceil(week / 4); // 4 semanas por fase

      // Determinar si es semana de descarga
      const isDeload = week % deloadFrequency === 0; // Por defecto cada 4 semanas

      // Crear sesiones de entrenamiento para esta semana
      const trainingSessions = this._generateTrainingSessions({
        week,
        phase,
        isDeload,
        weeklyFrequency,
        splitConfiguration,
        trainingDays,
        sessionDuration,
        availableEquipment,
        primaryGoal
      });

      // Crear el microciclo
      const microcycle = new Microcycle({
        name: `Semana ${week}${isDeload ? ' (Descarga)' : ''}`,
        description: `Microciclo de la semana ${week} - Fase ${phase}`,
        phase,
        weekNumber: week,
        weeklyFrequency,
        splitConfiguration,
        trainingDays,
        cycleIntensity: isDeload ? 'light' : 'medium',
        trainingSessions,
        isDeload,
        deloadStrategy: isDeload ? deloadStrategy : null,
        volumeAdjustment: isDeload ? volumeAdjustment : 0,
        intensityAdjustment: isDeload ? intensityAdjustment : 0,
        notes: isDeload ? 'Semana de descarga para facilitar la recuperación y supercompensación' : ''
      });

      microcycles.push(microcycle);
    }

    // Crear el plan completo
    const planName = name || `Plan de ${this._getGoalName(primaryGoal)}`;
    return new TrainingPlan({
      name: planName,
      description: `Plan de entrenamiento personalizado para ${this._getGoalName(primaryGoal)}`,
      primaryGoal,
      secondaryGoals,
      planDuration,
      periodizationType,
      microcycles,
      metadata: {
        createdAt: new Date().toISOString(),
        version: '2.0',
        deloadFrequency,
        deloadStrategy,
        volumeAdjustment,
        intensityAdjustment
      }
    });
  }

  /**
   * Crea un plan de entrenamiento a partir de una plantilla predefinida
   * @param {string} templateId - ID de la plantilla
   * @param {Object} customOptions - Opciones personalizadas (opcional)
   * @returns {TrainingPlan} - Nuevo plan de entrenamiento
   */
  createPlanFromTemplate(templateId, customOptions = {}) {
    // Obtener la configuración base de la plantilla
    const templateConfig = this._getTemplateConfig(templateId);

    // Combinar con las opciones personalizadas
    const config = {
      ...templateConfig,
      ...customOptions
    };

    // Crear el plan usando la configuración combinada
    return this.createNewPlan(config);
  }

  /**
   * Obtiene la configuración de una plantilla predefinida
   * @param {string} templateId - ID de la plantilla
   * @returns {Object} - Configuración de la plantilla
   * @private
   */
  _getTemplateConfig(templateId) {
    // Plantillas predefinidas
    const templates = {
      'hypertrophy_beginner': {
        name: 'Plan de Hipertrofia para Principiantes',
        primaryGoal: 'hypertrophy',
        secondaryGoals: ['strength'],
        planDuration: 12, // 12 semanas
        periodizationType: 'linear',
        weeklyFrequency: 3,
        splitConfiguration: 'fullbody',
        trainingDays: [1, 3, 5], // Lunes, Miércoles, Viernes
        sessionDuration: 60, // 60 minutos
        deloadFrequency: 4, // Cada 4 semanas
        deloadStrategy: 'volume',
        volumeAdjustment: -30,
        intensityAdjustment: -10
      },
      'strength_intermediate': {
        name: 'Plan de Fuerza para Nivel Intermedio',
        primaryGoal: 'strength',
        secondaryGoals: ['hypertrophy'],
        planDuration: 16, // 16 semanas
        periodizationType: 'undulating',
        weeklyFrequency: 4,
        splitConfiguration: 'upper_lower',
        trainingDays: [1, 3, 5, 6], // Lunes, Miércoles, Viernes, Sábado
        sessionDuration: 75, // 75 minutos
        deloadFrequency: 4, // Cada 4 semanas
        deloadStrategy: 'both',
        volumeAdjustment: -40,
        intensityAdjustment: -15
      },
      'fat_loss': {
        name: 'Plan de Pérdida de Grasa',
        primaryGoal: 'fat_loss',
        secondaryGoals: ['endurance'],
        planDuration: 8, // 8 semanas
        periodizationType: 'linear',
        weeklyFrequency: 4,
        splitConfiguration: 'fullbody',
        trainingDays: [1, 3, 5, 6], // Lunes, Miércoles, Viernes, Sábado
        sessionDuration: 45, // 45 minutos
        deloadFrequency: 4, // Cada 4 semanas
        deloadStrategy: 'intensity',
        volumeAdjustment: -20,
        intensityAdjustment: -20
      },
      'general_fitness': {
        name: 'Plan de Fitness General',
        primaryGoal: 'general_fitness',
        secondaryGoals: ['hypertrophy', 'endurance'],
        planDuration: 12, // 12 semanas
        periodizationType: 'linear',
        weeklyFrequency: 3,
        splitConfiguration: 'fullbody',
        trainingDays: [1, 3, 5], // Lunes, Miércoles, Viernes
        sessionDuration: 60, // 60 minutos
        deloadFrequency: 6, // Cada 6 semanas
        deloadStrategy: 'volume',
        volumeAdjustment: -25,
        intensityAdjustment: -10
      },
      'hypertrophy_advanced': {
        name: 'Plan de Hipertrofia Avanzado',
        primaryGoal: 'hypertrophy',
        secondaryGoals: ['strength'],
        planDuration: 16, // 16 semanas
        periodizationType: 'undulating',
        weeklyFrequency: 5,
        splitConfiguration: 'push_pull_legs',
        trainingDays: [1, 2, 3, 5, 6], // Lunes a Miércoles, Viernes, Sábado
        sessionDuration: 90, // 90 minutos
        deloadFrequency: 4, // Cada 4 semanas
        deloadStrategy: 'both',
        volumeAdjustment: -35,
        intensityAdjustment: -15
      }
    };

    return templates[templateId] || templates['general_fitness'];
  }

  /**
   * Genera sesiones de entrenamiento para un microciclo (anteriormente fase)
   * @param {Object} params - Parámetros para generar las sesiones
   * @param {number} params.phase - Fase actual
   * @param {boolean} params.isDeload - Si es semana de descarga
   * @param {number} params.weeklyFrequency - Frecuencia semanal
   * @param {string} params.splitConfiguration - Configuración de split
   * @param {Array} params.trainingDays - Días de entrenamiento
   * @param {number} params.sessionDuration - Duración de la sesión
   * @param {Array} params.availableEquipment - Equipamiento disponible
   * @param {string} params.primaryGoal - Objetivo principal
   * @returns {Array} - Lista de sesiones de entrenamiento
   * @private
   */
  _generateTrainingSessions({
    phase,
    isDeload,
    weeklyFrequency,
    splitConfiguration,
    trainingDays,
    sessionDuration,
    availableEquipment,
    primaryGoal
  }) {
    const sessions = [];

    // Determinar el tipo de split
    const splitTypes = this._getSplitTypes(splitConfiguration);

    // Generar una sesión para cada día de entrenamiento
    for (let i = 0; i < weeklyFrequency; i++) {
      const dayNumber = trainingDays[i] || (i + 1);
      const splitType = splitTypes[i % splitTypes.length];

      // Generar ejercicios para esta sesión
      const exercises = this._generateExercisesForSession({
        splitType,
        phase,
        isDeload,
        sessionDuration,
        primaryGoal
      });

      // Crear la sesión de entrenamiento
      const session = new TrainingSession({
        name: `Sesión de Entrenamiento ${i + 1}: ${this._getSplitName(splitType)}`,
        description: `Sesión de entrenamiento para ${this._getSplitName(splitType)}`,
        recommendedDay: this._getDayName(dayNumber),
        sessionDuration,
        sessionFocus: [splitType],
        availableEquipment,
        exercises,
        sessionStructure: {
          warmup: this._generateWarmup(splitType),
          main: [],
          finisher: this._generateFinisher(splitType)
        }
      });

      sessions.push(session);
    }

    return sessions;
  }

  /**
   * Genera ejercicios para una sesión de entrenamiento
   * @param {Object} params - Parámetros para generar los ejercicios
   * @param {string} params.splitType - Tipo de split
   * @param {number} params.phase - Fase actual
   * @param {boolean} params.isDeload - Si es semana de descarga
   * @param {number} params.sessionDuration - Duración de la sesión
   * @param {string} params.primaryGoal - Objetivo principal
   * @returns {Array} - Lista de ejercicios
   * @private
   */
  _generateExercisesForSession({
    splitType,
    phase,
    isDeload,
    sessionDuration,
    primaryGoal
  }) {
    // Aquí implementaríamos la lógica para seleccionar ejercicios
    // basados en el tipo de split, fase, etc.
    // Por ahora, usaremos datos de ejemplo

    // Determinar el número de ejercicios basado en la duración de la sesión
    const exerciseCount = Math.floor(sessionDuration / 10);

    // Ejercicios de ejemplo
    const exercises = [];

    // Añadir ejercicios compuestos principales
    const compoundExercises = this._getCompoundExercisesForSplit(splitType);
    for (let i = 0; i < Math.min(2, compoundExercises.length); i++) {
      const exercise = compoundExercises[i];

      // Determinar series y repeticiones basadas en el objetivo y fase
      const { sets, reps, weight } = this._getSetsAndRepsForGoal(primaryGoal, phase, isDeload, true);

      // Crear las series
      const exerciseSets = [];
      for (let j = 0; j < sets; j++) {
        exerciseSets.push(new Set({
          reps: reps,
          weight: weight
        }));
      }

      // Añadir el ejercicio
      exercises.push(new Exercise({
        name: exercise.name,
        description: exercise.description || '',
        muscleGroups: exercise.muscleGroups || [],
        category: exercise.category || '',
        equipment: exercise.equipment || '',
        rest: isDeload ? '60 seg' : '90 seg',
        sets: exerciseSets
      }));
    }

    // Añadir ejercicios de aislamiento
    const isolationExercises = this._getIsolationExercisesForSplit(splitType);
    for (let i = 0; i < Math.min(exerciseCount - 2, isolationExercises.length); i++) {
      const exercise = isolationExercises[i];

      // Determinar series y repeticiones basadas en el objetivo y fase
      const { sets, reps, weight } = this._getSetsAndRepsForGoal(primaryGoal, phase, isDeload, false);

      // Crear las series
      const exerciseSets = [];
      for (let j = 0; j < sets; j++) {
        exerciseSets.push(new Set({
          reps: reps,
          weight: weight
        }));
      }

      // Añadir el ejercicio
      exercises.push(new Exercise({
        name: exercise.name,
        description: exercise.description || '',
        muscleGroups: exercise.muscleGroups || [],
        category: exercise.category || '',
        equipment: exercise.equipment || '',
        rest: isDeload ? '45 seg' : '60 seg',
        sets: exerciseSets
      }));
    }

    return exercises;
  }

  /**
   * Obtiene el nombre de un objetivo
   * @param {string} goal - Código del objetivo
   * @returns {string} - Nombre del objetivo
   * @private
   */
  _getGoalName(goal) {
    const goalNames = {
      'hypertrophy': 'Hipertrofia',
      'strength': 'Fuerza',
      'endurance': 'Resistencia',
      'fat_loss': 'Pérdida de grasa',
      'general_fitness': 'Fitness general'
    };

    return goalNames[goal] || 'Entrenamiento personalizado';
  }

  /**
   * Obtiene los tipos de split basados en la configuración
   * @param {string} splitConfiguration - Configuración de split
   * @returns {Array} - Tipos de split
   * @private
   */
  _getSplitTypes(splitConfiguration) {
    const splitConfigs = {
      'fullbody': ['fullbody', 'fullbody', 'fullbody', 'fullbody', 'fullbody'],
      'upper_lower': ['upper', 'lower', 'upper', 'lower', 'upper'],
      'push_pull_legs': ['push', 'pull', 'legs', 'push', 'pull'],
      'arnold': ['chest_back', 'legs_shoulders', 'arms_core', 'chest_back', 'legs_shoulders'],
      'bro': ['chest', 'back', 'legs', 'shoulders', 'arms']
    };

    return splitConfigs[splitConfiguration] || splitConfigs['fullbody'];
  }

  /**
   * Obtiene el nombre de un tipo de split
   * @param {string} splitType - Tipo de split
   * @returns {string} - Nombre del split
   * @private
   */
  _getSplitName(splitType) {
    const splitNames = {
      'fullbody': 'Cuerpo Completo',
      'upper': 'Tren Superior',
      'lower': 'Tren Inferior',
      'push': 'Empuje',
      'pull': 'Tracción',
      'legs': 'Piernas',
      'chest_back': 'Pecho y Espalda',
      'legs_shoulders': 'Piernas y Hombros',
      'arms_core': 'Brazos y Core',
      'chest': 'Pecho',
      'back': 'Espalda',
      'shoulders': 'Hombros',
      'arms': 'Brazos'
    };

    return splitNames[splitType] || 'Entrenamiento';
  }

  /**
   * Obtiene el nombre de un día de la semana
   * @param {number} dayNumber - Número del día (0-6)
   * @returns {string} - Nombre del día
   * @private
   */
  _getDayName(dayNumber) {
    const dayNames = {
      0: 'Domingo',
      1: 'Lunes',
      2: 'Martes',
      3: 'Miércoles',
      4: 'Jueves',
      5: 'Viernes',
      6: 'Sábado'
    };

    return dayNames[dayNumber] || '';
  }

  /**
   * Genera una rutina de calentamiento para la sesión de entrenamiento
   * @param {string} splitType - Tipo de split
   * @returns {Array} - Rutina de calentamiento
   * @private
   */
  _generateWarmup(splitType) {
    // Usar el tipo de split para personalizar el calentamiento
    const warmups = {
      'fullbody': [
        '5 min bicicleta estática (bajo impacto)',
        'Movilidad articular progresiva (hombros, cadera, tobillos)'
      ],
      'upper': [
        '5 min bicicleta estática (bajo impacto)',
        'Movilidad articular progresiva (hombros, codos, muñecas)'
      ],
      'lower': [
        '5 min bicicleta estática (bajo impacto)',
        'Movilidad articular progresiva (cadera, rodillas, tobillos)'
      ]
    };

    return warmups[splitType] || warmups['fullbody'];
  }

  /**
   * Genera una rutina de finalización para la sesión de entrenamiento
   * @param {string} splitType - Tipo de split
   * @returns {Array} - Rutina de finalización
   * @private
   */
  _generateFinisher(splitType) {
    const finishers = {
      'fullbody': [
        'Estiramientos estáticos para los principales grupos musculares',
        'Movilidad específica de cadera y hombros',
        'Automasaje para zonas tensas'
      ],
      'upper': [
        'Estiramientos estáticos para pecho, espalda y hombros',
        'Movilidad específica de hombros',
        'Automasaje para trapecios y zona cervical'
      ],
      'lower': [
        'Estiramientos estáticos para piernas y glúteos',
        'Movilidad específica de cadera y rodillas',
        'Automasaje para cuádriceps e isquiotibiales'
      ],
      'push': [
        'Estiramientos estáticos para pecho, hombros y tríceps',
        'Movilidad específica de hombros',
        'Automasaje para zona pectoral y cervical'
      ],
      'pull': [
        'Estiramientos estáticos para espalda y bíceps',
        'Movilidad específica de escápulas',
        'Automasaje para zona lumbar y trapecios'
      ],
      'legs': [
        'Estiramientos estáticos para piernas, glúteos e isquiotibiales',
        'Movilidad específica de cadera y rodillas',
        'Automasaje para cuadriceps y zona lumbar'
      ]
    };

    return finishers[splitType] || finishers['fullbody'];
  }

  /**
   * Obtiene ejercicios compuestos para un tipo de split
   * @param {string} splitType - Tipo de split
   * @returns {Array} - Lista de ejercicios compuestos
   * @private
   */
  _getCompoundExercisesForSplit(splitType) {
    // Aquí implementaríamos la lógica para seleccionar ejercicios
    // basados en el tipo de split
    // Por ahora, usaremos datos de ejemplo

    const compoundExercises = {
      'fullbody': [
        { name: 'Sentadilla con barra', muscleGroups: ['Cuádriceps', 'Glúteos'], category: 'Piernas', equipment: 'Barra' },
        { name: 'Press de banca', muscleGroups: ['Pectoral', 'Tríceps'], category: 'Pecho', equipment: 'Barra' },
        { name: 'Peso muerto', muscleGroups: ['Isquiotibiales', 'Glúteos', 'Espalda baja'], category: 'Piernas', equipment: 'Barra' },
        { name: 'Remo con barra', muscleGroups: ['Dorsal', 'Bíceps'], category: 'Espalda', equipment: 'Barra' }
      ],
      'upper': [
        { name: 'Press de banca', muscleGroups: ['Pectoral', 'Tríceps'], category: 'Pecho', equipment: 'Barra' },
        { name: 'Remo con barra', muscleGroups: ['Dorsal', 'Bíceps'], category: 'Espalda', equipment: 'Barra' },
        { name: 'Press militar', muscleGroups: ['Deltoides', 'Tríceps'], category: 'Hombros', equipment: 'Barra' }
      ],
      'lower': [
        { name: 'Sentadilla con barra', muscleGroups: ['Cuádriceps', 'Glúteos'], category: 'Piernas', equipment: 'Barra' },
        { name: 'Peso muerto', muscleGroups: ['Isquiotibiales', 'Glúteos', 'Espalda baja'], category: 'Piernas', equipment: 'Barra' },
        { name: 'Prensa de piernas', muscleGroups: ['Cuádriceps', 'Glúteos'], category: 'Piernas', equipment: 'Máquina' }
      ],
      'push': [
        { name: 'Press de banca', muscleGroups: ['Pectoral', 'Tríceps'], category: 'Pecho', equipment: 'Barra' },
        { name: 'Press militar', muscleGroups: ['Deltoides', 'Tríceps'], category: 'Hombros', equipment: 'Barra' },
        { name: 'Fondos en paralelas', muscleGroups: ['Pectoral', 'Tríceps'], category: 'Pecho', equipment: 'Peso corporal' }
      ],
      'pull': [
        { name: 'Dominadas', muscleGroups: ['Dorsal', 'Bíceps'], category: 'Espalda', equipment: 'Peso corporal' },
        { name: 'Remo con barra', muscleGroups: ['Dorsal', 'Bíceps'], category: 'Espalda', equipment: 'Barra' },
        { name: 'Peso muerto', muscleGroups: ['Isquiotibiales', 'Glúteos', 'Espalda baja'], category: 'Piernas', equipment: 'Barra' }
      ],
      'legs': [
        { name: 'Sentadilla con barra', muscleGroups: ['Cuádriceps', 'Glúteos'], category: 'Piernas', equipment: 'Barra' },
        { name: 'Peso muerto', muscleGroups: ['Isquiotibiales', 'Glúteos', 'Espalda baja'], category: 'Piernas', equipment: 'Barra' },
        { name: 'Prensa de piernas', muscleGroups: ['Cuádriceps', 'Glúteos'], category: 'Piernas', equipment: 'Máquina' }
      ]
    };

    return compoundExercises[splitType] || compoundExercises['fullbody'];
  }

  /**
   * Obtiene ejercicios de aislamiento para un tipo de split
   * @param {string} splitType - Tipo de split
   * @returns {Array} - Lista de ejercicios de aislamiento
   * @private
   */
  _getIsolationExercisesForSplit(splitType) {
    // Aquí implementaríamos la lógica para seleccionar ejercicios
    // basados en el tipo de split
    // Por ahora, usaremos datos de ejemplo

    const isolationExercises = {
      'fullbody': [
        { name: 'Curl de bíceps con barra', muscleGroups: ['Bíceps'], category: 'Brazos', equipment: 'Barra' },
        { name: 'Extensiones de tríceps', muscleGroups: ['Tríceps'], category: 'Brazos', equipment: 'Polea' },
        { name: 'Elevaciones laterales', muscleGroups: ['Deltoides'], category: 'Hombros', equipment: 'Mancuernas' },
        { name: 'Curl femoral', muscleGroups: ['Isquiotibiales'], category: 'Piernas', equipment: 'Máquina' }
      ],
      'upper': [
        { name: 'Curl de bíceps con barra', muscleGroups: ['Bíceps'], category: 'Brazos', equipment: 'Barra' },
        { name: 'Extensiones de tríceps', muscleGroups: ['Tríceps'], category: 'Brazos', equipment: 'Polea' },
        { name: 'Elevaciones laterales', muscleGroups: ['Deltoides'], category: 'Hombros', equipment: 'Mancuernas' },
        { name: 'Aperturas en polea', muscleGroups: ['Pectoral'], category: 'Pecho', equipment: 'Polea' }
      ],
      'lower': [
        { name: 'Curl femoral', muscleGroups: ['Isquiotibiales'], category: 'Piernas', equipment: 'Máquina' },
        { name: 'Extensiones de cuádriceps', muscleGroups: ['Cuádriceps'], category: 'Piernas', equipment: 'Máquina' },
        { name: 'Elevaciones de pantorrilla', muscleGroups: ['Pantorrillas'], category: 'Piernas', equipment: 'Máquina' },
        { name: 'Abducción de cadera', muscleGroups: ['Glúteo medio'], category: 'Piernas', equipment: 'Máquina' }
      ],
      'push': [
        { name: 'Extensiones de tríceps', muscleGroups: ['Tríceps'], category: 'Brazos', equipment: 'Polea' },
        { name: 'Elevaciones laterales', muscleGroups: ['Deltoides'], category: 'Hombros', equipment: 'Mancuernas' },
        { name: 'Aperturas en polea', muscleGroups: ['Pectoral'], category: 'Pecho', equipment: 'Polea' },
        { name: 'Press de hombros con mancuernas', muscleGroups: ['Deltoides'], category: 'Hombros', equipment: 'Mancuernas' }
      ],
      'pull': [
        { name: 'Curl de bíceps con barra', muscleGroups: ['Bíceps'], category: 'Brazos', equipment: 'Barra' },
        { name: 'Pulldown en polea', muscleGroups: ['Dorsal'], category: 'Espalda', equipment: 'Polea' },
        { name: 'Remo en máquina', muscleGroups: ['Dorsal', 'Romboides'], category: 'Espalda', equipment: 'Máquina' },
        { name: 'Face pull', muscleGroups: ['Deltoides posterior', 'Trapecios'], category: 'Hombros', equipment: 'Polea' }
      ],
      'legs': [
        { name: 'Curl femoral', muscleGroups: ['Isquiotibiales'], category: 'Piernas', equipment: 'Máquina' },
        { name: 'Extensiones de cuádriceps', muscleGroups: ['Cuádriceps'], category: 'Piernas', equipment: 'Máquina' },
        { name: 'Elevaciones de pantorrilla', muscleGroups: ['Pantorrillas'], category: 'Piernas', equipment: 'Máquina' },
        { name: 'Abducción de cadera', muscleGroups: ['Glúteo medio'], category: 'Piernas', equipment: 'Máquina' }
      ]
    };

    return isolationExercises[splitType] || isolationExercises['fullbody'];
  }

  /**
   * Obtiene series y repeticiones basadas en el objetivo y fase
   * @param {string} goal - Objetivo de entrenamiento
   * @param {number} phase - Fase actual
   * @param {boolean} isDeload - Si es semana de descarga
   * @param {boolean} isCompound - Si es ejercicio compuesto
   * @returns {Object} - Series, repeticiones y peso
   * @private
   */
  _getSetsAndRepsForGoal(goal, phase, isDeload, isCompound = true) {
    // Reducir volumen e intensidad en semanas de descarga
    if (isDeload) {
      // Configuración base para semanas normales
      const baseConfig = this._getBaseConfigForGoal(goal, phase, isCompound);

      // Aplicar ajustes según la estrategia de descarga
      let deloadSets = baseConfig.sets;
      let deloadReps = baseConfig.reps;
      let deloadWeight = baseConfig.weight;

      // Ajustar volumen (sets)
      if (deloadStrategy === 'volume' || deloadStrategy === 'both') {
        // Reducir el número de series (mínimo 2)
        deloadSets = Math.max(2, Math.round(baseConfig.sets * (1 + volumeAdjustment / 100)));
      }

      // Ajustar intensidad (peso)
      if (deloadStrategy === 'intensity' || deloadStrategy === 'both') {
        // Ajustar el peso
        if (baseConfig.weight === 'Muy Alto') {
          deloadWeight = 'Alto';
        } else if (baseConfig.weight === 'Alto') {
          deloadWeight = 'Moderado-Alto';
        } else if (baseConfig.weight === 'Moderado-Alto') {
          deloadWeight = 'Moderado';
        }

        // Ajustar las repeticiones (aumentar para compensar la reducción de peso)
        if (typeof baseConfig.reps === 'string' && baseConfig.reps.includes('-')) {
          const [min, max] = baseConfig.reps.split('-').map(Number);
          const newMin = Math.round(min * 1.2); // Aumentar un 20%
          const newMax = Math.round(max * 1.2);
          deloadReps = `${newMin}-${newMax}`;
        } else {
          const reps = parseInt(baseConfig.reps);
          deloadReps = Math.round(reps * 1.2).toString();
        }
      }

      return {
        sets: deloadSets,
        reps: deloadReps,
        weight: deloadWeight
      };
    }

    // Si no es semana de descarga, usar la configuración base
    return this._getBaseConfigForGoal(goal, phase, isCompound);
  }

  /**
   * Obtiene la configuración base para un objetivo y fase
   * @param {string} goal - Objetivo de entrenamiento
   * @param {number} phase - Fase actual
   * @param {boolean} isCompound - Si es ejercicio compuesto
   * @returns {Object} - Configuración base (sets, reps, weight)
   * @private
   */
  _getBaseConfigForGoal(goal, phase, isCompound = true) {
    // Configuración basada en el objetivo y fase
    const configs = {
      'hypertrophy': [
        { sets: isCompound ? 3 : 3, reps: '12-15', weight: 'Moderado' }, // Fase 1
        { sets: isCompound ? 4 : 3, reps: '10-12', weight: 'Moderado-Alto' }, // Fase 2
        { sets: isCompound ? 4 : 3, reps: '8-10', weight: 'Alto' } // Fase 3
      ],
      'strength': [
        { sets: isCompound ? 4 : 3, reps: '8-10', weight: 'Moderado-Alto' }, // Fase 1
        { sets: isCompound ? 5 : 3, reps: '6-8', weight: 'Alto' }, // Fase 2
        { sets: isCompound ? 5 : 3, reps: '4-6', weight: 'Muy Alto' } // Fase 3
      ],
      'endurance': [
        { sets: isCompound ? 3 : 2, reps: '15-20', weight: 'Bajo-Moderado' }, // Fase 1
        { sets: isCompound ? 3 : 3, reps: '12-15', weight: 'Moderado' }, // Fase 2
        { sets: isCompound ? 4 : 3, reps: '10-12', weight: 'Moderado' } // Fase 3
      ],
      'fat_loss': [
        { sets: isCompound ? 3 : 2, reps: '15-20', weight: 'Moderado' }, // Fase 1
        { sets: isCompound ? 4 : 3, reps: '12-15', weight: 'Moderado' }, // Fase 2
        { sets: isCompound ? 4 : 3, reps: '10-12', weight: 'Moderado-Alto' } // Fase 3
      ],
      'general_fitness': [
        { sets: isCompound ? 3 : 2, reps: '12-15', weight: 'Moderado' }, // Fase 1
        { sets: isCompound ? 3 : 3, reps: '10-12', weight: 'Moderado' }, // Fase 2
        { sets: isCompound ? 4 : 3, reps: '8-10', weight: 'Moderado-Alto' } // Fase 3
      ]
    };

    // Obtener la configuración para el objetivo
    const goalConfigs = configs[goal] || configs['general_fitness'];

    // Ajustar la fase (1-3)
    const phaseIndex = Math.min(Math.max(0, phase - 1), 2);

    // Devolver la configuración para la fase
    return goalConfigs[phaseIndex];
  }
}

export default new TrainingPlanService();
