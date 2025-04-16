/**
 * Modelo para Preferencias de Usuario
 * Almacena todas las preferencias y configuraciones personalizadas del usuario
 */
export class UserPreferences {
  constructor({
    id = null,
    userId = null,
    trainingPreferences = new TrainingPreferences(),
    uiPreferences = new UIPreferences(),
    notificationPreferences = new NotificationPreferences(),
    equipmentAvailable = [],
    healthData = new HealthData(),
    createdAt = new Date(),
    updatedAt = new Date(),
    version = '1.0'
  }) {
    this.id = id || `prefs_${Date.now()}`;
    this.userId = userId;
    this.trainingPreferences = trainingPreferences;
    this.uiPreferences = uiPreferences;
    this.notificationPreferences = notificationPreferences;
    this.equipmentAvailable = equipmentAvailable;
    this.healthData = healthData;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.version = version;
  }

  /**
   * Convierte las preferencias antiguas al nuevo formato
   * @param {Object} legacyPreferences - Preferencias en formato antiguo
   * @returns {UserPreferences} - Nuevas preferencias en formato actualizado
   */
  static fromLegacyPreferences(legacySettings = {}) {
    // Extraer preferencias de entrenamiento
    const trainingPreferences = new TrainingPreferences({
      preferredTrainingDays: [1, 3, 5], // Lunes, Miércoles, Viernes por defecto
      restDays: [0, 2, 4, 6], // Domingo, Martes, Jueves, Sábado por defecto
      preferredTrainingTime: legacySettings.reminderTime || '18:00',
      currentPhase: parseInt(legacySettings.currentPhase) || 1
    });

    // Extraer preferencias de UI
    const uiPreferences = new UIPreferences({
      darkMode: legacySettings.darkMode === 'true',
      language: legacySettings.language || 'es'
    });

    // Extraer preferencias de notificaciones
    let notificationSettings = {};
    try {
      notificationSettings = legacySettings.notificationSettings ?
        JSON.parse(legacySettings.notificationSettings) : {};
    } catch (e) {
      console.error('Error parsing notification settings:', e);
    }

    const notificationPreferences = new NotificationPreferences({
      enabled: legacySettings.notificationsEnabled === 'true',
      reminderDays: notificationSettings.days || [1, 3, 5],
      reminderTime: notificationSettings.time || '18:00'
    });

    return new UserPreferences({
      trainingPreferences,
      uiPreferences,
      notificationPreferences
    });
  }

  /**
   * Convierte las preferencias al formato antiguo para compatibilidad
   * @returns {Object} - Preferencias en formato antiguo
   */
  toLegacyFormat() {
    return {
      darkMode: this.uiPreferences.darkMode.toString(),
      language: this.uiPreferences.language,
      notificationsEnabled: this.notificationPreferences.enabled.toString(),
      notificationSettings: JSON.stringify({
        enabled: this.notificationPreferences.enabled,
        days: this.notificationPreferences.reminderDays,
        time: this.notificationPreferences.reminderTime
      }),
      reminderTime: this.notificationPreferences.reminderTime,
      currentPhase: this.trainingPreferences.currentPhase.toString()
    };
  }
}

/**
 * Modelo para Preferencias de Entrenamiento
 * Almacena las preferencias relacionadas con el entrenamiento
 */
export class TrainingPreferences {
  constructor({
    preferredTrainingDays = [1, 3, 5], // Lunes, Miércoles, Viernes
    restDays = [0, 2, 4, 6], // Domingo, Martes, Jueves, Sábado
    preferredTrainingTime = '18:00',
    splitPreference = 'fullbody',
    trainingExperience = 'intermediate',
    trainingGoals = ['hypertrophy'],
    sessionDurationPreference = 60, // en minutos
    exercisePreferences = {
      favorites: [],
      excluded: [],
      preferredEquipment: []
    },
    currentPhase = 1,
    autoRegulation = true,
    useMetricSystem = true
  }) {
    this.preferredTrainingDays = preferredTrainingDays;
    this.restDays = restDays;
    this.preferredTrainingTime = preferredTrainingTime;
    this.splitPreference = splitPreference;
    this.trainingExperience = trainingExperience;
    this.trainingGoals = trainingGoals;
    this.sessionDurationPreference = sessionDurationPreference;
    this.exercisePreferences = exercisePreferences;
    this.currentPhase = currentPhase;
    this.autoRegulation = autoRegulation;
    this.useMetricSystem = useMetricSystem;
  }
}

/**
 * Modelo para Preferencias de UI
 * Almacena las preferencias relacionadas con la interfaz de usuario
 */
export class UIPreferences {
  constructor({
    darkMode = false,
    language = 'es',
    colorScheme = 'default',
    fontSize = 'medium',
    compactMode = false,
    showDetailedStats = true,
    defaultView = 'today'
  }) {
    this.darkMode = darkMode;
    this.language = language;
    this.colorScheme = colorScheme;
    this.fontSize = fontSize;
    this.compactMode = compactMode;
    this.showDetailedStats = showDetailedStats;
    this.defaultView = defaultView;
  }
}

/**
 * Modelo para Preferencias de Notificaciones
 * Almacena las preferencias relacionadas con las notificaciones
 */
export class NotificationPreferences {
  constructor({
    enabled = true,
    reminderDays = [1, 3, 5], // Lunes, Miércoles, Viernes
    reminderTime = '18:00',
    notifyMissedWorkouts = true,
    notifyAchievements = true,
    notifyDeloadWeeks = true,
    notifyPlanUpdates = true,
    vibration = true,
    sound = true
  }) {
    this.enabled = enabled;
    this.reminderDays = reminderDays;
    this.reminderTime = reminderTime;
    this.notifyMissedWorkouts = notifyMissedWorkouts;
    this.notifyAchievements = notifyAchievements;
    this.notifyDeloadWeeks = notifyDeloadWeeks;
    this.notifyPlanUpdates = notifyPlanUpdates;
    this.vibration = vibration;
    this.sound = sound;
  }
}

/**
 * Modelo para Datos de Salud
 * Almacena información relacionada con la salud del usuario
 */
export class HealthData {
  constructor({
    weight = 70,
    height = 170,
    age = 30,
    gender = 'male',
    injuries = [],
    limitations = [],
    fitnessLevel = 'intermediate',
    bodyFatPercentage = 15,
    restingHeartRate = 60,
    sleepQuality = 'good',
    stressLevel = 'medium',
    recoveryCapacity = 'normal'
  } = {}) {
    this.weight = weight;
    this.height = height;
    this.age = age;
    this.gender = gender;
    this.injuries = injuries;
    this.limitations = limitations;
    this.fitnessLevel = fitnessLevel;
    this.bodyFatPercentage = bodyFatPercentage;
    this.restingHeartRate = restingHeartRate;
    this.sleepQuality = sleepQuality;
    this.stressLevel = stressLevel;
    this.recoveryCapacity = recoveryCapacity;
  }
}
